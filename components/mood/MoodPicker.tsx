import { Pressable, Text, View } from "react-native";

import { MOODS } from "@/lib/constants/moods";
import type { Mood } from "@/lib/types";

type Props = {
  value: Mood;
  onChange: (mood: Mood) => void;
  label?: string;
};

export function MoodPicker({ value, onChange, label }: Props) {
  return (
    <View>
      {label && (
        <Text className="mb-3 font-inter-medium text-sm text-lumo-subtext">
          {label}
        </Text>
      )}
      <View className="flex-row gap-2">
        {MOODS.map((mood) => {
          const selected = value === mood.value;
          return (
            <Pressable
              key={mood.value}
              onPress={() => onChange(mood.value)}
              className="flex-1 items-center rounded-2xl border py-3"
              style={{
                borderColor: selected ? mood.color : "#E8E6E3",
                backgroundColor: selected ? `${mood.color}15` : "#FFFFFF",
              }}
            >
              <Text className="text-2xl">{mood.emoji}</Text>
              <Text
                className="mt-1 font-inter-medium text-xs"
                style={{ color: selected ? mood.color : "#7A7A7A" }}
              >
                {mood.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
