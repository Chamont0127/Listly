import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ListItem } from '../../types';

interface TemplateFormProps {
  title: string;
  items: ListItem[];
  onTitleChange: (title: string) => void;
  onAddItem: (text: string) => void;
  onUpdateItem: (id: string, text: string) => void;
  onDeleteItem: (id: string) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function TemplateForm({
  title,
  items,
  onTitleChange,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSave,
  onCancel,
}: TemplateFormProps) {
  const { theme, isDark } = useTheme();
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
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
      <Input
        label="Template Title"
        value={title}
        onChangeText={onTitleChange}
        placeholder="Enter template name"
      />

      <View style={styles.addItemContainer}>
        <Input
          value={newItemText}
          onChangeText={setNewItemText}
          placeholder="Add new item"
          onSubmitEditing={handleAddItem}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button title="Add" onPress={handleAddItem} variant="secondary" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <Input
              value={item.text}
              onChangeText={(text) => onUpdateItem(item.id, text)}
              style={styles.itemInput}
            />
            <TouchableOpacity
              onPress={() => onDeleteItem(item.id)}
              style={styles.deleteButton}
            >
              <Text style={[styles.deleteText, { color: '#FF0000' }]}>×</Text>
            </TouchableOpacity>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.buttons}>
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
        )}
        <Button
          title="Save"
          onPress={onSave}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  itemCard: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    flex: 1,
    marginBottom: 0,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  },
});

