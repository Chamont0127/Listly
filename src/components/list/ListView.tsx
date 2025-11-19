import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ListItemCard } from './ListItemCard';
import { UserListItem } from '../../types';

interface ListViewProps {
  items: UserListItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
}

export function ListView({ items, onToggleItem, onDeleteItem }: ListViewProps) {
  const { theme } = useTheme();

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItemCard
          item={item}
          onToggle={() => onToggleItem(item.id)}
          onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
        />
      )}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: theme.colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

