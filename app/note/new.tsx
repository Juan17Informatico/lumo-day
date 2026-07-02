import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { NoteForm } from "@/components/notes/NoteForm";
import type { NoteInput } from "@/lib/types";
import { useNotesStore } from "@/lib/stores/notes.store";
import { todayString } from "@/lib/utils/dates";

export default function NewNoteScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const router = useRouter();
  const createNote = useNotesStore((s) => s.createNote);
  const [saving, setSaving] = useState(false);

  const noteDate = date ?? todayString();

  const handleSubmit = async (input: NoteInput) => {
    setSaving(true);
    try {
      await createNote(input);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Nueva entrada" }} />
      <NoteForm date={noteDate} onSubmit={handleSubmit} saving={saving} />
    </>
  );
}
