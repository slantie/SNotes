import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useNotesStore } from "shared/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  FileDown,
  PanelLeftClose,
  PanelRightClose,
  Columns2,
  Edit,
} from "lucide-react";
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

type ViewMode = "split" | "edit" | "preview";

export function NoteEditor() {
  const { notes, activeNoteId, updateNoteContent, deleteNote } = useNotesStore();
  const { theme: selectedTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId),
    [notes, activeNoteId]
  );

  const [localTitle, setLocalTitle] = useState(activeNote?.title || "");
  const [localContent, setLocalContent] = useState(activeNote?.content || "");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const resolveTheme = () =>
      selectedTheme === "system"
        ? mediaQuery.matches
          ? "dark"
          : "light"
        : (selectedTheme as "dark" | "light");

    const handleChange = () => setResolvedTheme(resolveTheme());
    handleChange();

    if (selectedTheme === "system") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [selectedTheme]);

  const syntaxTheme = resolvedTheme === "dark" ? oneDark : oneLight;
  const codeBackground = resolvedTheme === "dark" ? "#282c34" : "#f5f5f5";
  const codeTextColor = resolvedTheme === "dark" ? "#dcdfe4" : "#2d2d2d";

  useEffect(() => {
    setLocalTitle(activeNote?.title || "");
    setLocalContent(activeNote?.content || "");
  }, [activeNote]);

  useEffect(() => {
    const words = localContent.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length === 1 && words[0] === "" ? 0 : words.length);
    setCharCount(localContent.length);

    if (!activeNote) return;

    const handler = setTimeout(() => {
      if (localTitle !== activeNote.title || localContent !== activeNote.content) {
        updateNoteContent(activeNote.id, localContent, localTitle);
        toast.success("Note saved", { duration: 1000 });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localTitle, localContent, activeNote, updateNoteContent]);

  const handleDelete = () => {
    if (!activeNote) return;
    if (window.confirm("Are you sure you want to permanently delete this note?")) {
      deleteNote(activeNote.id);
      toast.success("Note deleted");
    }
  };

  const handleExportMD = async () => {
    if (!activeNote) return;
    try {
      await window.ipcRenderer.invoke("save-file", {
        content: localContent,
        format: "md",
      });
      toast.success("Exported as Markdown");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleExportPDF = async () => {
    if (!activeNote || !previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const pdfOutput = pdf.output("arraybuffer");
      await window.ipcRenderer.invoke("save-file", {
        content: pdfOutput,
        format: "pdf",
      });
      toast.success("Exported as PDF");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 overflow-hidden">
        <Card className="w-96">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-base">No note selected</p>
              <p className="text-sm text-muted-foreground">
                Select a note from the sidebar or create a new one to start editing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Breadcrumb className="min-w-0">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Notes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">{activeNote?.title || "Untitled"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
          >
            <ToggleGroupItem value="edit" aria-label="Edit only" size="sm">
              <PanelLeftClose className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="split" aria-label="Split view" size="sm">
              <Columns2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="preview" aria-label="Preview only" size="sm">
              <PanelRightClose className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportMD}>Export as Markdown</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </header>

      {/* Title Input */}
      <div className="px-6 py-4 border-b border-border flex-shrink-0">
        <Input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
        />
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "edit" && (
          <Textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Start writing..."
            className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 p-6 font-mono text-sm"
          />
        )}

        {viewMode === "preview" && (
          <div ref={previewRef} className="h-full overflow-y-auto p-6">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={syntaxTheme as any}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.75rem",
                            padding: "1rem",
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                            background: codeBackground,
                            color: codeTextColor,
                          }}
                          codeTagProps={{
                            style: {
                              background: "transparent",
                              color: codeTextColor,
                            },
                          }}
                        >
                          {String(children ?? "").replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code
                        style={{
                          background: "transparent",
                          color: codeTextColor,
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {localContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {viewMode === "split" && (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <Textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Start writing..."
                className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 p-6 font-mono text-sm"
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div ref={previewRef} className="h-full overflow-y-auto p-6 bg-muted/20">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        if (!inline && match) {
                          return (
                            <SyntaxHighlighter
                              style={syntaxTheme as any}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.75rem",
                                padding: "1rem",
                                border: "none",
                                boxShadow: "none",
                                outline: "none",
                                background: codeBackground,
                                color: codeTextColor,
                              }}
                              codeTagProps={{
                                style: {
                                  background: "transparent",
                                  color: codeTextColor,
                                },
                              }}
                            >
                              {String(children ?? "").replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          );
                        }
                        return (
                          <code
                            style={{
                              background: "transparent",
                              color: codeTextColor,
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {localContent}
                  </ReactMarkdown>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Status Bar */}
      <footer className="flex items-center justify-between px-6 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Markdown</span>
          <Separator orientation="vertical" className="h-4" />
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{charCount} characters</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Last saved: {new Date(activeNote?.updated_at || Date.now()).toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}
