import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchResults } from "@/components/search/SearchResults";
import { colors } from "@/lib/constants/theme";
import { useNotesStore } from "@/lib/stores/notes.store";

type SearchMode = "text" | "date";

export default function SearchScreen() {
  const router = useRouter();
  const searchResults = useNotesStore((s) => s.searchResults);
  const search = useNotesStore((s) => s.search);
  const searchByDate = useNotesStore((s) => s.searchByDate);
  const clearSearch = useNotesStore((s) => s.clearSearch);

  const [mode, setMode] = useState<SearchMode>("text");
  const [query, setQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  const handleTextSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      await search(text);
    },
    [search],
  );

  const handleDateSearch = useCallback(async () => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateQuery)) {
      await searchByDate(dateQuery);
    }
  }, [dateQuery, searchByDate]);

  const switchMode = (newMode: SearchMode) => {
    setMode(newMode);
    clearSearch();
    setQuery("");
    setDateQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-lumo-bg" edges={["bottom"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-8"
      >
        <View className="px-5 pb-4 pt-2">
          <Text className="font-inter text-sm text-lumo-subtext">
            Encuentra tus momentos
          </Text>
          <Text className="font-inter-semibold text-2xl text-lumo-text">
            Buscar
          </Text>
        </View>

        <View className="mx-5 mb-4 flex-row rounded-2xl border border-lumo-border bg-lumo-surface p-1">
          {(["text", "date"] as SearchMode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => switchMode(m)}
              className="flex-1 rounded-xl py-2.5"
              style={{
                backgroundColor:
                  mode === m ? `${colors.primary}15` : "transparent",
              }}
            >
              <Text
                className="text-center font-inter-medium text-sm"
                style={{ color: mode === m ? colors.primary : colors.subtext }}
              >
                {m === "text" ? "Por texto" : "Por fecha"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mx-5 mb-4">
          {mode === "text" ? (
            <TextInput
              className="rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base text-lumo-text"
              placeholder="Buscar en títulos y contenido..."
              placeholderTextColor={colors.subtext}
              value={query}
              onChangeText={handleTextSearch}
              autoCapitalize="none"
            />
          ) : (
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base text-lumo-text"
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.subtext}
                value={dateQuery}
                onChangeText={setDateQuery}
                autoCapitalize="none"
              />
              <Pressable
                onPress={handleDateSearch}
                className="items-center justify-center rounded-2xl px-5"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="font-inter-semibold text-white">Ir</Text>
              </Pressable>
            </View>
          )}
        </View>

        <SearchResults
          results={searchResults}
          onPress={(id) =>
            router.push({ pathname: "/note/[id]", params: { id: String(id) } })
          }
          onDayPress={(date) =>
            router.push({ pathname: "/day/[date]", params: { date } })
          }
          emptyMessage={
            mode === "text" && !query.trim()
              ? "Escribe algo para buscar en tu diario"
              : mode === "date" && !dateQuery
                ? "Introduce una fecha en formato YYYY-MM-DD"
                : "No se encontraron resultados"
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
