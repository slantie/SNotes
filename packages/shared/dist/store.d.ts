import type { Database } from './database.types.js';
type Note = Database['public']['Tables']['notes']['Row'];
interface NotesStore {
    notes: Note[];
    activeNote: Note | null;
    setActiveNote: (note: Note | null) => void;
    fetchNotes: () => Promise<void>;
    addNote: () => Promise<void>;
    updateNoteContent: (id: string, content: string, title: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
}
export declare const useNotesStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NotesStore>>;
export {};
//# sourceMappingURL=store.d.ts.map