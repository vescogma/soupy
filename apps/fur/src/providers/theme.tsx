import { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({
  defaultTheme = "system",
  storageKey = "ui-theme",
  children,
  ...props
}: {
  defaultTheme?: Theme;
  storageKey?: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      root.classList.add(prefersDark ? "dark" : "light");
      return;
    }
    root.classList.add(theme);
  }, [theme, prefersDark]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
