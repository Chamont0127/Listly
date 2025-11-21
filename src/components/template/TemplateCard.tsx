import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { Template } from '../../types';

interface TemplateCardProps {
  template: Template;
  onPress: () => void;
  onDelete?: () => void;
}

export function TemplateCard({ template, onPress, onDelete }: TemplateCardProps) {
  const { theme, isDark } = useTheme();

  const textStyle = {
    color: theme.colors.text,
    ...(isDark && theme.colors.glow && {
      textShadowColor: theme.colors.glow,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
    }),
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <Text style={[styles.title, textStyle]}>{template.title}</Text>
          {onDelete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.deleteButton}
            >
              <Text style={[styles.deleteText, { color: '#FF0000' }]}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
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

