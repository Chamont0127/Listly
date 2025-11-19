import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { templateService } from '../services/templateService';
import { listService } from '../services/listService';
import { Template, UserList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeLists, setActiveLists] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, listsData] = await Promise.all([
        templateService.getAllTemplates(),
        listService.getAllLists(),
      ]);
      setTemplates(templatesData);
      setActiveLists(listsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = (template: Template) => {
    navigation.navigate('ListCreationSwiper', { templateId: template.id });
  };

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
        <Button
          title="Manage Templates"
          onPress={() => navigation.navigate('TemplateManager')}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
          variant="outline"
          style={styles.button}
        />
      </View>

      <Text style={[styles.sectionTitle, textStyle]}>Templates</Text>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, textStyle]}>{item.title}</Text>
              <Button
                title="Create List"
                onPress={() => handleCreateList(item)}
                style={styles.createButton}
              />
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No templates yet. Create one in Templates.
          </Text>
        }
      />

      <Text style={[styles.sectionTitle, textStyle]}>Active Lists</Text>
      <FlatList
        data={activeLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ActiveList', { listId: item.id })}
          >
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, textStyle]}>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No active lists. Create one from a template.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  button: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  createButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
  },
});

