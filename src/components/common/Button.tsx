import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme, isDark } = useTheme();

  const getButtonStyle = () => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: theme.colors.surface,
      };
    }
    return {
      backgroundColor: theme.colors.primary,
    };
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: theme.colors.primary };
    }
    if (variant === 'secondary') {
      return { color: theme.colors.text };
    }
    // For primary buttons, use black text if the primary color is bright/green (dark theme)
    // Otherwise use white text (light theme with blue)
    const isBrightColor = theme.colors.primary === '#00FF41' || 
                         theme.colors.primary.toLowerCase().includes('00ff') ||
                         theme.colors.primary.toLowerCase().includes('green');
    return { color: isBrightColor ? '#000000' : '#FFFFFF' };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

