import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DateData } from "react-native-calendars";

import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { colors } from "@/lib/constants/theme";
import { useAppStore } from "@/lib/stores/app-store";
import { useNotesStore } from "@/lib/stores/notes.store";
import { getMonthRange } from "@/lib/utils/dates";

export default function CalendarScreen() {
  const router = useRouter();
  const dbReady = useAppStore((s) => s.dbReady);
  const selectedDate = useAppStore((s) => s.selectedDate);
  const setSelectedDate = useAppStore((s) => s.setSelectedDate);
  const monthSummaries = useNotesStore((s) => s.monthSummaries);
  const loadMonth = useNotesStore((s) => s.loadMonth);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return { year: y, month: m };
  });

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    router.push({ pathname: "/day/[date]", params: { date: day.dateString } });
  };

  const handleMonthChange = (month: { year: number; month: number }) => {
    setVisibleMonth(month);
  };

  useEffect(() => {
    if (dbReady) {
      const { start, end } = getMonthRange(
        visibleMonth.year,
        visibleMonth.month,
      );
      loadMonth(start, end);
    }
  }, [visibleMonth, dbReady, loadMonth]);

  if (!dbReady) {
    return <LoadingScreen message="Preparando tu diario..." />;
  }

  const todayNotes = monthSummaries.find((s) => s.date === selectedDate);

  return (
    <SafeAreaView className="flex-1 bg-lumo-bg" edges={["bottom"]}>
      <View className="px-5 pb-2 pt-2">
        <Text className="font-inter text-sm text-lumo-subtext">
          Tu espacio de reflexión
        </Text>
        <Text className="font-inter-semibold text-2xl text-lumo-text">
          Calendario
        </Text>
      </View>

      <MonthCalendar
        current={selectedDate}
        selectedDate={selectedDate}
        summaries={monthSummaries}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />

      <View className="mx-5 mt-4 flex-row items-center justify-between rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3">
        <View>
          <Text className="font-inter-medium text-sm text-lumo-text">
            {selectedDate}
          </Text>
          <Text className="font-inter text-xs text-lumo-subtext">
            {todayNotes
              ? `${todayNotes.noteCount} entrada${todayNotes.noteCount !== 1 ? "s" : ""}`
              : "Sin entradas"}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({ pathname: "/day/[date]", params: { date: selectedDate } })
          }
          className="flex-row items-center rounded-xl px-3 py-2"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <Text className="mr-1 font-inter-medium text-sm text-lumo-primary">
            Ver día
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <Pressable
        onPress={() =>
          router.push({ pathname: "/note/new", params: { date: selectedDate } })
        }
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}
