import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { MoodBadge } from "@/components/mood/MoodBadge";
import { colors } from "@/lib/constants/theme";
import type { SearchResult } from "@/lib/types";
import { formatFullDate } from "@/lib/utils/dates";

type Props = {
  results: SearchResult[];
  onPress: (id: number) => void;
  onDayPress: (date: string) => void;
  emptyMessage?: string;
};

export function SearchResults({
  results,
  onPress,
  onDayPress,
  emptyMessage = "No se encontraron resultados",
}: Props) {
  if (results.length === 0) {
    return (
      <View className="items-center px-5 py-16">
        <Ionicons name="search-outline" size={48} color={colors.subtext} />
        <Text className="mt-4 text-center font-inter text-base text-lumo-subtext">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="px-5">
      {results.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onPress(item.id)}
          className="mb-3 rounded-2xl border border-lumo-border bg-lumo-surface p-4"
        >
          <View className="mb-1 flex-row items-center justify-between">
            <Pressable onPress={() => onDayPress(item.date)}>
              <Text className="font-inter-medium text-xs text-lumo-primary">
                {formatFullDate(item.date)} · {item.time}
              </Text>
            </Pressable>
            <MoodBadge mood={item.mood} size="sm" />
          </View>
          <Text className="font-inter-semibold text-base text-lumo-text">
            {item.title}
          </Text>
          {item.content ? (
            <Text
              className="mt-1 font-inter text-sm text-lumo-subtext"
              numberOfLines={2}
            >
              {item.content}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
