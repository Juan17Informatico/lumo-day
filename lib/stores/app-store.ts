import { create } from "zustand";

import { todayString } from "@/lib/utils/dates";

type AppState = {
  dbReady: boolean;
  selectedDate: string;
  setDbReady: (ready: boolean) => void;
  setSelectedDate: (date: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  dbReady: false,
  selectedDate: todayString(),
  setDbReady: (ready) => set({ dbReady: ready }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
