import React from 'react';
import SiteSelector from './SiteSelector';
import EditorActions from './EditorActions';
import ViewportControls from './ViewportControls';
import PublishButton from './PublishButton';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-50 flex items-center justify-between px-4 shadow-sm">
      <SiteSelector />
      <EditorActions />
      <div className="flex items-center space-x-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <ViewportControls />
        <PublishButton />
      </div>
    </nav>
  );
}