import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { useCommandSearch } from './useCommandSearch';
import CommandItem from './CommandItem';

export default function CommandPalette() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();
    const { query, setQuery, filteredCommands } = useCommandSearch(state.showCommandPalette);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const close = () => {
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE', payload: false });
        setSelectedIndex(0);
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                dispatch({ type: 'TOGGLE_COMMAND_PALETTE', payload: !state.showCommandPalette });
            }

            if (!state.showCommandPalette) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    close();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.showCommandPalette, filteredCommands, selectedIndex, dispatch]);

    // Auto-focus & Scroll effects
    useEffect(() => {
        if (state.showCommandPalette) setTimeout(() => inputRef.current?.focus(), 50);
    }, [state.showCommandPalette]);

    useEffect(() => setSelectedIndex(0), [query]);

    useEffect(() => {
        if (listRef.current) {
            const el = listRef.current.children[selectedIndex] as HTMLElement;
            if (el) el.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    if (!state.showCommandPalette) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-grow bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-lg"
                        placeholder={t('searchPlaceholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
                </div>

                <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                         <div className="px-4 py-8 text-center text-slate-500"><p>No results found.</p></div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <CommandItem 
                                key={cmd.id} 
                                item={cmd} 
                                isActive={index === selectedIndex} 
                                onClick={() => { cmd.action(); close(); }} 
                            />
                        ))
                    )}
                </div>
                 <div className="bg-gray-50 dark:bg-slate-950 px-4 py-2 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                     <div className="flex space-x-3">
                        <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
                        <span><kbd className="font-sans">↵</kbd> to select</span>
                     </div>
                </div>
            </div>
        </div>
    );
}