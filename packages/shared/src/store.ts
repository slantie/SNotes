import { create } from 'zustand'
import { supabase } from './supabaseClient.js'
import type { Database } from './database.types.js'

type Note = Database['public']['Tables']['notes']['Row']

interface NotesStore {
  notes: Note[]
  openNoteIds: string[] // NEW: Tracks all open tabs
  activeNoteId: string | null // REPLACES activeNote

  // ACTIONS
  fetchNotes: () => Promise<void>
  addNote: () => Promise<void>
  updateNoteContent: (id: string, content: string, title: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  // NEW TAB ACTIONS
  openNote: (noteId: string) => void
  closeNote: (noteId: string) => void
  setActiveNoteId: (noteId: string | null) => void
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  openNoteIds: [],
  activeNoteId: null,

  setActiveNoteId: (noteId) => set({ activeNoteId: noteId }),

  openNote: (noteId) => {
    const { openNoteIds } = get();
    // If note is not already open, add it to the list
    if (!openNoteIds.includes(noteId)) {
      set({ openNoteIds: [...openNoteIds, noteId] });
    }
    // Set it as the active note
    set({ activeNoteId: noteId });
  },

  closeNote: (noteId) => {
    const { openNoteIds, activeNoteId } = get();
    const remainingIds = openNoteIds.filter(id => id !== noteId);

    // If the closed note was the active one, we need to pick a new active note
    if (activeNoteId === noteId) {
      const closedIndex = openNoteIds.findIndex(id => id === noteId);
      // Sensible default: activate the tab to the left, or the new first tab
      const newActiveIndex = Math.max(0, closedIndex - 1);
      const newActiveId = remainingIds[newActiveIndex] || null;
      set({ activeNoteId: newActiveId });
    }
    set({ openNoteIds: remainingIds });
  },

  fetchNotes: async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else if (data) {
      set({ notes: data });
    }
  },

  addNote: async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ title: 'New Note', content: '# ' })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
    } else if (data) {
      // Add new note to the master list and immediately open it
      set(state => ({ notes: [data, ...state.notes] }));
      get().openNote(data.id);
    }
  },

  updateNoteContent: async (id, content, title) => {
    // This logic remains the same, but we update the note in the master list
    set(state => ({
      notes: state.notes.map(n => n.id === id ? { ...n, content, title, updated_at: new Date().toISOString() } : n)
    }));
    await supabase
      .from('notes')
      .update({ content, title, updated_at: new Date().toISOString() })
      .eq('id', id);
  },

  deleteNote: async (id) => {
    // First, close the tab if it's open
    get().closeNote(id);
    // Then, remove it from the master list
    set(state => ({
      notes: state.notes.filter(n => n.id !== id),
    }));
    // Finally, delete from the database
    await supabase.from('notes').delete().eq('id', id);
  },
}));