import React from 'react';
import ThemeToggleView from './ThemeToggle.view';
import { useThemeToggle } from './useThemeToggle.hook';

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