import type {
  DayMood,
  DaySummary,
  GuidedAnswer,
  HeatmapDay,
  Mood,
  Note,
  NoteInput,
  QuestionKey,
  SearchResult,
  Tag,
  WritingStats,
} from "@/lib/types";
import { calculateStreaks } from "@/lib/utils/streaks";

import { getDatabase } from "./index";

type NoteRow = {
  id: number;
  title: string;
  content: string;
  time: string;
  date: string;
  mood: Mood;
  tags: string;
  created_at: string;
  updated_at: string;
};

function parseTags(raw: string): Tag[] {
  try {
    const parsed = JSON.parse(raw) as Tag[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapNote(row: NoteRow): Note {
  return {
    ...row,
    tags: parseTags(row.tags),
  };
}

export async function getNotesByDate(date: string): Promise<Note[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<NoteRow>(
    "SELECT * FROM notes WHERE date = ? ORDER BY time ASC, created_at ASC",
    date,
  );
  return rows.map(mapNote);
}

export async function getNoteById(id: number): Promise<Note | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<NoteRow>(
    "SELECT * FROM notes WHERE id = ?",
    id,
  );
  return row ? mapNote(row) : null;
}

export async function createNote(input: NoteInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO notes (title, content, time, date, mood, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    input.title,
    input.content,
    input.time,
    input.date,
    input.mood,
    JSON.stringify(input.tags),
  );
  return result.lastInsertRowId;
}

export async function updateNote(
  id: number,
  input: NoteInput,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE notes
     SET title = ?, content = ?, time = ?, date = ?, mood = ?, tags = ?,
         updated_at = datetime('now')
     WHERE id = ?`,
    input.title,
    input.content,
    input.time,
    input.date,
    input.mood,
    JSON.stringify(input.tags),
    id,
  );
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM notes WHERE id = ?", id);
}

export async function getDayMood(date: string): Promise<DayMood | null> {
  const db = await getDatabase();
  return db.getFirstAsync<DayMood>(
    "SELECT date, mood FROM day_moods WHERE date = ?",
    date,
  );
}

export async function setDayMood(date: string, mood: Mood): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO day_moods (date, mood) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET mood = excluded.mood`,
    date,
    mood,
  );
}

export async function getGuidedAnswers(
  date: string,
): Promise<GuidedAnswer[]> {
  const db = await getDatabase();
  return db.getAllAsync<GuidedAnswer>(
    "SELECT * FROM guided_answers WHERE date = ? ORDER BY question_key ASC",
    date,
  );
}

export async function upsertGuidedAnswer(
  date: string,
  questionKey: QuestionKey,
  answer: string,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO guided_answers (date, question_key, answer)
     VALUES (?, ?, ?)
     ON CONFLICT(date, question_key) DO UPDATE SET answer = excluded.answer`,
    date,
    questionKey,
    answer,
  );
}

export async function getMonthSummaries(
  start: string,
  end: string,
): Promise<DaySummary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    date: string;
    note_count: number;
    mood: Mood | null;
  }>(
    `SELECT
       d.date,
       COALESCE(n.note_count, 0) AS note_count,
       dm.mood
     FROM (
       SELECT date FROM notes WHERE date BETWEEN ? AND ?
       UNION
       SELECT date FROM day_moods WHERE date BETWEEN ? AND ?
     ) d
     LEFT JOIN (
       SELECT date, COUNT(*) AS note_count
       FROM notes WHERE date BETWEEN ? AND ?
       GROUP BY date
     ) n ON n.date = d.date
     LEFT JOIN day_moods dm ON dm.date = d.date
     WHERE d.date BETWEEN ? AND ?`,
    start,
    end,
    start,
    end,
    start,
    end,
    start,
    end,
  );

  return rows.map((r) => ({
    date: r.date,
    noteCount: r.note_count,
    mood: r.mood,
  }));
}

export async function searchNotes(query: string): Promise<SearchResult[]> {
  const db = await getDatabase();
  const pattern = `%${query.trim()}%`;
  return db.getAllAsync<SearchResult>(
    `SELECT id, title, content, date, time, mood
     FROM notes
     WHERE title LIKE ? OR content LIKE ?
     ORDER BY date DESC, time DESC`,
    pattern,
    pattern,
  );
}

export async function searchNotesByDate(date: string): Promise<SearchResult[]> {
  const db = await getDatabase();
  return db.getAllAsync<SearchResult>(
    `SELECT id, title, content, date, time, mood
     FROM notes WHERE date = ?
     ORDER BY time ASC`,
    date,
  );
}

export async function getWritingStats(): Promise<WritingStats> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ date: string }>(
    `SELECT DISTINCT date FROM (
       SELECT date FROM notes
       UNION
       SELECT date FROM guided_answers WHERE answer != ''
     ) ORDER BY date ASC`,
  );

  const dates = rows.map((r) => r.date);
  const { currentStreak, maxStreak } = calculateStreaks(dates);

  return {
    daysWritten: dates.length,
    currentStreak,
    maxStreak,
  };
}

export async function getHeatmapData(
  start: string,
  end: string,
): Promise<HeatmapDay[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    date: string;
    mood: Mood | null;
    has_notes: number;
  }>(
    `SELECT
       d.date,
       dm.mood,
       CASE WHEN n.date IS NOT NULL THEN 1 ELSE 0 END AS has_notes
     FROM (
       SELECT date FROM notes WHERE date BETWEEN ? AND ?
       UNION
       SELECT date FROM day_moods WHERE date BETWEEN ? AND ?
     ) d
     LEFT JOIN day_moods dm ON dm.date = d.date
     LEFT JOIN (SELECT DISTINCT date FROM notes) n ON n.date = d.date
     WHERE d.date BETWEEN ? AND ?
     ORDER BY d.date ASC`,
    start,
    end,
    start,
    end,
    start,
    end,
  );

  return rows.map((r) => ({
    date: r.date,
    mood: r.mood,
    hasNotes: r.has_notes === 1,
  }));
}
