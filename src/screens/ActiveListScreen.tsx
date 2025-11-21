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
import { ConfirmDialog } from '../components/common/ConfirmDialog';
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
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteItemDialog, setShowDeleteItemDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setShowDeleteItemDialog(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await listService.deleteListItem(itemToDelete);
      setItems(items.filter(item => item.id !== itemToDelete));
      setShowDeleteItemDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
      setShowDeleteItemDialog(false);
      setItemToDelete(null);
    }
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

  const handleCompleteList = () => {
    setShowCompleteDialog(true);
  };

  const confirmCompleteList = async () => {
    try {
      await listService.completeList(listId);
      // Update local state to reflect all items as completed
      setItems(items.map(item => ({ ...item, isCompleted: true })));
      setShowCompleteDialog(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error completing list:', error);
      Alert.alert('Error', 'Failed to complete list');
      setShowCompleteDialog(false);
    }
  };

  const handleDeleteList = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteList = async () => {
    try {
      await listService.deleteList(listId);
      setShowDeleteDialog(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting list:', error);
      Alert.alert('Error', 'Failed to delete list');
      setShowDeleteDialog(false);
    }
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
      textShadowRadius: 3,
    }),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
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

      <View style={[styles.actions, { borderTopColor: theme.colors.border }]}>
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

      <ConfirmDialog
        visible={showCompleteDialog}
        title="Complete List"
        message="Mark this list as completed?"
        confirmText="Complete"
        cancelText="Cancel"
        onConfirm={confirmCompleteList}
        onCancel={() => setShowCompleteDialog(false)}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteList}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />

      <ConfirmDialog
        visible={showDeleteItemDialog}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteItem}
        onCancel={() => {
          setShowDeleteItemDialog(false);
          setItemToDelete(null);
        }}
        destructive
      />
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
  },
  actionButton: {
    flex: 1,
  },
});

