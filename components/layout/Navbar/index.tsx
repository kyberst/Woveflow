import React from 'react';
import SiteSelector from './SiteSelector';
import EditorActions from './EditorActions';
import ViewportControls from './ViewportControls';
import PublishButton from './PublishButton';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-white/80 dark:bg-builder-dark/80 backdrop-blur-md border-b border-builder-border dark:border-builder-darkBorder z-50 flex items-center justify-between px-4 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-6">
        <SiteSelector />
        <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="hidden md:block">
            <ViewportControls />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <EditorActions />
        <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
             <LanguageSwitcher />
          </div>
          <ThemeToggle />
        </div>
        <PublishButton />
      </div>
    </nav>
  );
}