import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function SaveComponentModal({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim() || !state.selectedElementId || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    const el = doc?.querySelector(`[data-builder-id="${state.selectedElementId}"]`);

    if (el) {
        try {
            const stored = localStorage.getItem('mis componentes') || '[]';
            const components = JSON.parse(stored);
            components.push({ name, content: el.outerHTML });
            localStorage.setItem('mis componentes', JSON.stringify(components));
            alert(`Component "${name}" saved!`);
        } catch(e) {
            alert("Failed to save component.");
            console.error(e);
        }
    }
    dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-96 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-bold flex items-center"><PackagePlus size={18} className="mr-2" />{t('saveComponent')}</h3>
          <button onClick={() => dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: false })} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-2">
            <label htmlFor="componentName" className="text-sm font-medium">{t('componentName')}</label>
            <input 
                id="componentName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
            />
        </div>
        <div className="flex justify-end p-4 border-t dark:border-slate-700 space-x-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: false })} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-builder-primary text-white rounded">{t('save')}</button>
        </div>
      </div>
    </div>
  );
}