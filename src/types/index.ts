export interface Template {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface ListItem {
  id: string;
  templateId: string;
  text: string;
  order: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: number;
  createdAt: number;
}

export interface UserList {
  id: string;
  templateId?: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface UserListItem {
  id: string;
  userListId: string;
  listItemId?: string;
  text: string;
  isCompleted: boolean;
  order: number;
  createdAt: number;
}

