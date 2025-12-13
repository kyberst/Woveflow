import React, { useState, useEffect } from 'react';
import { X, Code } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function CodeEditorModal({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const el = doc?.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
      if (el) {
        setHtml(el.innerHTML);
      }
    }
  }, [state.selectedElementId, iframeRef]);

  const handleSave = () => {
    if (!state.selectedElementId) return;
    dispatch({ type: 'UPDATE_ELEMENT_innerHTML', payload: { elementId: state.selectedElementId, html } });
    dispatch({ type: 'ADD_HISTORY' });
    dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-[40rem] h-[60vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-bold flex items-center"><Code size={18} className="mr-2" />{t('editCode')}</h3>
          <button onClick={() => dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: false })} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow p-4">
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-full p-2 border rounded font-mono text-sm bg-slate-100 dark:bg-slate-900 dark:border-slate-600"
          />
        </div>
        <div className="flex justify-end p-4 border-t dark:border-slate-700 space-x-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: false })} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-builder-primary text-white rounded">{t('save')}</button>
        </div>
      </div>
    </div>
  );
}