// FILE: apps/mobile/App.tsx
import { StatusBar } from 'expo-status-bar';
import { NoteList } from '../components/NoteList';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

function AppContent() {
  // We can use a hook to get the theme if we need it
  const { theme } = useTheme(); 

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>SNotes</Text>
      <NoteList />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snotes-mobile-theme">
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  }
});