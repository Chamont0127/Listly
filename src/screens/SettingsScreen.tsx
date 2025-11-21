import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

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
      <Card>
        <Text style={[styles.sectionTitle, textStyle]}>Theme</Text>
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              themeMode === 'light' && styles.optionSelected,
              { borderColor: theme.colors.border },
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[styles.optionText, textStyle]}>Light</Text>
            {themeMode === 'light' && (
              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              themeMode === 'dark' && styles.optionSelected,
              { borderColor: theme.colors.border },
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[styles.optionText, textStyle]}>Matrix (Dark)</Text>
            {themeMode === 'dark' && (
              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              themeMode === 'auto' && styles.optionSelected,
              { borderColor: theme.colors.border },
            ]}
            onPress={() => setThemeMode('auto')}
          >
            <Text style={[styles.optionText, textStyle]}>Auto</Text>
            {themeMode === 'auto' && (
              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={[styles.infoTitle, textStyle]}>About Listly</Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Create lists from templates with a swipe!
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  optionSelected: {
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoCard: {
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginTop: 4,
  },
});

