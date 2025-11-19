import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import TemplateManagerScreen from '../screens/TemplateManagerScreen';
import TemplateEditScreen from '../screens/TemplateEditScreen';
import ListCreationSwiper from '../screens/ListCreationSwiper';
import ActiveListScreen from '../screens/ActiveListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Listly' }}
        />
        <Stack.Screen
          name="TemplateManager"
          component={TemplateManagerScreen}
          options={{ title: 'Templates' }}
        />
        <Stack.Screen
          name="TemplateEdit"
          component={TemplateEditScreen}
          options={{ title: 'Edit Template' }}
        />
        <Stack.Screen
          name="ListCreationSwiper"
          component={ListCreationSwiper}
          options={{ title: 'Create List', headerLeft: () => null }}
        />
        <Stack.Screen
          name="ActiveList"
          component={ActiveListScreen}
          options={{ title: 'List' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

