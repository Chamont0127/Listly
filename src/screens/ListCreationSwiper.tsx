import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { SwipeableCard } from '../components/list/SwipeableCard';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
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
  const [showExitDialog, setShowExitDialog] = useState(false);

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
    console.log('handleSwipeRight called', { currentIndex });
    const currentItem = templateItems[currentIndex];
    if (currentItem) {
      const updatedSelectedItems = [...selectedItems, currentItem];
      setSelectedItems(updatedSelectedItems);
      moveToNext(updatedSelectedItems);
    }
  };

  const handleSwipeLeft = () => {
    console.log('handleSwipeLeft called', { currentIndex });
    moveToNext(selectedItems);
  };

  const moveToNext = (itemsToUse: ListItem[]) => {
    console.log('moveToNext called', { currentIndex, totalItems: templateItems.length, itemsToUseCount: itemsToUse.length });
    if (currentIndex < templateItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('All items processed, completing list creation');
      completeListCreation(itemsToUse);
    }
  };

  const completeListCreation = async (itemsToUse: ListItem[]) => {
    console.log('completeListCreation called', { itemsCount: itemsToUse.length });
    if (itemsToUse.length === 0) {
      Alert.alert('No Items', 'Please select at least one item to create a list', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    setCreating(true);
    try {
      console.log('Fetching template...');
      const template = await templateService.getTemplateById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      console.log('Creating list from template...');
      const newList = await listService.createListFromTemplate(
        templateId,
        `${template.title} - ${new Date().toLocaleDateString()}`,
        itemsToUse.map(item => item.id)
      );

      console.log('List created successfully, navigating to Home', newList);
      // Navigate back to Home to show all lists in kanban format
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
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
      textShadowRadius: 3,
    }),
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerText, textStyle]}>
              {currentIndex + 1} of {templateItems.length}
            </Text>
            <Text style={[styles.subHeaderText, { color: theme.colors.textSecondary }]}>
              Swipe right to add, left to skip
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleExit}
            style={[styles.exitButton, { borderColor: theme.colors.border }]}
          >
            <Text style={[styles.exitButtonText, { color: theme.colors.textSecondary }]}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentItem && (
        <>
          <SwipeableCard
            key={currentItem.id}
            item={currentItem}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            progress={progress}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Skip"
              onPress={handleSwipeLeft}
              variant="outline"
              style={[styles.actionButton, { borderColor: '#FF0000' }]}
            />
            <Button
              title="Add"
              onPress={handleSwipeRight}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
        </>
      )}

      <ConfirmDialog
        visible={showExitDialog}
        title="Exit List Creation"
        message="Are you sure you want to exit? Your progress will be lost."
        confirmText="Exit"
        cancelText="Cancel"
        onConfirm={confirmExit}
        onCancel={() => setShowExitDialog(false)}
        destructive
      />
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
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
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
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 16,
  },
  exitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    maxWidth: 150,
  },
});

