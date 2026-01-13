'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeId, getTheme, getThemeCSSVariables, DEFAULT_THEME } from '@/lib/themes';
import { useAnalytics } from './useAnalytics';

const THEME_STORAGE_KEY = 'tarot-app-theme';

interface UseThemeReturn {
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  isLoading: boolean;
}

export function useTheme(): UseThemeReturn {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const { track } = useAnalytics();

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (savedTheme && ['dark-mystical', 'light-ethereal', 'deep-ocean', 'cosmic-purple'].includes(savedTheme)) {
        setThemeId(savedTheme);
        applyTheme(savedTheme);
      } else {
        applyTheme(DEFAULT_THEME);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      applyTheme(DEFAULT_THEME);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme CSS variables to document
  const applyTheme = useCallback((id: ThemeId) => {
    const theme = getTheme(id);
    const cssVars = getThemeCSSVariables(theme);

    // Apply to document root
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', id);

    // Update body background
    document.body.style.backgroundColor = theme.colors.bgPrimary;
    document.body.style.color = theme.colors.textPrimary;
  }, []);

  // Set and persist theme
  const setTheme = useCallback(
    (newThemeId: ThemeId) => {
      setThemeId(newThemeId);
      applyTheme(newThemeId);

      // Save to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      } catch (error) {
        console.error('Error saving theme:', error);
      }

      // Track analytics
      track('theme_changed', { theme: newThemeId });
    },
    [applyTheme, track]
  );

  return {
    themeId,
    setTheme,
    isLoading,
  };
}

export default useTheme;


