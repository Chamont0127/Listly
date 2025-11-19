import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { ListView } from '../components/list/ListView';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { listService } from '../services/listService';
import { UserList, UserListItem } from '../types';

type ActiveListScreenRouteProp = RouteProp<RootStackParamList, 'ActiveList'>;
type ActiveListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ActiveList'>;

export default function ActiveListScreen() {
  const route = useRoute<ActiveListScreenRouteProp>();
  const navigation = useNavigation<ActiveListScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { listId } = route.params;

  const [list, setList] = useState<UserList | null>(null);
  const [items, setItems] = useState<UserListItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
    const unsubscribe = navigation.addListener('focus', loadList);
    return unsubscribe;
  }, [navigation]);

  const loadList = async () => {
    try {
      const [listData, itemsData] = await Promise.all([
        listService.getListById(listId),
        listService.getListItems(listId),
      ]);
      setList(listData || null);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading list:', error);
      Alert.alert('Error', 'Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (id: string) => {
    try {
      await listService.toggleListItem(id);
      setItems(items.map(item => 
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      ));
    } catch (error) {
      console.error('Error toggling item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await listService.deleteListItem(id);
              setItems(items.filter(item => item.id !== id));
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) {
      return;
    }

    try {
      const newItem = await listService.addItemToList(listId, newItemText.trim());
      setItems([...items, newItem]);
      setNewItemText('');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleCompleteList = async () => {
    Alert.alert(
      'Complete List',
      'Mark this list as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await listService.completeList(listId);
              navigation.goBack();
            } catch (error) {
              console.error('Error completing list:', error);
              Alert.alert('Error', 'Failed to complete list');
            }
          },
        },
      ]
    );
  };

  const handleDeleteList = async () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await listService.deleteList(listId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting list:', error);
              Alert.alert('Error', 'Failed to delete list');
            }
          },
        },
      ]
    );
  };

  if (loading || !list) {
    return null; // Could add a loading spinner here
  }

  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;

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
        <Text style={[styles.title, textStyle]}>{list.title}</Text>
        <Text style={[styles.progress, { color: theme.colors.textSecondary }]}>
          {completedCount} / {totalCount} completed
        </Text>
      </View>

      <View style={styles.addItemContainer}>
        <Input
          value={newItemText}
          onChangeText={setNewItemText}
          placeholder="Add new item"
          onSubmitEditing={handleAddItem}
          style={styles.input}
        />
        <Button
          title="Add"
          onPress={handleAddItem}
          variant="secondary"
          style={styles.addButton}
        />
      </View>

      <ListView
        items={items}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
      />

      <View style={styles.actions}>
        <Button
          title="Complete List"
          onPress={handleCompleteList}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Delete List"
          onPress={handleDeleteList}
          variant="outline"
          style={[styles.actionButton, { borderColor: '#FF0000' }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
  },
  addItemContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    minWidth: 80,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
  },
});

