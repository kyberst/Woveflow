import React, { useMemo } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Copy, Trash2, ClipboardPaste, PlusCircle, Grid3x3, Layout, Columns } from 'lucide-react';
import { findParent } from '../../../utils/tree';
import { ViewMode } from '../../../types';

export default function ContextMenu() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    const parentGridData = useMemo(() => {
        if (!state.contextMenu) return null;
        const currentPage = state.pages.find(p => p.id === state.currentPageId);
        if (!currentPage) return null;

        const parent = findParent(currentPage.content, state.contextMenu.elementId);
        if (!parent) return null;

        // Determine if parent is a grid in the current view or desktop fallback
        const viewStyles = parent.styles[state.viewMode] || {};
        const desktopStyles = parent.styles.desktop || {};
        
        // Simple cascading check for display property
        let display = viewStyles.display;
        if (!display && (state.viewMode === ViewMode.Tablet || state.viewMode === ViewMode.Mobile)) {
             display = parent.styles.tablet?.display;
        }
        if (!display) {
             display = desktopStyles.display;
        }

        return display === 'grid' ? { isGrid: true, parentId: parent.id } : null;
    }, [state.contextMenu, state.pages, state.currentPageId, state.viewMode]);

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

    const handleConvertToGrid = (columns: number) => handleAction(() => {
        dispatch({ 
            type: 'SET_GRID_LAYOUT', 
            payload: { elementId, layout: 'grid', columns, gap: '1rem' } 
        });
        dispatch({ type: 'ADD_HISTORY' });
    });

    const handleConvertToFlex = () => handleAction(() => {
        dispatch({ 
            type: 'SET_GRID_LAYOUT', 
            payload: { elementId, layout: 'flex', gap: '1rem' } 
        });
        dispatch({ type: 'ADD_HISTORY' });
    });

    const handleSpanChange = (span: number | string) => handleAction(() => {
        dispatch({
            type: 'UPDATE_CHILD_SPAN',
            payload: { elementId, span }
        });
        dispatch({ type: 'ADD_HISTORY' });
    });

    const canPaste = !!state.clipboard?.styles;

    return (
        <div 
            className="fixed bg-white dark:bg-slate-800 shadow-2xl rounded-lg py-2 z-[100] border dark:border-slate-700 text-sm w-56"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('actions') || 'Actions'}</div>
            <button onClick={handleAddChild} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <PlusCircle size={16} className="mr-2" /> {t('addChild')}
            </button>
            <button onClick={handleDuplicate} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Copy size={16} className="mr-2" /> {t('duplicate')}
            </button>
            
            <div className="my-1 h-px bg-gray-200 dark:bg-slate-700"></div>
            <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('layoutOptions') || 'Layout'}</div>
            
            <button onClick={() => handleConvertToGrid(2)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Grid3x3 size={16} className="mr-2" /> {t('grid2Col') || 'Grid (2 Cols)'}
            </button>
            <button onClick={() => handleConvertToGrid(3)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Grid3x3 size={16} className="mr-2" /> {t('grid3Col') || 'Grid (3 Cols)'}
            </button>
            <button onClick={handleConvertToFlex} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Layout size={16} className="mr-2" /> {t('flexRow') || 'Flex Row'}
            </button>

            {parentGridData && (
                <>
                    <div className="my-1 h-px bg-gray-200 dark:bg-slate-700"></div>
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('gridChildOptions') || 'Grid Item'}</div>
                    <button onClick={() => handleSpanChange(1)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                        <Columns size={16} className="mr-2" /> {t('span1') || 'Span 1'}
                    </button>
                    <button onClick={() => handleSpanChange(2)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                        <Columns size={16} className="mr-2" /> {t('span2') || 'Span 2'}
                    </button>
                    <button onClick={() => handleSpanChange('1 / -1')} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                        <Columns size={16} className="mr-2" /> {t('spanFull') || 'Span Full'}
                    </button>
                </>
            )}

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