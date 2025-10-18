import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

function App() {
  return (
    <div className="bg-background min-h-screen w-full text-foreground">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        
        <ResizablePanel defaultSize={25} minSize={15}>
          Notes
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75}>
          <div className="p-4">
            <h1 className="font-bold text-lg">Editor</h1>
            {/* Markdown editor will go here next */}
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}

export default App;