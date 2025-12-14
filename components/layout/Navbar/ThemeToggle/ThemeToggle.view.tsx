import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleViewProps {
    theme: 'light' | 'dark';
    handleToggleTheme: () => void;
}

export default function ThemeToggleView({ theme, handleToggleTheme }: ThemeToggleViewProps) {
    return (
        <button onClick={handleToggleTheme} className="p-2 text-slate-500 hover:text-yellow-500 transition-colors">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}