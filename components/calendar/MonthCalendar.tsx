import { useMemo } from "react";
import { Calendar, type DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";

import { getMoodMeta } from "@/lib/constants/moods";
import { colors } from "@/lib/constants/theme";
import type { DaySummary } from "@/lib/types";

type Props = {
  current: string;
  selectedDate: string;
  summaries: DaySummary[];
  onDayPress: (day: DateData) => void;
  onMonthChange: (month: { year: number; month: number }) => void;
};

function buildMarkedDates(
  summaries: DaySummary[],
  selectedDate: string,
): MarkedDates {
  const marked: MarkedDates = {};

  for (const summary of summaries) {
    const dots: { key: string; color: string }[] = [];

    if (summary.noteCount === 1) {
      const color = summary.mood
        ? getMoodMeta(summary.mood).color
        : colors.primary;
      dots.push({ key: "single", color });
    } else if (summary.noteCount > 1) {
      dots.push({ key: "n1", color: colors.primary });
      dots.push({ key: "n2", color: colors.secondary });
      if (summary.noteCount > 2) {
        dots.push({ key: "n3", color: colors.subtext });
      }
    }

    if (summary.mood && summary.noteCount === 0) {
      dots.push({
        key: "mood",
        color: getMoodMeta(summary.mood).color,
      });
    }

    if (dots.length > 0) {
      marked[summary.date] = {
        marked: true,
        dots,
      };
    }
  }

  marked[selectedDate] = {
    ...marked[selectedDate],
    selected: true,
    selectedColor: colors.primary,
    selectedTextColor: "#FFFFFF",
  };

  return marked;
}

export function MonthCalendar({
  current,
  selectedDate,
  summaries,
  onDayPress,
  onMonthChange,
}: Props) {
  const markedDates = useMemo(
    () => buildMarkedDates(summaries, selectedDate),
    [summaries, selectedDate],
  );

  return (
    <Calendar
      current={current}
      onDayPress={onDayPress}
      onMonthChange={(m) => onMonthChange({ year: m.year, month: m.month })}
      markedDates={markedDates}
      markingType="multi-dot"
      enableSwipeMonths
      theme={{
        backgroundColor: colors.background,
        calendarBackground: colors.background,
        textSectionTitleColor: colors.subtext,
        selectedDayBackgroundColor: colors.primary,
        selectedDayTextColor: "#FFFFFF",
        todayTextColor: colors.primary,
        dayTextColor: colors.text,
        textDisabledColor: `${colors.subtext}60`,
        monthTextColor: colors.text,
        arrowColor: colors.primary,
        textDayFontFamily: "Inter_500Medium",
        textMonthFontFamily: "Inter_600SemiBold",
        textDayHeaderFontFamily: "Inter_500Medium",
        textDayFontSize: 15,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 12,
      }}
      style={{
        borderRadius: 20,
        marginHorizontal: 16,
        paddingBottom: 8,
      }}
    />
  );
}
