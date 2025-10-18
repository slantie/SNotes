// FILE: apps/desktop/src/components/CommandPalette.tsx

import { useEffect, useState } from "react";
import { useNotesStore } from "shared/store";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FileText } from "lucide-react";

export function CommandPalette() {
  const { notes, openNote } = useNotesStore();
  const [isOpen, setIsOpen] = useState(false);

  // Effect to listen for the keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectNote = (noteId: string) => {
    openNote(noteId);
    setIsOpen(false); // Close the palette after selection
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type to search for a note..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {notes.map((note) => (
            <CommandItem
              key={note.id}
              value={note.title || "Untitled Note"} // This is what the search filters on
              onSelect={() => handleSelectNote(note.id)}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{note.title || "Untitled Note"}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}