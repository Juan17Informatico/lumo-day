import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { initDatabase } from "@/lib/db";
import { useAppStore } from "@/lib/stores/app-store";
import { colors } from "@/lib/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const dbReady = useAppStore((s) => s.dbReady);
  const setDbReady = useAppStore((s) => s.setDbReady);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((error) => {
        console.error("Error al inicializar SQLite:", error);
      });
  }, [setDbReady]);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="day/[date]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Atrás",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="note/new"
        options={{
          headerShown: true,
          headerTitle: "Nueva entrada",
          headerBackTitle: "Atrás",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="note/[id]"
        options={{
          headerShown: true,
          headerTitle: "Editar entrada",
          headerBackTitle: "Atrás",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
