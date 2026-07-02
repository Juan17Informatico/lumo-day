import { Text, View } from "react-native";

import { getMoodMeta } from "@/lib/constants/moods";
import type { Mood } from "@/lib/types";

type Props = {
  mood: Mood;
  size?: "sm" | "md";
};

export function MoodBadge({ mood, size = "md" }: Props) {
  const meta = getMoodMeta(mood);
  const isSmall = size === "sm";

  return (
    <View
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: `${meta.color}18`,
        paddingHorizontal: isSmall ? 10 : 14,
        paddingVertical: isSmall ? 4 : 6,
      }}
    >
      <Text className={isSmall ? "text-sm" : "text-base"}>{meta.emoji}</Text>
      <Text
        className={`ml-1.5 font-inter-medium text-lumo-text ${isSmall ? "text-xs" : "text-sm"}`}
      >
        {meta.label}
      </Text>
    </View>
  );
}
