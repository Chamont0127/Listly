import Dexie, { Table } from 'dexie';
import { Template, ListItem, UserList, UserListItem } from '../types';

export class ListlyDatabase extends Dexie {
  templates!: Table<Template>;
  listItems!: Table<ListItem>;
  userLists!: Table<UserList>;
  userListItems!: Table<UserListItem>;

  constructor() {
    super('ListlyDatabase');
    
    this.version(1).stores({
      templates: 'id, title, createdAt, updatedAt',
      listItems: 'id, templateId, order, createdAt',
      userLists: 'id, templateId, createdAt, updatedAt, completedAt',
      userListItems: 'id, userListId, listItemId, order, createdAt'
    });
  }
}

export const db = new ListlyDatabase();

