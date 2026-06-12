import { create } from "zustand";

import type { EventRow } from "@/lib/db";

type AppState = {
  dbReady: boolean;
  selectedDate: string;
  events: EventRow[];
  setDbReady: (ready: boolean) => void;
  setSelectedDate: (date: string) => void;
  setEvents: (events: EventRow[]) => void;
};

const today = new Date().toISOString().split("T")[0];

export const useAppStore = create<AppState>((set) => ({
  dbReady: false,
  selectedDate: today,
  events: [],
  setDbReady: (ready) => set({ dbReady: ready }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setEvents: (events) => set({ events }),
}));
