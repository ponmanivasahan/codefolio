import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Force dark mode for now to override any previously saved 'light' theme
    const saved = localStorage.getItem('cf_theme');
    if (saved === 'light') {
      localStorage.setItem('cf_theme', 'dark');
      return 'dark';
    }
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('cf_theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const setDark = () => setTheme('dark');
  const setLight = () => setTheme('light');

  return (
    <ThemeContext.Provider value={{ theme, toggle, setDark, setLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);