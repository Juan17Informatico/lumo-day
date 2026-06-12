import "../global.css";

import { Stack } from "expo-router";
import { useEffect } from "react";

import { initDatabase } from "@/lib/db";
import { useAppStore } from "@/lib/stores/app-store";

export default function RootLayout() {
  const setDbReady = useAppStore((s) => s.setDbReady);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((error) => {
        console.error("Error al inicializar SQLite:", error);
      });
  }, [setDbReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
