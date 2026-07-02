import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { GuidedQuestions } from "@/components/day/GuidedQuestions";
import { MoodBadge } from "@/components/mood/MoodBadge";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { TimelineEntry } from "@/components/notes/TimelineEntry";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { colors } from "@/lib/constants/theme";
import type { Mood } from "@/lib/types";
import { useAppStore } from "@/lib/stores/app-store";
import { useNotesStore } from "@/lib/stores/notes.store";
import { formatFullDate } from "@/lib/utils/dates";

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const dbReady = useAppStore((s) => s.dbReady);
  const notes = useNotesStore((s) => s.notes);
  const dayMood = useNotesStore((s) => s.dayMood);
  const guidedAnswers = useNotesStore((s) => s.guidedAnswers);
  const loading = useNotesStore((s) => s.loading);
  const loadDay = useNotesStore((s) => s.loadDay);
  const setDayMood = useNotesStore((s) => s.setDayMood);
  const saveGuidedAnswer = useNotesStore((s) => s.saveGuidedAnswer);

  const refresh = useCallback(async () => {
    if (date) {
      await loadDay(date);
    }
  }, [date, loadDay]);

  useEffect(() => {
    if (dbReady && date) {
      refresh();
    }
  }, [dbReady, date, refresh]);

  const handleMoodChange = async (mood: Mood) => {
    if (date) {
      await setDayMood(date, mood);
    }
  };

  if (!dbReady || !date || loading) {
    return <LoadingScreen message="Cargando tu día..." />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: formatFullDate(date),
          headerTitleStyle: {
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
            color: colors.text,
          },
        }}
      />

      <ScrollView
        className="flex-1 bg-lumo-bg"
        contentContainerClassName="px-5 pb-24 pt-4"
      >
        <View className="mb-6">
          <Text className="mb-3 font-inter-medium text-sm text-lumo-subtext">
            Estado emocional del día
          </Text>
          {dayMood ? (
            <View className="mb-3">
              <MoodBadge mood={dayMood.mood} />
            </View>
          ) : null}
          <MoodPicker
            value={dayMood?.mood ?? "normal"}
            onChange={handleMoodChange}
          />
        </View>

        <View className="mb-6">
          <Text className="mb-4 font-inter-semibold text-lg text-lumo-text">
            Timeline
          </Text>

          {notes.length === 0 ? (
            <View className="items-center rounded-2xl border border-dashed border-lumo-border py-10">
              <Ionicons
                name="document-text-outline"
                size={40}
                color={colors.subtext}
              />
              <Text className="mt-3 font-inter text-sm text-lumo-subtext">
                Aún no hay entradas este día
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/note/new",
                    params: { date },
                  })
                }
                className="mt-4 rounded-xl px-4 py-2"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Text className="font-inter-medium text-sm text-lumo-primary">
                  Crear primera entrada
                </Text>
              </Pressable>
            </View>
          ) : (
            notes.map((note, index) => (
              <TimelineEntry
                key={note.id}
                note={note}
                isLast={index === notes.length - 1}
                onPress={() =>
                  router.push({
                    pathname: "/note/[id]",
                    params: { id: String(note.id) },
                  })
                }
              />
            ))
          )}
        </View>

        <GuidedQuestions
          answers={guidedAnswers}
          onSave={(key, answer) => saveGuidedAnswer(date, key, answer)}
        />
      </ScrollView>

      <Pressable
        onPress={() =>
          router.push({ pathname: "/note/new", params: { date } })
        }
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </>
  );
}
