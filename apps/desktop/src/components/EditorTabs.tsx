// FILE: apps/desktop/src/components/EditorTabs.tsx
import { useNotesStore } from "shared/store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function EditorTabs() {
  const { notes, openNoteIds, activeNoteId, setActiveNoteId, closeNote } = useNotesStore();

  const openNotes = openNoteIds
    .map(id => notes.find(note => note.id === id))
    .filter((note): note is NonNullable<typeof note> => note !== undefined);

  if (openNotes.length === 0) {
    return (
      <div className="h-12 border-b border-border bg-muted/20 flex items-center px-4">
        <p className="text-xs text-muted-foreground">Open a note to start editing</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tabs
        value={activeNoteId || ""}
        onValueChange={(value) => setActiveNoteId(value)}
        className="w-full flex-shrink-0"
      >
        <TabsList className="w-full justify-start gap-0 rounded-none border-b border-border bg-muted/20 p-0 h-auto overflow-x-auto">
          {openNotes.map((note) => {
            // Calculate word count for badge
            const wordCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
            
            return (
              <Tooltip key={note.id}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={note.id}
                    className={cn(
                      "relative h-12 px-4 rounded-none border-r border-border flex-shrink-0",
                      "text-sm font-medium text-muted-foreground",
                      "data-[state=active]:text-foreground data-[state=active]:bg-background",
                      "hover:bg-muted/50 transition-colors duration-150",
                      "group"
                    )}
                  >
                    <div className="flex items-center gap-2 pr-6">
                      <span className="truncate max-w-[120px]">
                        {note.title || "Untitled Note"}
                      </span>
                      {wordCount > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs flex-shrink-0">
                          {wordCount}
                        </Badge>
                      )}
                    </div>
                    <button
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                        "hover:bg-muted data-[state=active]:opacity-100"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeNote(note.id);
                      }}
                      title="Close tab (Ctrl+W)"
                      aria-label="Close tab"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium">{note.title || "Untitled Note"}</p>
                  <p className="text-xs text-muted-foreground">
                    Last saved: {new Date(note.updated_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wordCount} words
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TabsList>
      </Tabs>
    </TooltipProvider>
  );
}