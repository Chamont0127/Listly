import { db } from '../database/schema';
import { Template, ListItem } from '../types';
import { generateUUID } from '../utils/uuid';
import { getCurrentTimestamp } from '../utils/dateHelpers';

export const templateService = {
  async getAllTemplates(): Promise<Template[]> {
    return await db.templates.orderBy('updatedAt').reverse().toArray();
  },

  async getTemplateById(id: string): Promise<Template | undefined> {
    return await db.templates.get(id);
  },

  async createTemplate(title: string): Promise<Template> {
    const now = getCurrentTimestamp();
    const template: Template = {
      id: generateUUID(),
      title,
      createdAt: now,
      updatedAt: now,
    };
    await db.templates.add(template);
    return template;
  },

  async updateTemplate(id: string, title: string): Promise<void> {
    await db.templates.update(id, {
      title,
      updatedAt: getCurrentTimestamp(),
    });
  },

  async deleteTemplate(id: string): Promise<void> {
    // Delete all associated list items
    await db.listItems.where('templateId').equals(id).delete();
    // Delete the template
    await db.templates.delete(id);
  },

  async getTemplateItems(templateId: string): Promise<ListItem[]> {
    return await db.listItems
      .where('templateId')
      .equals(templateId)
      .sortBy('order');
  },

  async addItemToTemplate(
    templateId: string,
    text: string,
    order?: number
  ): Promise<ListItem> {
    const items = await this.getTemplateItems(templateId);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : -1;
    
    const item: ListItem = {
      id: generateUUID(),
      templateId,
      text,
      order: order !== undefined ? order : maxOrder + 1,
      createdAt: getCurrentTimestamp(),
    };
    await db.listItems.add(item);
    return item;
  },

  async updateListItem(id: string, updates: Partial<ListItem>): Promise<void> {
    await db.listItems.update(id, updates);
  },

  async deleteListItem(id: string): Promise<void> {
    await db.listItems.delete(id);
  },

  async reorderItems(templateId: string, itemIds: string[]): Promise<void> {
    const updates = itemIds.map((id, index) => ({
      id,
      order: index,
    }));
    await db.transaction('rw', db.listItems, async () => {
      for (const update of updates) {
        await db.listItems.update(update.id, { order: update.order });
      }
    });
  },
};

