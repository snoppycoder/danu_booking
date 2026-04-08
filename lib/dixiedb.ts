// dixiedb.ts
import Dexie, { Table } from "dexie";

export interface Notification {
  user_id: string;
  id: string;
  type: string;
  title?: string;
  data: Record<string, string | number>;
  message?: string;
  created_at: string;
  received_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

class NotificationDB extends Dexie {
  notifications!: Table<Notification, string>;
  settings!: Table<Setting, string>; // key is primary key

  constructor() {
    super("NotificationDB");
    this.version(1).stores({
      notifications: "id, type, created_at",
      settings: "key",
    });
  }
}

const db = new NotificationDB();
export default db;
