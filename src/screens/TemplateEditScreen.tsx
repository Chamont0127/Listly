import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { TemplateForm } from '../components/template/TemplateForm';
import { templateService } from '../services/templateService';
import { ListItem } from '../types';

type TemplateEditScreenRouteProp = RouteProp<RootStackParamList, 'TemplateEdit'>;
type TemplateEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplateEdit'>;

export default function TemplateEditScreen() {
  const route = useRoute<TemplateEditScreenRouteProp>();
  const navigation = useNavigation<TemplateEditScreenNavigationProp>();
  const { theme } = useTheme();
  const { templateId } = route.params || {};

  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(!!templateId);

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      const template = await templateService.getTemplateById(templateId!);
      if (template) {
        setTitle(template.title);
        const templateItems = await templateService.getTemplateItems(templateId!);
        setItems(templateItems);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      Alert.alert('Error', 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (text: string) => {
    if (templateId) {
      const newItem = await templateService.addItemToTemplate(templateId, text);
      setItems([...items, newItem]);
    } else {
      // For new templates, create item locally
      const newItem: ListItem = {
        id: `temp-${Date.now()}`,
        templateId: '',
        text,
        order: items.length,
        createdAt: Date.now(),
      };
      setItems([...items, newItem]);
    }
  };

  const handleUpdateItem = async (id: string, text: string) => {
    if (templateId) {
      await templateService.updateListItem(id, { text });
      setItems(items.map(item => item.id === id ? { ...item, text } : item));
    } else {
      setItems(items.map(item => item.id === id ? { ...item, text } : item));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (templateId) {
      await templateService.deleteListItem(id);
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a template title');
      return;
    }

    try {
      if (templateId) {
        // Update existing template
        await templateService.updateTemplate(templateId, title);
        // Items are already saved individually
      } else {
        // Create new template
        const newTemplate = await templateService.createTemplate(title);
        // Add all items to the new template
        for (const item of items) {
          await templateService.addItemToTemplate(newTemplate.id, item.text, item.order);
        }
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template');
    }
  };

  if (loading) {
    return null; // Could add a loading spinner here
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TemplateForm
        title={title}
        items={items}
        onTitleChange={setTitle}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

