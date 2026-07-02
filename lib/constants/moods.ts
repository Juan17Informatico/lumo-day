import type { Mood } from "@/lib/types";
import { moodColors } from "@/lib/constants/theme";

export const MOODS: {
  value: Mood;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { value: "excellent", label: "Excelente", emoji: "😊", color: moodColors.excellent },
  { value: "normal", label: "Normal", emoji: "😐", color: moodColors.normal },
  { value: "bad", label: "Malo", emoji: "😔", color: moodColors.bad },
];

export function getMoodMeta(mood: Mood) {
  return MOODS.find((m) => m.value === mood) ?? MOODS[1];
}
