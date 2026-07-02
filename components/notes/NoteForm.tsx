import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { MoodPicker } from "@/components/mood/MoodPicker";
import { TagPicker } from "@/components/tags/TagPicker";
import { colors } from "@/lib/constants/theme";
import type { Mood, Note, NoteInput, Tag } from "@/lib/types";
import { getCurrentTime } from "@/lib/utils/dates";

type FormValues = {
  title: string;
  content: string;
  time: string;
  mood: Mood;
  tags: Tag[];
};

type Props = {
  date: string;
  note?: Note;
  onSubmit: (input: NoteInput) => Promise<void>;
  onDelete?: () => void;
  saving?: boolean;
};

export function NoteForm({ date, note, onSubmit, onDelete, saving }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
      time: note?.time ?? getCurrentTime(),
      mood: note?.mood ?? "normal",
      tags: note?.tags ?? [],
    },
  });

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
        time: note.time,
        mood: note.mood,
        tags: note.tags,
      });
    }
  }, [note, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      date,
      title: values.title.trim(),
      content: values.content.trim(),
    });
  });

  return (
    <ScrollView
      className="flex-1 bg-lumo-bg"
      contentContainerClassName="px-5 pb-10 pt-2"
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        control={control}
        name="title"
        rules={{ required: "El título es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 font-inter-medium text-sm text-lumo-subtext">
              Título
            </Text>
            <TextInput
              className="rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base text-lumo-text"
              placeholder="¿Qué pasó?"
              placeholderTextColor={colors.subtext}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.title && (
              <Text className="mt-1 font-inter text-sm text-lumo-danger">
                {errors.title.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="time"
        rules={{ required: "La hora es obligatoria" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 font-inter-medium text-sm text-lumo-subtext">
              Hora
            </Text>
            <TextInput
              className="rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base text-lumo-text"
              placeholder="08:00"
              placeholderTextColor={colors.subtext}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 font-inter-medium text-sm text-lumo-subtext">
              Contenido
            </Text>
            <TextInput
              className="min-h-[120px] rounded-2xl border border-lumo-border bg-lumo-surface px-4 py-3 font-inter text-base leading-6 text-lumo-text"
              placeholder="Escribe tus pensamientos..."
              placeholderTextColor={colors.subtext}
              multiline
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="mood"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <MoodPicker value={value} onChange={onChange} label="Estado emocional" />
          </View>
        )}
      />

      <Controller
        control={control}
        name="tags"
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <TagPicker value={value} onChange={onChange} label="Etiquetas" />
          </View>
        )}
      />

      <Pressable
        onPress={submit}
        disabled={saving}
        className="items-center rounded-2xl py-4"
        style={{ backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }}
      >
        <Text className="font-inter-semibold text-base text-white">
          {saving ? "Guardando..." : note ? "Actualizar entrada" : "Guardar entrada"}
        </Text>
      </Pressable>

      {note && onDelete && (
        <Pressable
          onPress={onDelete}
          disabled={saving}
          className="mt-3 items-center rounded-2xl border border-lumo-danger py-4"
        >
          <Text className="font-inter-semibold text-base text-lumo-danger">
            Eliminar entrada
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
