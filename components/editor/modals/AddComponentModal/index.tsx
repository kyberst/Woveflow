import React from 'react';
import { X } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import ComponentsPanel from '../../../layout/Sidebar/panels/ComponentsPanel';
import { BuilderComponent } from '../../../../types';

export default function AddComponentModal() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();

  const handleComponentInsert = (component: BuilderComponent) => {
    const targetId = state.insertionTarget ? state.insertionTarget.elementId : null;
    const mode = state.insertionTarget ? state.insertionTarget.mode : 'inside';

    dispatch({ 
      type: 'ADD_ELEMENT', 
      payload: { 
        targetId, 
        mode, 
        element: JSON.parse(JSON.stringify(component.content)) // Deep copy
      } 
    });
    
    dispatch({ type: 'ADD_HISTORY' });
    dispatch({ type: 'SET_INSERTION_TARGET', payload: null });
    dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-[40rem] h-[80vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h3 className="text-lg font-bold">{t('insertComponents')}</h3>
            <button onClick={() => dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: false })} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <X size={20} />
            </button>
        </div>
        <div className="flex-grow overflow-hidden">
            <ComponentsPanel onItemClick={handleComponentInsert} />
        </div>
      </div>
    </div>
  );
}