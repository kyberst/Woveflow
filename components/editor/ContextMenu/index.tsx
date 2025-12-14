import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Copy, Trash2, ClipboardPaste, PlusCircle } from 'lucide-react';

export default function ContextMenu() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    if (!state.contextMenu) return null;

    const { x, y, elementId } = state.contextMenu;

    const handleAction = (action: () => void) => {
        action();
        dispatch({ type: 'HIDE_CONTEXT_MENU' });
    };

    const handleDuplicate = () => handleAction(() => {
        dispatch({ type: 'DUPLICATE_ELEMENT', payload: elementId });
        dispatch({ type: 'ADD_HISTORY' });
    });

    const handleDelete = () => handleAction(() => {
        dispatch({ type: 'DELETE_ELEMENT' });
        dispatch({ type: 'ADD_HISTORY' });
    });

    const handleCopyStyles = () => handleAction(() => {
        dispatch({ type: 'COPY_STYLES', payload: elementId });
    });

    const handlePasteStyles = () => handleAction(() => {
        dispatch({ type: 'PASTE_STYLES', payload: elementId });
        dispatch({ type: 'ADD_HISTORY' });
    });
    
    const handleAddChild = () => handleAction(() => {
        dispatch({ type: 'SET_INSERTION_TARGET', payload: { elementId: elementId, mode: 'inside' } });
        dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: true });
    });

    const canPaste = !!state.clipboard?.styles;

    return (
        <div 
            className="fixed bg-white dark:bg-slate-800 shadow-2xl rounded-lg py-2 z-[100] border dark:border-slate-700 text-sm w-48"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <button onClick={handleAddChild} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <PlusCircle size={16} className="mr-2" /> {t('addChild')}
            </button>
            <button onClick={handleDuplicate} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Copy size={16} className="mr-2" /> {t('duplicate')}
            </button>
            <div className="my-1 h-px bg-gray-200 dark:bg-slate-700"></div>
            <button onClick={handleCopyStyles} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Copy size={16} className="mr-2" /> {t('copyStyles')}
            </button>
            <button onClick={handlePasteStyles} disabled={!canPaste} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <ClipboardPaste size={16} className="mr-2" /> {t('pasteStyles')}
            </button>
            <div className="my-1 h-px bg-gray-200 dark:bg-slate-700"></div>
            <button onClick={handleDelete} className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={16} className="mr-2" /> {t('delete')}
            </button>
        </div>
    );
}