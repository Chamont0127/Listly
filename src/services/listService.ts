import { db } from '../database/schema';
import { UserList, UserListItem, ListItem } from '../types';
import { generateUUID } from '../utils/uuid';
import { getCurrentTimestamp } from '../utils/dateHelpers';

export const listService = {
  async getAllLists(): Promise<UserList[]> {
    return await db.userLists.orderBy('updatedAt').reverse().toArray();
  },

  async getListById(id: string): Promise<UserList | undefined> {
    return await db.userLists.get(id);
  },

  async createListFromTemplate(
    templateId: string,
    title: string,
    selectedItemIds: string[]
  ): Promise<UserList> {
    const now = getCurrentTimestamp();
    const list: UserList = {
      id: generateUUID(),
      templateId,
      title,
      createdAt: now,
      updatedAt: now,
    };
    await db.userLists.add(list);

    // Get the selected items from the template
    const templateItems = await db.listItems
      .where('id')
      .anyOf(selectedItemIds)
      .toArray();

    // Create user list items
    const userListItems: UserListItem[] = templateItems.map((item, index) => ({
      id: generateUUID(),
      userListId: list.id,
      listItemId: item.id,
      text: item.text,
      isCompleted: false,
      order: index,
      createdAt: now,
    }));

    await db.userListItems.bulkAdd(userListItems);
    return list;
  },

  async createCustomList(title: string): Promise<UserList> {
    const now = getCurrentTimestamp();
    const list: UserList = {
      id: generateUUID(),
      title,
      createdAt: now,
      updatedAt: now,
    };
    await db.userLists.add(list);
    return list;
  },

  async getListItems(userListId: string): Promise<UserListItem[]> {
    return await db.userListItems
      .where('userListId')
      .equals(userListId)
      .sortBy('order');
  },

  async toggleListItem(id: string): Promise<void> {
    const item = await db.userListItems.get(id);
    if (item) {
      await db.userListItems.update(id, { isCompleted: !item.isCompleted });
      // Update parent list's updatedAt
      const list = await db.userLists.get(item.userListId);
      if (list) {
        await db.userLists.update(item.userListId, {
          updatedAt: getCurrentTimestamp(),
        });
      }
    }
  },

  async addItemToList(
    userListId: string,
    text: string,
    order?: number
  ): Promise<UserListItem> {
    const items = await this.getListItems(userListId);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : -1;

    const item: UserListItem = {
      id: generateUUID(),
      userListId,
      text,
      isCompleted: false,
      order: order !== undefined ? order : maxOrder + 1,
      createdAt: getCurrentTimestamp(),
    };
    await db.userListItems.add(item);

    // Update parent list's updatedAt
    await db.userLists.update(userListId, {
      updatedAt: getCurrentTimestamp(),
    });

    return item;
  },

  async deleteListItem(id: string): Promise<void> {
    const item = await db.userListItems.get(id);
    if (item) {
      await db.userListItems.delete(id);
      // Update parent list's updatedAt
      await db.userLists.update(item.userListId, {
        updatedAt: getCurrentTimestamp(),
      });
    }
  },

  async updateList(id: string, updates: Partial<UserList>): Promise<void> {
    await db.userLists.update(id, {
      ...updates,
      updatedAt: getCurrentTimestamp(),
    });
  },

  async deleteList(id: string): Promise<void> {
    // Delete all associated list items
    await db.userListItems.where('userListId').equals(id).delete();
    // Delete the list
    await db.userLists.delete(id);
  },

  async completeList(id: string): Promise<void> {
    const now = getCurrentTimestamp();
    
    // Mark all items in the list as completed
    const items = await this.getListItems(id);
    await db.transaction('rw', db.userListItems, async () => {
      for (const item of items) {
        if (!item.isCompleted) {
          await db.userListItems.update(item.id, { isCompleted: true });
        }
      }
    });
    
    // Mark the list as completed
    await db.userLists.update(id, {
      completedAt: now,
      updatedAt: now,
    });
  },
};

