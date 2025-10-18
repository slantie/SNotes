// FILE: apps/desktop/src/components/NoteList.tsx

import { useNotesStore } from "shared/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function NoteList() {
  const { notes, activeNote, setActiveNote, addNote } = useNotesStore();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <h1 className="font-bold text-lg">Notes</h1>
        <Button variant="ghost" size="icon" onClick={addNote}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">New Note</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-1">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-auto py-2",
                  activeNote?.id === note.id && "bg-accent"
                )}
                onClick={() => setActiveNote(note)}
              >
                {note.title || "Untitled Note"}
              </Button>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No notes yet.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}