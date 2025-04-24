'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Theme, ThemeContext } from './themeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with a default theme, but we'll check localStorage on mount
  const [theme, setTheme] = useState<Theme>('light');

  // Update the theme state and persist to localStorage
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme class to document element
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // On mount, check if theme is saved in localStorage or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      handleThemeChange(savedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      handleThemeChange(systemPrefersDark ? 'dark' : 'light');

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        handleThemeChange(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}
