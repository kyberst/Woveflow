import React, { useState, useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Sparkles } from 'lucide-react';
import ClassEditModal from './ClassEditModal';
import { GlobalClass, BuilderElementNode } from '../../../../../types';
import { CSSProperties } from 'react';

const findNodeById = (nodes: (BuilderElementNode | string)[], id: string): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        if (node.id === id) return node;
        const found = findNodeById(node.children, id);
        if (found) return found;
    }
    return null;
};

export default function GlobalClassManager() {
  const { state } = useEditor();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GlobalClass | null>(null);
  const [initialStyles, setInitialStyles] = useState<CSSProperties | undefined>(undefined);

  const selectedNode = useMemo(() => {
    if (!state.selectedElementId) return null;
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return null;
    return findNodeById(currentPage.content, state.selectedElementId);
  }, [state.selectedElementId, state.pages, state.currentPageId]);

  const handleEdit = (cls: GlobalClass) => {
    setEditingClass(cls);
    setInitialStyles(undefined);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingClass(null);
    setInitialStyles(undefined);
    setIsModalOpen(true);
  }

  const handleCreateFromSelection = () => {
      if (selectedNode) {
          setEditingClass(null);
          // Only copy non-empty styles
          const styles: CSSProperties = {};
          const desktopStyles = selectedNode.styles.desktop || {};
          Object.entries(desktopStyles).forEach(([key, value]) => {
              if (value) (styles as any)[key] = value;
          });
          
          setInitialStyles(styles);
          setIsModalOpen(true);
      }
  }

  return (
    <div className="p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-semibold uppercase">{t('manageClasses') || "Classes"}</span>
        <div className="flex space-x-1">
            {state.selectedElementId && (
                <button 
                    onClick={handleCreateFromSelection} 
                    className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-blue-500" 
                    title="Create Class from Selection"
                >
                    <Sparkles size={16} />
                </button>
            )}
            <button onClick={handleAddNew} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded" title={t('createClass')}>
            <Plus size={16} />
            </button>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        {state.globalClasses.length === 0 && <div className="text-slate-400 italic text-xs">No global classes yet.</div>}
        {state.globalClasses.map(cls => (
          <div key={cls.id} className="group flex items-center justify-between p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
            <span className="font-mono text-xs">.{cls.name}</span>
            <div className="hidden group-hover:flex items-center space-x-2">
                <button onClick={() => handleEdit(cls)}><Edit2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && <ClassEditModal initialClass={editingClass} initialStyles={initialStyles} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}