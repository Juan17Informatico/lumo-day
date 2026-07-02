export type Mood = "excellent" | "normal" | "bad";

export type Tag = "work" | "personal" | "ideas" | "health";

export type QuestionKey = "learned" | "went_well" | "improve";

export type Note = {
  id: number;
  title: string;
  content: string;
  time: string;
  date: string;
  mood: Mood;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export type NoteInput = {
  title: string;
  content: string;
  time: string;
  date: string;
  mood: Mood;
  tags: Tag[];
};

export type DayMood = {
  date: string;
  mood: Mood;
};

export type GuidedAnswer = {
  id: number;
  date: string;
  question_key: QuestionKey;
  answer: string;
};

export type DaySummary = {
  date: string;
  noteCount: number;
  mood: Mood | null;
};

export type SearchResult = {
  id: number;
  title: string;
  content: string;
  date: string;
  time: string;
  mood: Mood;
};

export type WritingStats = {
  daysWritten: number;
  currentStreak: number;
  maxStreak: number;
};

export type HeatmapDay = {
  date: string;
  mood: Mood | null;
  hasNotes: boolean;
};
