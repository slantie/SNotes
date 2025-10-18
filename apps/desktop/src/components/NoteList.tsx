// FILE: apps/desktop/src/components/NoteList.tsx

import { useNotesStore } from "shared/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, Sun, Moon } from "lucide-react"; // Import Sun and Moon
import { useTheme } from "@/components/ThemeProvider"; // Import the useTheme hook

export function NoteList() {
  // Get the new openNote action
  const { notes, activeNoteId, openNote, addNote } = useNotesStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full flex-col bg-background border-r border-border overflow-hidden">
      {/* Sticky Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <h1 className="font-bold text-lg tracking-tight text-foreground">
          SNotes
        </h1>
        <div className="flex items-center gap-1">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-accent transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* New Note Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={addNote}
            className="hover:bg-accent transition-colors"
            title="Create new note (Ctrl+N)"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">New Note</span>
          </Button>
        </div>
      </div>

      {/* Note List - Scrollable */}
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col gap-1 p-2">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-auto py-2.5 px-3 rounded-md transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeNoteId === note.id && "bg-accent text-accent-foreground font-medium shadow-sm" 
                )}
                onClick={() => openNote(note.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {note.title || "Untitled Note"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No notes yet. Create one to start!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}