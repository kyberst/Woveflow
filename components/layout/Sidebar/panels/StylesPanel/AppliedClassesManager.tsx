import React, { useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { BuilderElementNode } from '../../../../../types';
import { X } from 'lucide-react';

const findNodeById = (nodes: (BuilderElementNode | string)[], id: string): BuilderElementNode | null => {
  for (const node of nodes) {
    if (typeof node === 'string') continue;
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
};

export default function AppliedClassesManager() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const { selectedElementId, pages, currentPageId, globalClasses } = state;

  const selectedNode = useMemo(() => {
    if (!selectedElementId) return null;
    const currentPage = pages.find(p => p.id === currentPageId);
    return currentPage ? findNodeById(currentPage.content, selectedElementId) : null;
  }, [selectedElementId, pages, currentPageId]);

  const appliedClasses = selectedNode?.classNames || [];

  const handleAddClass = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const className = e.target.value;
    if (className && !appliedClasses.includes(className)) {
      const newClasses = [...appliedClasses, className];
      dispatch({ type: 'UPDATE_ELEMENT_CLASSES', payload: { elementId: selectedElementId!, classNames: newClasses } });
    }
  };

  const handleRemoveClass = (className: string) => {
    const newClasses = appliedClasses.filter(c => c !== className);
    dispatch({ type: 'UPDATE_ELEMENT_CLASSES', payload: { elementId: selectedElementId!, classNames: newClasses } });
  };
  
  return (
    <div className="p-4 border-b dark:border-slate-700">
      <h4 className="text-sm font-bold mb-2">{t('appliedClasses')}</h4>
      <div className="flex flex-wrap gap-2 mb-2">
        {appliedClasses.map(cls => (
          <div key={cls} className="flex items-center bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            <span>{cls}</span>
            <button onClick={() => handleRemoveClass(cls)} className="ml-1.5 -mr-1 text-blue-500 hover:text-blue-700">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <select 
        onChange={handleAddClass} 
        value=""
        className="w-full text-sm p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
      >
        <option value="">Add a class...</option>
        {globalClasses.filter(gc => !appliedClasses.includes(gc.name)).map(gc => (
          <option key={gc.id} value={gc.name}>{gc.name}</option>
        ))}
      </select>
    </div>
  );
}