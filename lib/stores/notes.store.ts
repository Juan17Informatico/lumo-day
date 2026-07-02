import { create } from "zustand";

import * as repo from "@/lib/db/notes.repository";
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
  WritingStats,
} from "@/lib/types";

type NotesState = {
  notes: Note[];
  dayMood: DayMood | null;
  guidedAnswers: GuidedAnswer[];
  monthSummaries: DaySummary[];
  searchResults: SearchResult[];
  stats: WritingStats | null;
  heatmapData: HeatmapDay[];
  loading: boolean;

  loadDay: (date: string) => Promise<void>;
  loadMonth: (start: string, end: string) => Promise<void>;
  loadStats: () => Promise<void>;
  loadHeatmap: (start: string, end: string) => Promise<void>;
  search: (query: string) => Promise<void>;
  searchByDate: (date: string) => Promise<void>;
  createNote: (input: NoteInput) => Promise<number>;
  updateNote: (id: number, input: NoteInput) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  setDayMood: (date: string, mood: Mood) => Promise<void>;
  saveGuidedAnswer: (
    date: string,
    key: QuestionKey,
    answer: string,
  ) => Promise<void>;
  clearSearch: () => void;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  dayMood: null,
  guidedAnswers: [],
  monthSummaries: [],
  searchResults: [],
  stats: null,
  heatmapData: [],
  loading: false,

  loadDay: async (date) => {
    set({ loading: true });
    const [notes, dayMood, guidedAnswers] = await Promise.all([
      repo.getNotesByDate(date),
      repo.getDayMood(date),
      repo.getGuidedAnswers(date),
    ]);
    set({ notes, dayMood, guidedAnswers, loading: false });
  },

  loadMonth: async (start, end) => {
    const monthSummaries = await repo.getMonthSummaries(start, end);
    set({ monthSummaries });
  },

  loadStats: async () => {
    const stats = await repo.getWritingStats();
    set({ stats });
  },

  loadHeatmap: async (start, end) => {
    const heatmapData = await repo.getHeatmapData(start, end);
    set({ heatmapData });
  },

  search: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    const searchResults = await repo.searchNotes(query);
    set({ searchResults });
  },

  searchByDate: async (date) => {
    const searchResults = await repo.searchNotesByDate(date);
    set({ searchResults });
  },

  createNote: async (input) => {
    const id = await repo.createNote(input);
    await get().loadDay(input.date);
    return id;
  },

  updateNote: async (id, input) => {
    await repo.updateNote(id, input);
    await get().loadDay(input.date);
  },

  deleteNote: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    await repo.deleteNote(id);
    if (note) {
      await get().loadDay(note.date);
    }
  },

  setDayMood: async (date, mood) => {
    await repo.setDayMood(date, mood);
    const dayMood = await repo.getDayMood(date);
    set({ dayMood });
  },

  saveGuidedAnswer: async (date, key, answer) => {
    await repo.upsertGuidedAnswer(date, key, answer);
    const guidedAnswers = await repo.getGuidedAnswers(date);
    set({ guidedAnswers });
  },

  clearSearch: () => set({ searchResults: [] }),
}));
