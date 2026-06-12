import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { getEventsByDate, insertEvent } from "@/lib/db";
import { useAppStore } from "@/lib/stores/app-store";

type EventForm = {
  title: string;
};

export default function SettingsScreen() {
  const dbReady = useAppStore((s) => s.dbReady);
  const selectedDate = useAppStore((s) => s.selectedDate);
  const setEvents = useAppStore((s) => s.setEvents);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventForm>({
    defaultValues: { title: "" },
  });

  const onSubmit = handleSubmit(async ({ title }) => {
    setSaving(true);
    try {
      await insertEvent(title.trim(), selectedDate);
      reset();
      const rows = await getEventsByDate(selectedDate);
      setEvents(rows);
    } finally {
      setSaving(false);
    }
  });

  if (!dbReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="mb-1 text-sm text-slate-500">Estado</Text>
      <Text className="mb-6 text-base text-slate-800">
        SQLite listo · fecha seleccionada: {selectedDate}
      </Text>

      <Text className="mb-2 text-base font-semibold text-slate-800">
        Nuevo evento
      </Text>

      <Controller
        control={control}
        name="title"
        rules={{ required: "El título es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="mb-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            placeholder="Título del evento"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title && (
        <Text className="mb-3 text-sm text-red-500">{errors.title.message}</Text>
      )}

      <Pressable
        className="mt-2 items-center rounded-lg bg-blue-600 px-4 py-3 active:bg-blue-700"
        onPress={onSubmit}
        disabled={saving}
      >
        <Text className="font-semibold text-white">
          {saving ? "Guardando..." : "Guardar en SQLite"}
        </Text>
      </Pressable>
    </View>
  );
}
