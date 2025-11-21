import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Checkbox } from '../common/Checkbox';
import { UserListItem } from '../../types';

interface ListItemCardProps {
  item: UserListItem;
  onToggle: () => void;
  onDelete?: () => void;
}

export function ListItemCard({ item, onToggle, onDelete }: ListItemCardProps) {
  const { theme, isDark } = useTheme();

  const textStyle = {
    color: item.isCompleted ? theme.colors.textSecondary : theme.colors.text,
    textDecorationLine: item.isCompleted ? 'line-through' : 'none',
    ...(isDark && theme.colors.glow && !item.isCompleted && {
      textShadowColor: theme.colors.glow,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
    }),
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Checkbox checked={item.isCompleted} onToggle={onToggle} />
      <Text style={[styles.text, textStyle]}>{item.text}</Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={[styles.deleteText, { color: '#FF0000' }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

