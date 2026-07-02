import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { NoteForm } from "@/components/notes/NoteForm";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { getNoteById } from "@/lib/db/notes.repository";
import type { Note, NoteInput } from "@/lib/types";
import { useNotesStore } from "@/lib/stores/notes.store";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [note, setNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const noteId = Number(id);

  const load = useCallback(async () => {
    if (!noteId || Number.isNaN(noteId)) return;
    const row = await getNoteById(noteId);
    setNote(row);
    setLoading(false);
  }, [noteId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (input: NoteInput) => {
    setSaving(true);
    try {
      await updateNote(noteId, input);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar entrada",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            try {
              await deleteNote(noteId);
              router.back();
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  if (loading || !note) {
    return <LoadingScreen message="Cargando entrada..." />;
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Editar entrada" }} />
      <NoteForm
        date={note.date}
        note={note}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        saving={saving}
      />
    </>
  );
}
