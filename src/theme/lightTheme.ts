import { colors } from './colors';
import { typography } from './typography';

export const lightTheme = {
  colors: {
    background: colors.light.background,
    surface: colors.light.surface,
    primary: colors.light.primary,
    accent: colors.light.accent,
    text: colors.light.text,
    textSecondary: colors.light.textSecondary,
    border: colors.light.border,
    glow: undefined as string | undefined,
  },
  typography,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof lightTheme;

