// FILE: apps/desktop/src/components/NoteEditor.tsx

import { useEffect, useState } from "react";
import { useNotesStore } from "shared/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NoteEditor() {
  const { activeNote, updateNoteContent } = useNotesStore();

  // Use local state for a snappy editing experience
  const [localTitle, setLocalTitle] = useState(activeNote?.title || "");
  const [localContent, setLocalContent] = useState(activeNote?.content || "");

  // Effect 1: When the activeNote changes, update the local state
  useEffect(() => {
    setLocalTitle(activeNote?.title || "");
    setLocalContent(activeNote?.content || "");
  }, [activeNote]);

  // Effect 2: When local state changes, debounce the update to the database
  useEffect(() => {
    if (!activeNote) return;

    const handler = setTimeout(() => {
      // Only update if the content has actually changed
      if (localTitle !== activeNote.title || localContent !== activeNote.content) {
        updateNoteContent(activeNote.id, localContent, localTitle);
      }
    }, 500); // Wait for 500ms of inactivity before saving

    return () => {
      clearTimeout(handler); // Cleanup the timeout if the user keeps typing
    };
  }, [localTitle, localContent, activeNote, updateNoteContent]);


  if (!activeNote) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a note to start editing, or create a new one.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 gap-4">
      <Input
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        placeholder="Note Title"
        className="text-lg font-bold"
      />
      <Textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        placeholder="Start writing your note here..."
        className="flex-1 resize-none"
      />
    </div>
  );
}