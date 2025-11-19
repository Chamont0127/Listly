import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { SwipeableCard } from '../components/list/SwipeableCard';
import { templateService } from '../services/templateService';
import { listService } from '../services/listService';
import { ListItem } from '../types';

type ListCreationSwiperRouteProp = RouteProp<RootStackParamList, 'ListCreationSwiper'>;
type ListCreationSwiperNavigationProp = StackNavigationProp<RootStackParamList, 'ListCreationSwiper'>;

export default function ListCreationSwiper() {
  const route = useRoute<ListCreationSwiperRouteProp>();
  const navigation = useNavigation<ListCreationSwiperNavigationProp>();
  const { theme, isDark } = useTheme();
  const { templateId } = route.params;

  const [templateItems, setTemplateItems] = useState<ListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTemplateItems();
  }, []);

  const loadTemplateItems = async () => {
    try {
      const items = await templateService.getTemplateItems(templateId);
      setTemplateItems(items);
    } catch (error) {
      console.error('Error loading template items:', error);
      Alert.alert('Error', 'Failed to load template items');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeRight = () => {
    const currentItem = templateItems[currentIndex];
    if (currentItem) {
      setSelectedItems([...selectedItems, currentItem]);
      moveToNext();
    }
  };

  const handleSwipeLeft = () => {
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < templateItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeListCreation();
    }
  };

  const completeListCreation = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items', 'Please select at least one item to create a list', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    setCreating(true);
    try {
      const template = await templateService.getTemplateById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const newList = await listService.createListFromTemplate(
        templateId,
        `${template.title} - ${new Date().toLocaleDateString()}`,
        selectedItems.map(item => item.id)
      );

      navigation.replace('ActiveList', { listId: newList.id });
    } catch (error) {
      console.error('Error creating list:', error);
      Alert.alert('Error', 'Failed to create list');
      setCreating(false);
    }
  };

  if (loading || creating) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          {creating ? 'Creating list...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  if (templateItems.length === 0) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          This template has no items.
        </Text>
      </View>
    );
  }

  const currentItem = templateItems[currentIndex];
  const progress = (currentIndex + 1) / templateItems.length;

  const textStyle = {
    color: theme.colors.text,
    ...(isDark && theme.colors.glow && {
      textShadowColor: theme.colors.glow,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    }),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, textStyle]}>
          {currentIndex + 1} of {templateItems.length}
        </Text>
        <Text style={[styles.subHeaderText, { color: theme.colors.textSecondary }]}>
          Swipe right to add, left to skip
        </Text>
      </View>

      {currentItem && (
        <SwipeableCard
          item={currentItem}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          progress={progress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 14,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

