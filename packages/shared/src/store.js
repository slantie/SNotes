import { create } from 'zustand';
import { supabase } from './supabaseClient.js'; // Added .js extension
export const useNotesStore = create((set, get) => ({
    notes: [],
    activeNote: null,
    setActiveNote: (note) => set({ activeNote: note }),
    fetchNotes: async () => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching notes:', error);
        }
        else if (data) {
            set({ notes: data });
            // If there's no active note, set the first one as active.
            if (!get().activeNote && data.length > 0) {
                set({ activeNote: data[0] ?? null });
            }
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
        }
        else if (data) {
            // Add the new note to the top of the list and set it as active
            set(state => ({ notes: [data, ...state.notes], activeNote: data }));
        }
    },
    updateNoteContent: async (id, content, title) => {
        const { error } = await supabase
            .from('notes')
            .update({ content, title, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) {
            console.error('Error updating note:', error);
        }
        else {
            // Update the note in the local state for a snappy UI
            set(state => ({
                notes: state.notes.map(n => n.id === id ? { ...n, content, title } : n)
            }));
        }
    },
    deleteNote: async (id) => {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting note:', error);
        }
        else {
            set(state => ({
                notes: state.notes.filter(n => n.id !== id),
                // If the deleted note was active, clear it
                activeNote: state.activeNote?.id === id ? null : state.activeNote
            }));
        }
    },
}));
//# sourceMappingURL=store.js.map