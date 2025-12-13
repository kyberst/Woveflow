import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';

export default function ThemeToggle() {
    const { state, dispatch } = useEditor();

    return (
        <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })} className="p-2 text-slate-500 hover:text-yellow-500 transition-colors">
            {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}