import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { getMoodMeta } from "@/lib/constants/moods";
import { colors, moodColors } from "@/lib/constants/theme";
import type { HeatmapDay, Mood } from "@/lib/types";
import { parseDateString } from "@/lib/utils/dates";

type Props = {
  data: HeatmapDay[];
  year: number;
  onDayPress?: (date: string) => void;
};

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const CELL = 13;
const GAP = 3;

function getCellColor(mood: Mood | null, hasNotes: boolean): string {
  if (mood) return getMoodMeta(mood).color;
  if (hasNotes) return `${colors.primary}50`;
  return `${colors.border}`;
}

export function EmotionalHeatmap({ data, year, onDayPress }: Props) {
  const { weeks, monthLabels } = useMemo(() => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const dataMap = new Map(data.map((d) => [d.date, d]));

    const day = new Date(start);
    const dayOfWeek = day.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    day.setDate(day.getDate() - offset);

    const weeks: (HeatmapDay | null)[][] = [];
    let currentWeek: (HeatmapDay | null)[] = [];

    while (day <= end || currentWeek.length > 0) {
      if (day > end && currentWeek.length === 7) break;

      const dateStr = formatDate(day);
      const inYear = day.getFullYear() === year;

      if (inYear) {
        currentWeek.push(
          dataMap.get(dateStr) ?? {
            date: dateStr,
            mood: null,
            hasNotes: false,
          },
        );
      } else {
        currentWeek.push(null);
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      day.setDate(day.getDate() + 1);
      if (day.getFullYear() > year && currentWeek.length === 0) break;
    }

    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const first = week.find((d) => d !== null);
      if (first) {
        const m = parseDateString(first.date).getMonth();
        if (m !== lastMonth) {
          labels.push({
            label: ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][m],
            weekIndex: wi,
          });
          lastMonth = m;
        }
      }
    });

    return { weeks, monthLabels: labels };
  }, [data, year]);

  return (
    <View className="px-5">
      <Text className="mb-4 font-inter-semibold text-lg text-lumo-text">
        Calendario emocional {year}
      </Text>

      <View className="flex-row">
        <View className="mr-2 justify-around" style={{ paddingTop: 16 }}>
          {WEEKDAYS.map((d) => (
            <Text
              key={d}
              className="font-inter text-[9px] text-lumo-subtext"
              style={{ height: CELL, lineHeight: CELL }}
            >
              {d}
            </Text>
          ))}
        </View>

        <View className="flex-1">
          <View className="mb-1 flex-row" style={{ height: 14 }}>
            {monthLabels.map((m) => (
              <Text
                key={`${m.label}-${m.weekIndex}`}
                className="absolute font-inter text-[9px] text-lumo-subtext"
                style={{ left: m.weekIndex * (CELL + GAP) }}
              >
                {m.label}
              </Text>
            ))}
          </View>

          <View className="flex-row">
            {weeks.map((week, wi) => (
              <View key={wi} style={{ marginRight: GAP }}>
                {week.map((day, di) => {
                  if (!day) {
                    return (
                      <View
                        key={di}
                        style={{ width: CELL, height: CELL, marginBottom: GAP }}
                      />
                    );
                  }

                  return (
                    <Pressable
                      key={day.date}
                      onPress={() => onDayPress?.(day.date)}
                      style={{
                        width: CELL,
                        height: CELL,
                        marginBottom: GAP,
                        borderRadius: 3,
                        backgroundColor: getCellColor(day.mood, day.hasNotes),
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-end gap-3">
        <View className="flex-row items-center gap-1">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: moodColors.excellent,
            }}
          />
          <Text className="font-inter text-[10px] text-lumo-subtext">😊</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: moodColors.normal,
            }}
          />
          <Text className="font-inter text-[10px] text-lumo-subtext">😐</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: moodColors.bad,
            }}
          />
          <Text className="font-inter text-[10px] text-lumo-subtext">😔</Text>
        </View>
      </View>
    </View>
  );
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
