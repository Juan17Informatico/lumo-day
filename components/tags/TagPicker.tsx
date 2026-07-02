import { Pressable, Text, View } from "react-native";

import { TAGS } from "@/lib/constants/tags";
import { colors } from "@/lib/constants/theme";
import type { Tag } from "@/lib/types";

type Props = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  label?: string;
};

export function TagPicker({ value, onChange, label }: Props) {
  const toggle = (tag: Tag) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <View>
      {label && (
        <Text className="mb-3 font-inter-medium text-sm text-lumo-subtext">
          {label}
        </Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {TAGS.map((tag) => {
          const selected = value.includes(tag.value);
          return (
            <Pressable
              key={tag.value}
              onPress={() => toggle(tag.value)}
              className="rounded-full border px-4 py-2"
              style={{
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? `${colors.primary}15` : colors.surface,
              }}
            >
              <Text
                className="font-inter-medium text-sm"
                style={{ color: selected ? colors.primary : colors.subtext }}
              >
                {tag.hash}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
