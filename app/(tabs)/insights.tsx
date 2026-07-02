import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmotionalHeatmap } from "@/components/stats/EmotionalHeatmap";
import { StatsCards } from "@/components/stats/StatsCards";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAppStore } from "@/lib/stores/app-store";
import { useNotesStore } from "@/lib/stores/notes.store";
import { getYearRange } from "@/lib/utils/dates";

export default function InsightsScreen() {
  const router = useRouter();
  const dbReady = useAppStore((s) => s.dbReady);
  const stats = useNotesStore((s) => s.stats);
  const heatmapData = useNotesStore((s) => s.heatmapData);
  const loadStats = useNotesStore((s) => s.loadStats);
  const loadHeatmap = useNotesStore((s) => s.loadHeatmap);

  const [year] = useState(() => new Date().getFullYear());

  const refresh = useCallback(async () => {
    const { start, end } = getYearRange(year);
    await Promise.all([loadStats(), loadHeatmap(start, end)]);
  }, [year, loadStats, loadHeatmap]);

  useEffect(() => {
    if (dbReady) {
      refresh();
    }
  }, [dbReady, refresh]);

  if (!dbReady || !stats) {
    return <LoadingScreen message="Calculando insights..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-lumo-bg" edges={["bottom"]}>
      <ScrollView contentContainerClassName="pb-10">
        <View className="px-5 pb-4 pt-2">
          <Text className="font-inter text-sm text-lumo-subtext">
            Tu progreso emocional
          </Text>
          <Text className="font-inter-semibold text-2xl text-lumo-text">
            Insights
          </Text>
        </View>

        <StatsCards stats={stats} />

        <View className="mt-8">
          <EmotionalHeatmap
            data={heatmapData}
            year={year}
            onDayPress={(date) =>
              router.push({ pathname: "/day/[date]", params: { date } })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
