import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Checkbox } from '../components/common/Checkbox';
import { templateService } from '../services/templateService';
import { listService } from '../services/listService';
import { Template, UserList, UserListItem } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeLists, setActiveLists] = useState<UserList[]>([]);
  const [listItemsMap, setListItemsMap] = useState<Record<string, UserListItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [templatesData, listsData] = await Promise.all([
        templateService.getAllTemplates(),
        listService.getAllLists(),
      ]);
      setTemplates(templatesData);
      setActiveLists(listsData);
      
      // Load items for each list
      const itemsMap: Record<string, UserListItem[]> = {};
      await Promise.all(
        listsData.map(async (list) => {
          const items = await listService.getListItems(list.id);
          itemsMap[list.id] = items;
        })
      );
      setListItemsMap(itemsMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    try {
      await listService.toggleListItem(itemId);
      // Update local state
      setListItemsMap(prev => ({
        ...prev,
        [listId]: prev[listId].map(item =>
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        ),
      }));
    } catch (error) {
      console.error('Error toggling item:', error);
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
      textShadowRadius: 3,
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
      {activeLists.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No active lists. Create one from a template.
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kanbanContainer}>
          {activeLists.map((list) => {
            const items = listItemsMap[list.id] || [];
            const completedCount = items.filter(item => item.isCompleted).length;
            const totalCount = items.length;
            
            return (
              <Card key={list.id} style={styles.kanbanCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ActiveList', { listId: list.id })}
                  style={[styles.kanbanHeader, { borderBottomColor: theme.colors.border }]}
                >
                  <Text style={[styles.kanbanTitle, textStyle]}>{list.title}</Text>
                  <Text style={[styles.kanbanProgress, { color: theme.colors.textSecondary }]}>
                    {completedCount}/{totalCount}
                  </Text>
                </TouchableOpacity>
                <ScrollView style={styles.kanbanItems} nestedScrollEnabled>
                  {items.map((item) => (
                    <View key={item.id} style={styles.kanbanItem}>
                      <Checkbox
                        checked={item.isCompleted}
                        onToggle={() => handleToggleItem(list.id, item.id)}
                      />
                      <Text
                        style={[
                          styles.kanbanItemText,
                          {
                            color: item.isCompleted ? theme.colors.textSecondary : theme.colors.text,
                            textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </Card>
            );
          })}
        </ScrollView>
      )}
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
  kanbanContainer: {
    marginTop: 8,
  },
  kanbanCard: {
    width: 300,
    marginRight: 16,
    maxHeight: 500,
  },
  kanbanHeader: {
    padding: 12,
    borderBottomWidth: 1,
  },
  kanbanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kanbanProgress: {
    fontSize: 12,
  },
  kanbanItems: {
    maxHeight: 400,
    padding: 8,
  },
  kanbanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  kanbanItemText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
});

