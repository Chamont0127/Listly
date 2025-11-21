import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  style?: ViewStyle;
}

export function Checkbox({ checked, onToggle, label, style }: CheckboxProps) {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
          },
          isDark && checked && theme.colors.glow && {
            borderColor: theme.colors.glow,
            backgroundColor: theme.colors.glow,
          },
        ]}
      >
        {checked && (
          <View
            style={[
              styles.checkmark,
              isDark && theme.colors.glow && {
                borderColor: '#000000',
              },
            ]}
          />
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.text },
            isDark && theme.colors.glow && {
              textShadowColor: theme.colors.glow,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 3,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkmark: {
    width: 6,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
});

