import { Text, View } from "react-native";

import { getTagMeta } from "@/lib/constants/tags";
import { colors } from "@/lib/constants/theme";
import type { Tag } from "@/lib/types";

type Props = {
  tag: Tag;
  compact?: boolean;
};

export function TagChip({ tag, compact }: Props) {
  const meta = getTagMeta(tag);

  return (
    <View
      className="rounded-full"
      style={{
        backgroundColor: `${colors.primary}12`,
        paddingHorizontal: compact ? 8 : 10,
        paddingVertical: compact ? 2 : 4,
      }}
    >
      <Text
        className={`font-inter-medium text-lumo-primary ${compact ? "text-xs" : "text-sm"}`}
      >
        {meta.hash}
      </Text>
    </View>
  );
}
