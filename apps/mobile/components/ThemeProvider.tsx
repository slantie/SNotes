import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "snotes-mobile-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((value: string | null) => {
      if (value) {
        setTheme(value as Theme)
      }
      setIsLoaded(true)
    })
  }, [storageKey])

  // Listen to system theme changes
  useEffect(() => {
    if (theme === "system") {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        // Force re-render when system theme changes
        setTheme("system")
      })
      return () => subscription.remove()
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      AsyncStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  // Don't render children until theme is loaded
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}