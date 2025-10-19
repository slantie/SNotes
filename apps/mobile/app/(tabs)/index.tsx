import { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Text as RNText, TextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotesStore } from 'shared/store';
import { useColorScheme } from 'nativewind';
import { Trash2 } from 'lucide-react-native';

export default function NotesListScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { notes, fetchNotes, addNote, openNote, deleteNote } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<any>(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = async () => {
    await addNote();
    router.push('/note-editor');
  };

  const handleNotePress = (noteId: string) => {
    openNote(noteId);
    router.push('/note-editor');
  };

  const handleDeleteNote = (note: any) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  };

  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
        <RNText style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
          SNotes
        </RNText>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              isDark ? styles.searchInputDark : styles.searchInputLight,
              isDark ? styles.textDark : styles.textLight,
            ]}
          />
          <Pressable
            onPress={handleCreateNote}
            style={[styles.addButton, isDark ? styles.addButtonDark : styles.addButtonLight]}
          >
            <RNText style={styles.addButtonText}>+</RNText>
          </Pressable>
        </View>
      </View>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <RNText style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </RNText>
          <RNText style={[styles.emptySubtitle, isDark ? styles.textMuted : styles.textMutedLight]}>
            {searchQuery
              ? 'Try a different search term'
              : 'Tap the + button to create your first note'}
          </RNText>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleNotePress(item.id)}
              style={({ pressed }) => [
                styles.noteCard,
                isDark ? styles.noteCardDark : styles.noteCardLight,
                pressed && styles.noteCardPressed,
              ]}
            >
              <View style={styles.noteHeader}>
                <RNText
                  style={[styles.noteTitle, isDark ? styles.textDark : styles.textLight]}
                  numberOfLines={1}
                >
                  {item.title || 'Untitled Note'}
                </RNText>
                <View style={[styles.badge, isDark ? styles.badgeDark : styles.badgeLight]}>
                  <RNText style={[styles.badgeText, isDark ? styles.textDark : styles.textLight]}>
                    {getWordCount(item.content || '')}
                  </RNText>
                </View>
              </View>

              {item.content && (
                <RNText
                  style={[styles.noteContent, isDark ? styles.textMuted : styles.textMutedLight]}
                  numberOfLines={2}
                >
                  {item.content}
                </RNText>
              )}

              <View style={styles.noteFooter}>
                <RNText style={[styles.noteDate, isDark ? styles.textMuted : styles.textMutedLight]}>
                  {new Date(item.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </RNText>
                <Pressable
                  onPress={() => handleDeleteNote(item)}
                  hitSlop={8}
                >
                  <Trash2 color={isDark ? '#ef4444' : '#dc2626'} size={16} />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <View style={{ backgroundColor: isDark ? '#18181b' : '#ffffff', borderRadius: 12, width: '100%', maxWidth: 320, padding: 24 }}>
            <RNText style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#fafafa' : '#09090b', marginBottom: 8 }}>
              Delete Note
            </RNText>
            <RNText style={{ color: isDark ? '#a1a1aa' : '#71717a', marginBottom: 24 }}>
              Are you sure you want to delete "{noteToDelete?.title || 'Untitled Note'}"? This action cannot be undone.
            </RNText>

            <View style={{ gap: 12, flexDirection: 'row' }}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: isDark ? '#27272a' : '#e4e4e7', justifyContent: 'center', alignItems: 'center' }}
              >
                <RNText style={{ color: isDark ? '#fafafa' : '#09090b', fontWeight: '600' }}>
                  Cancel
                </RNText>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}
              >
                <Trash2 color="#ffffff" size={18} />
                <RNText style={{ color: '#ffffff', fontWeight: '600' }}>
                  Delete
                </RNText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#09090b',
  },
  containerLight: {
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerDark: {
    borderBottomColor: '#27272a',
  },
  headerLight: {
    borderBottomColor: '#e4e4e7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  searchInputDark: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  searchInputLight: {
    backgroundColor: '#f4f4f5',
    borderColor: '#e4e4e7',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDark: {
    backgroundColor: '#7c3aed',
  },
  addButtonLight: {
    backgroundColor: '#7c3aed',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  textDark: {
    color: '#fafafa',
  },
  textLight: {
    color: '#09090b',
  },
  textMuted: {
    color: '#71717a',
  },
  textMutedLight: {
    color: '#71717a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  noteCardDark: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  noteCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e4e4e7',
  },
  noteCardPressed: {
    opacity: 0.7,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeDark: {
    backgroundColor: '#27272a',
  },
  badgeLight: {
    backgroundColor: '#f4f4f5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  noteDate: {
    fontSize: 12,
  },
});
