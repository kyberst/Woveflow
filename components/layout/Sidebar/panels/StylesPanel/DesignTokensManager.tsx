import React, { useState } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Palette, Type, Space } from 'lucide-react';
import { DesignToken, DesignTokenCategory } from '../../../../../types';
import TokenEditModal from './TokenEditModal';

export default function DesignTokensManager() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<DesignToken | null>(null);

  const handleEdit = (token: DesignToken) => {
    setEditingToken(token);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingToken(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, category: DesignTokenCategory) => {
      if (confirm('Are you sure you want to delete this token?')) {
          dispatch({ type: 'DELETE_DESIGN_TOKEN', payload: { id, category }});
      }
  };

  const renderToken = (token: DesignToken) => (
    <div key={token.id} className="group flex items-center justify-between p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
      <div className="flex items-center">
        {token.category === 'colors' && <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: token.value }} />}
        <span className="text-xs font-mono">--{token.name}</span>
        <span className="text-xs text-slate-400 ml-2 truncate hidden md:inline">{token.value}</span>
      </div>
      <div className="hidden group-hover:flex items-center space-x-2">
        <button onClick={() => handleEdit(token)}><Edit2 size={12} /></button>
        <button onClick={() => handleDelete(token.id, token.category)}><Trash2 size={12} className="text-red-500"/></button>
      </div>
    </div>
  );

  const tokenCategories: { key: DesignTokenCategory, title: string, icon: React.ElementType }[] = [
      { key: 'colors', title: t('colors'), icon: Palette },
      { key: 'fonts', title: t('fonts'), icon: Type },
      { key: 'spacing', title: t('spacing'), icon: Space },
  ];

  return (
    <div className="p-4 pt-0">
      <div className="flex items-center justify-end mb-2">
        <button onClick={handleAddNew} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded" title={t('addToken')}>
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-4 text-sm">
        {tokenCategories.map(({ key, title, icon: Icon }) => (
            <div key={key}>
                <h5 className="flex items-center text-xs font-bold uppercase text-slate-400 mb-1">
                    <Icon size={12} className="mr-1.5"/>
                    {title}
                </h5>
                <div className="space-y-1">
                    {state.designTokens[key].map(renderToken)}
                </div>
            </div>
        ))}
      </div>
      {isModalOpen && <TokenEditModal initialToken={editingToken} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}