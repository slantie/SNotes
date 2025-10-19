import { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Share,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotesStore } from 'shared/store';
import {
  ArrowLeft,
  Trash2,
  Download,
  Check,
  Copy,
  X,
  MoreVertical,
} from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';

export default function NoteEditorScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { notes, activeNoteId, updateNoteContent, deleteNote } =
    useNotesStore();
  const activeNote = notes.find((note) => note.id === activeNoteId);

  const [title, setTitle] = useState(activeNote?.title || '');
  const [content, setContent] = useState(activeNote?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || '');
      setContent(activeNote.content || '');
    }
  }, [activeNote]);

  // Auto-save with debounce
  useEffect(() => {
    if (!activeNote) return;

    const hasContentChanged =
      title !== activeNote.title || content !== activeNote.content;

    if (hasContentChanged) {
      setHasChanges(true);
      const timer = setTimeout(() => {
        setIsSaving(true);
        updateNoteContent(activeNote.id, content, title);
        setTimeout(() => {
          setIsSaving(false);
          setHasChanges(false);
        }, 500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [title, content, activeNote, updateNoteContent]);

  const handleDelete = useCallback(() => {
    if (!activeNote) return;
    setShowDeleteModal(true);
  }, [activeNote]);

  const confirmDelete = useCallback(() => {
    if (!activeNote) return;
    setShowDeleteModal(false);
    deleteNote(activeNote.id);
    router.back();
  }, [activeNote, deleteNote, router]);

  const handleExport = useCallback(() => {
    if (!activeNote) return;
    setShowExportModal(true);
  }, [activeNote]);

  const exportAsText = useCallback(async () => {
    if (!activeNote) return;
    try {
      await Share.share({
        message: `${activeNote.title || 'Untitled Note'}\n\n${activeNote.content}`,
        title: activeNote.title || 'Untitled Note',
      });
      setShowExportModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to share note');
    }
  }, [activeNote]);

  const copyToClipboard = useCallback(() => {
    // This would require react-native-clipboard or similar
    // For now, show alert
    Alert.alert('Copied', 'Note copied to clipboard (feature coming soon)');
    setShowExportModal(false);
  }, []);

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  };

  const getCharCount = () => {
    return content.length;
  };

  if (!activeNote) {
    return (
      <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-muted-foreground">No note selected</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 16, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#7c3aed', borderRadius: 8 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ArrowLeft color="#ffffff" size={20} />
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Go Back</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff' }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      {/* Header */}
      <View className="px-4 py-3 border-b border-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ArrowLeft className="text-foreground" size={24} />
          </Pressable>

          <View className="flex-1">
            {isSaving ? (
              <Text className="text-sm text-muted-foreground">Saving...</Text>
            ) : hasChanges ? (
              <Text className="text-sm text-muted-foreground">
                Unsaved changes
              </Text>
            ) : (
              <View className="flex-row items-center gap-1">
                <Check className="text-green-500" size={16} />
                <Text className="text-sm text-green-500">Saved</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          onPress={() => setShowExportModal(true)}
          hitSlop={8}
        >
          <MoreVertical className="text-foreground" size={24} />
        </Pressable>
      </View>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <View style={{ backgroundColor: colorScheme === 'dark' ? '#18181b' : '#ffffff', borderRadius: 12, width: '100%', maxWidth: 320, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text className="text-lg font-bold text-foreground">
                Export Note
              </Text>
              <Pressable onPress={() => setShowExportModal(false)} hitSlop={8}>
                <X className="text-muted-foreground" size={24} />
              </Pressable>
            </View>

            <View style={{ gap: 12 }}>
              <Pressable
                onPress={exportAsText}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e4e4e7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Download size={18} color={colorScheme === 'dark' ? '#fafafa' : '#09090b'} />
                <Text className="text-foreground font-semibold">Share Note</Text>
              </Pressable>

              <Pressable
                onPress={copyToClipboard}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e4e4e7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Copy size={18} color={colorScheme === 'dark' ? '#fafafa' : '#09090b'} />
                <Text className="text-foreground font-semibold">Copy to Clipboard</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowExportModal(false)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <View style={{ backgroundColor: colorScheme === 'dark' ? '#18181b' : '#ffffff', borderRadius: 12, width: '100%', maxWidth: 320, padding: 24 }}>
            <Text className="text-lg font-bold text-foreground mb-2">
              Delete Note
            </Text>
            <Text className="text-muted-foreground mb-6">
              Are you sure you want to delete "{activeNote?.title || 'Untitled Note'}"? This action cannot be undone.
            </Text>

            <View style={{ gap: 12, flexDirection: 'row' }}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e4e4e7',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: '#ef4444',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Trash2 color="#ffffff" size={18} />
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Editor */}
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        style={{ padding: 16 }}
      >
        {/* Title Input */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Note Title"
          placeholderTextColor={
            colorScheme === 'dark' ? '#71717a' : '#a1a1aa'
          }
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colorScheme === 'dark' ? '#fafafa' : '#09090b',
            marginBottom: 16,
          }}
          multiline
        />

        {/* Content Input */}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={
            colorScheme === 'dark' ? '#71717a' : '#a1a1aa'
          }
          style={{
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fafafa' : '#09090b',
            minHeight: 400,
            lineHeight: 24,
          }}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Footer Stats */}
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colorScheme === 'dark' ? '#27272a' : '#e4e4e7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#09090b' : '#f9f9fb',
      }}>
        <Text className="text-xs text-muted-foreground">
          {getWordCount()} words · {getCharCount()} characters
        </Text>
        <Text className="text-xs text-muted-foreground">
          {new Date(activeNote.updated_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
