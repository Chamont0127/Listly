import { colors } from './colors';
import { typography } from './typography';
import { Theme } from './lightTheme';

export const darkTheme: Theme = {
  colors: {
    background: colors.dark.background,
    surface: colors.dark.surface,
    primary: colors.dark.primary,
    accent: colors.dark.accent,
    text: colors.dark.text,
    textSecondary: colors.dark.textSecondary,
    border: colors.dark.border,
    glow: colors.dark.glow,
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
      shadowColor: colors.dark.glow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.dark.glow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 4,
    },
    large: {
      shadowColor: colors.dark.glow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

