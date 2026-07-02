import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { MoodBadge } from "@/components/mood/MoodBadge";
import { TagChip } from "@/components/tags/TagChip";
import { colors } from "@/lib/constants/theme";
import type { Note } from "@/lib/types";

type Props = {
  note: Note;
  onPress?: () => void;
  isLast?: boolean;
};

export function TimelineEntry({ note, onPress, isLast }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row">
      <View className="mr-4 items-center" style={{ width: 48 }}>
        <Text className="font-inter-medium text-sm text-lumo-primary">
          {note.time}
        </Text>
        <View
          className="mt-2 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        {!isLast && (
          <View
            className="mt-1 w-px flex-1"
            style={{ backgroundColor: colors.border, minHeight: 24 }}
          />
        )}
      </View>

      <View
        className="mb-4 flex-1 rounded-2xl border border-lumo-border bg-lumo-surface p-4"
        style={{ marginTop: -2 }}
      >
        <View className="mb-2 flex-row items-start justify-between">
          <Text className="flex-1 font-inter-semibold text-base text-lumo-text">
            {note.title}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
        </View>

        {note.content ? (
          <Text
            className="mb-3 font-inter text-sm leading-5 text-lumo-subtext"
            numberOfLines={3}
          >
            {note.content}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap items-center gap-2">
          <MoodBadge mood={note.mood} size="sm" />
          {note.tags.map((tag) => (
            <TagChip key={tag} tag={tag} compact />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
