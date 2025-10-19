import { View, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun, Info, Github, Mail } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useColorScheme } from 'nativewind';
import { useNotesStore } from 'shared/store';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { notes } = useNotesStore();

  const isDark = colorScheme === 'dark';

  const totalNotes = notes.length;
  const totalWords = notes.reduce((acc, note) => {
    return acc + (note.content?.trim().split(/\s+/).filter(Boolean).length || 0);
  }, 0);

  const handleToggleTheme = (checked: boolean) => {
    setColorScheme(checked ? 'dark' : 'light');
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-3 border-b border-border flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft className="text-foreground" size={24} />
        </Button>
        <Text className="text-2xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-4">
        {/* Statistics Card */}
        <Card className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Statistics
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">Total Notes</Text>
              <Text className="text-foreground font-semibold">{totalNotes}</Text>
            </View>
            <Separator />
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">Total Words</Text>
              <Text className="text-foreground font-semibold">
                {totalWords.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Appearance Card */}
        <Card className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Appearance
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {isDark ? (
                <Moon className="text-foreground" size={20} />
              ) : (
                <Sun className="text-foreground" size={20} />
              )}
              <Text className="text-foreground">Dark Mode</Text>
            </View>
            <Switch checked={isDark} onCheckedChange={handleToggleTheme} />
          </View>
        </Card>

        {/* About Card */}
        <Card className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            About
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <Info className="text-muted-foreground" size={20} />
              <View>
                <Text className="text-foreground font-medium">SNotes Mobile</Text>
                <Text className="text-sm text-muted-foreground">Version 1.0.0</Text>
              </View>
            </View>
            <Separator />
            <Button
              variant="ghost"
              className="justify-start"
              onPress={() => Linking.openURL('https://github.com/slantie/SNotes')}
            >
              <Github className="text-foreground mr-3" size={20} />
              <Text className="text-foreground">View on GitHub</Text>
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onPress={() => Linking.openURL('mailto:support@snotes.app')}
            >
              <Mail className="text-foreground mr-3" size={20} />
              <Text className="text-foreground">Contact Support</Text>
            </Button>
          </View>
        </Card>

        {/* Footer */}
        <View className="items-center py-8">
          <Text className="text-sm text-muted-foreground text-center">
            Made with ❤️ for note-taking enthusiasts
          </Text>
          <Text className="text-xs text-muted-foreground mt-2">
            © 2025 SNotes. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
