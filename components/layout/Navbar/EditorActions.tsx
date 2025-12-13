import React from 'react';
import { Undo, Redo, Eye, EyeOff } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

export default function EditorActions() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    return (
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
            <button disabled={state.isPreviewing} onClick={() => dispatch({ type: 'UNDO' })} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title={t('undo')}>
                <Undo size={18} />
            </button>
            <button disabled={state.isPreviewing} onClick={() => dispatch({ type: 'REDO' })} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title={t('redo')}>
                <Redo size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
            <button onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors" title={state.isPreviewing ? t('exitPreview') : t('preview')}>
                {state.isPreviewing ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}