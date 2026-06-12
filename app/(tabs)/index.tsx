import { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { getEventsByDate } from "@/lib/db";
import { useAppStore } from "@/lib/stores/app-store";

export default function CalendarScreen() {
  const dbReady = useAppStore((s) => s.dbReady);
  const selectedDate = useAppStore((s) => s.selectedDate);
  const events = useAppStore((s) => s.events);
  const setSelectedDate = useAppStore((s) => s.setSelectedDate);
  const setEvents = useAppStore((s) => s.setEvents);

  const loadEvents = useCallback(async () => {
    const rows = await getEventsByDate(selectedDate);
    setEvents(rows);
  }, [selectedDate, setEvents]);

  useEffect(() => {
    if (dbReady) {
      loadEvents();
    }
  }, [dbReady, loadEvents]);

  if (!dbReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-slate-500">Inicializando base de datos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#2563eb" },
        }}
        theme={{
          todayTextColor: "#2563eb",
          arrowColor: "#2563eb",
        }}
      />

      <View className="flex-1 border-t border-slate-200 px-4 pt-4">
        <Text className="mb-3 text-base font-semibold text-slate-800">
          Eventos del {selectedDate}
        </Text>

        {events.length === 0 ? (
          <Text className="text-slate-500">
            No hay eventos. Agrega uno desde Ajustes.
          </Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Text className="font-medium text-slate-800">{item.title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
