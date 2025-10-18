import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Custom color palette
                primary: {
                    main: "#8155c6",
                    light: "#ff7070",
                    lighter: "#fc6f6f",
                    // ShadCN compatibility
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },

                dark: {
                    text: "#DFDFD6",
                    background: "#1B1B1F", // For the main page background in dark mode
                    highlight: "#8155c6",
                    muted: {
                        text: "#FFFFFF",
                        background: "#202127", // For component backgrounds (cards, tables) in dark mode
                    },
                    noisy: {
                        text: "#98989F",
                        background: "#161618",
                    },
                    hover: "#414853",
                    secondary: "#32363F", // For borders and dividers in dark mode
                    tertiary: "#98989F",
                },

                light: {
                    text: "#3C3C43",
                    background: "#FFFFFF", // CORRECTED: For component backgrounds (cards, tables) in light mode
                    highlight: "#8155c6",
                    muted: {
                        text: "#67676C",
                        background: "#F6F6F7", // For the main page background in light mode
                    },
                    noisy: {
                        text: "#67676C",
                        background: "#C2C2C4",
                    },
                    hover: "#E4E4E9",
                    secondary: "#EBEBEF", // For borders and dividers in light mode
                    tertiary: "#98989F",
                },

                // ShadCN UI color system (required for components)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'], // Set DM Sans as the primary font
                mono: ['DM Mono', 'monospace'],   // Set DM Mono for code
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};

export default config;