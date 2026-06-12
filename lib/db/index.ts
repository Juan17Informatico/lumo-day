import * as SQLite from "expo-sqlite";

const DB_NAME = "lumoday.db";

let db: SQLite.SQLiteDatabase | null = null;

export type EventRow = {
  id: number;
  title: string;
  date: string;
  created_at: string;
};

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
}

export async function initDatabase() {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return database;
}

export async function getEventsByDate(date: string) {
  const database = await getDatabase();
  return database.getAllAsync<EventRow>(
    "SELECT * FROM events WHERE date = ? ORDER BY created_at ASC",
    date,
  );
}

export async function insertEvent(title: string, date: string) {
  const database = await getDatabase();
  return database.runAsync(
    "INSERT INTO events (title, date) VALUES (?, ?)",
    title,
    date,
  );
}
