// FILE: apps/mobile/components/NoteList.tsx
import { useEffect } from "react";
import { useNotesStore } from "shared/store";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";

export function NoteList() {
  const { notes, activeNote, setActiveNote, fetchNotes } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  if (notes.length === 0) {
    return <ActivityIndicator style={{marginTop: 20}} />;
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.item,
            activeNote?.id === item.id && styles.activeItem,
          ]}
          onPress={() => setActiveNote(item)}
        >
          <Text style={styles.itemText}>{item.title || "Untitled Note"}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  activeItem: { backgroundColor: '#2A2A2A' },
  itemText: { color: '#FFF' }
});