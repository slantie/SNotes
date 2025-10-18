// FILE: apps/desktop/src/components/AppSidebar.tsx

import { useNotesStore } from "shared/store";
import { Plus, FileText, MoreHorizontal, Pencil, Copy, Trash2, FileDown, Sun, Moon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const { notes, activeNoteId, openNote, addNote, deleteNote } = useNotesStore();
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();

  const handleNoteAction = (action: string, noteId: string) => {
    switch (action) {
      case "rename":
        console.log("Rename note:", noteId);
        break;
      case "duplicate":
        console.log("Duplicate note:", noteId);
        break;
      case "export-md":
        console.log("Export as MD:", noteId);
        break;
      case "export-pdf":
        console.log("Export as PDF:", noteId);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this note?")) {
          deleteNote(noteId);
        }
        break;
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full">
              {state === "expanded" && (
                <span className="font-bold text-lg">SNotes</span>
              )}
              {state === "expanded" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={addNote}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>New Note (Ctrl+N)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Your Notes</span>
              <Badge variant="secondary" className="ml-auto">
                {notes.length}
              </Badge>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      onClick={() => openNote(note.id)}
                      isActive={activeNoteId === note.id}
                      tooltip={state === "collapsed" ? note.title || "Untitled" : undefined}
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      {state === "expanded" && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="truncate font-medium text-sm">
                            {note.title || "Untitled Note"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {new Date(note.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>

                    {state === "expanded" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleNoteAction("rename", note.id)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleNoteAction("duplicate", note.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleNoteAction("export-md", note.id)}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Export as Markdown
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleNoteAction("export-pdf", note.id)}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Export as PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleNoteAction("delete", note.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {state === "expanded" 
                      ? "No notes yet. Create one to start!"
                      : "No notes"}
                  </p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    tooltip={state === "collapsed" ? "Toggle Theme" : undefined}
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    {state === "expanded" && <span>Toggle Theme</span>}
                  </SidebarMenuButton>
                </TooltipTrigger>
                {state === "expanded" && (
                  <TooltipContent side="right">
                    <p>Ctrl+Shift+T</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
