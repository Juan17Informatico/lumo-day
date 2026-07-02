import { Text, View } from "react-native";

import { colors } from "@/lib/constants/theme";
import type { WritingStats } from "@/lib/types";

type Props = {
  stats: WritingStats;
};

const CARDS = [
  {
    key: "days" as const,
    label: "Días escritos",
    icon: "📝",
    color: colors.primary,
  },
  {
    key: "current" as const,
    label: "Racha actual",
    icon: "🔥",
    color: colors.warning,
  },
  {
    key: "max" as const,
    label: "Racha máxima",
    icon: "⭐",
    color: colors.success,
  },
];

export function StatsCards({ stats }: Props) {
  const values = {
    days: stats.daysWritten,
    current: stats.currentStreak,
    max: stats.maxStreak,
  };

  return (
    <View className="flex-row gap-3 px-5">
      {CARDS.map((card) => (
        <View
          key={card.key}
          className="flex-1 rounded-2xl border border-lumo-border bg-lumo-surface p-4"
        >
          <Text className="mb-2 text-xl">{card.icon}</Text>
          <Text
            className="font-inter-bold text-2xl"
            style={{ color: card.color }}
          >
            {values[card.key]}
          </Text>
          <Text className="mt-1 font-inter text-xs text-lumo-subtext">
            {card.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
