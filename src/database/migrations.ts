import { db } from './schema';

export async function runMigrations(): Promise<void> {
  // Future migrations can be added here
  // For now, Dexie handles schema creation automatically
  console.log('Database migrations completed');
}

