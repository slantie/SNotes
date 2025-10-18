// FILE: apps/desktop/src/App.tsx

import { useEffect } from "react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useNotesStore } from "shared/store";
import { NoteList } from "@/components/NoteList";
import { NoteEditor } from "@/components/NoteEditor";

function App() {
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  // Fetch notes when the app loads for the first time
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="bg-background min-h-screen w-full text-foreground">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        
        <ResizablePanel defaultSize={25} minSize={15}>
          <NoteList />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75}>
          <NoteEditor />
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}

export default App;