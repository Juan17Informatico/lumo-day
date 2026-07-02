import { useCallback, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { GUIDED_QUESTIONS } from "@/lib/constants/questions";
import { colors } from "@/lib/constants/theme";
import type { GuidedAnswer, QuestionKey } from "@/lib/types";

type Props = {
  answers: GuidedAnswer[];
  onSave: (key: QuestionKey, answer: string) => Promise<void>;
};

export function GuidedQuestions({ answers, onSave }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const getAnswer = useCallback(
    (key: QuestionKey) => {
      if (drafts[key] !== undefined) return drafts[key];
      return answers.find((a) => a.question_key === key)?.answer ?? "";
    },
    [answers, drafts],
  );

  const handleBlur = async (key: QuestionKey) => {
    const value = getAnswer(key);
    const existing = answers.find((a) => a.question_key === key)?.answer ?? "";
    if (value !== existing) {
      await onSave(key, value);
    }
  };

  return (
    <View className="mb-6">
      <Text className="mb-4 font-inter-semibold text-lg text-lumo-text">
        Reflexiones del día
      </Text>

      {GUIDED_QUESTIONS.map((q) => (
        <View key={q.key} className="mb-4">
          <Text className="mb-2 font-inter-medium text-sm text-lumo-subtext">
            {q.text}
          </Text>
          <TextInput
            className="rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base text-lumo-text"
            placeholder="Escribe aquí..."
            placeholderTextColor={colors.subtext}
            multiline
            value={getAnswer(q.key)}
            onChangeText={(text) =>
              setDrafts((prev) => ({ ...prev, [q.key]: text }))
            }
            onBlur={() => handleBlur(q.key)}
          />
        </View>
      ))}
    </View>
  );
}
