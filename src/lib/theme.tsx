import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Accent = 'green' | 'blue' | 'gold';

type ThemeCtx = {
  theme: Theme;
  accent: Accent;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  toggleAccent: () => void;
};

const Ctx = createContext<ThemeCtx | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [accent, setAccentState] = useState<Accent>('green');

  useEffect(() => {
    const savedTheme = localStorage.getItem('sj-theme') as Theme | null;
    const savedAccent = localStorage.getItem('sj-accent') as Accent | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedAccent) setAccentState(savedAccent);
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('sj-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('accent-blue', 'accent-gold');
    document.body.classList.add(`accent-${accent}`);
    localStorage.setItem('sj-accent', accent);
  }, [accent]);

  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  const setTheme = (t: Theme) => setThemeState(t);
  const setAccent = (a: Accent) => setAccentState(a);
  const toggleAccent = () => setAccentState((a) => a === 'green' ? 'blue' : a === 'blue' ? 'gold' : 'green');

  return <Ctx.Provider value={{ theme, accent, toggle, setTheme, setAccent, toggleAccent }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
