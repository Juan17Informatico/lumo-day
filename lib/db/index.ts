import * as SQLite from "expo-sqlite";

const DB_NAME = "lumoday.db";

let db: SQLite.SQLiteDatabase | null = null;

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

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      time TEXT NOT NULL,
      date TEXT NOT NULL,
      mood TEXT NOT NULL DEFAULT 'normal',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS day_moods (
      date TEXT PRIMARY KEY,
      mood TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS guided_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      question_key TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      UNIQUE(date, question_key)
    );

    CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);
    CREATE INDEX IF NOT EXISTS idx_notes_date_time ON notes(date, time);
  `);

  return database;
}
