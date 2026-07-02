import type { QuestionKey } from "@/lib/types";

export const GUIDED_QUESTIONS: { key: QuestionKey; text: string }[] = [
  { key: "learned", text: "¿Qué aprendiste hoy?" },
  { key: "went_well", text: "¿Qué salió bien?" },
  { key: "improve", text: "¿Qué mejorarías?" },
];
