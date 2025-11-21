import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/common/Button';
import { TemplateCard } from '../components/template/TemplateCard';
import { templateService } from '../services/templateService';
import { Template } from '../types';

type TemplateManagerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplateManager'>;

export default function TemplateManagerScreen() {
  const navigation = useNavigation<TemplateManagerScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
    const unsubscribe = navigation.addListener('focus', loadTemplates);
    return unsubscribe;
  }, [navigation]);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    navigation.navigate('TemplateEdit', {});
  };

  const handleEditTemplate = (template: Template) => {
    navigation.navigate('TemplateEdit', { templateId: template.id });
  };

  const handleDeleteTemplate = (template: Template) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await templateService.deleteTemplate(template.id);
              loadTemplates();
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
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
      <Button
        title="Create New Template"
        onPress={handleCreateTemplate}
        style={styles.createButton}
      />

      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            onPress={() => handleEditTemplate(item)}
            onDelete={() => handleDeleteTemplate(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No templates yet. Create your first template!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 64,
    fontSize: 16,
  },
});

