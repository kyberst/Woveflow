import React from 'react';
import ThemeToggleView from './ThemeToggle/ThemeToggle.view';
import { useThemeToggle } from './ThemeToggle/useThemeToggle.hook';

export default function ThemeToggle() {
  const {
    theme,
    handleToggleTheme,
  } = useThemeToggle();

  return (
    <ThemeToggleView
      theme={theme}
      handleToggleTheme={handleToggleTheme}
    />
  );
}