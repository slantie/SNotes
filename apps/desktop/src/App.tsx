// FILE: apps/desktop/src/App.tsx

import { useEffect } from "react";
import { useNotesStore } from "shared/store";
import { AppSidebar } from "@/components/AppSidebar";
import { NoteEditor } from "@/components/NoteEditor";
import { EditorTabs } from "@/components/EditorTabs";
import { CommandPalette } from "@/components/CommandPalette";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar with Sidebar Trigger */}
        <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2 flex-shrink-0">
          <SidebarTrigger />
        </div>
        
        {/* Editor Tabs */}
        <EditorTabs />
        
        {/* Note Editor - Takes remaining vertical space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <NoteEditor />
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </SidebarProvider>
  );
}

export default App;