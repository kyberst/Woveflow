import React, { useState } from 'react';
import { Page } from '../../../../../types';
import { useEditor } from '../../../../../hooks/useEditor';
import { useNavigate } from 'react-router-dom';
import { Edit2, Copy, Trash2, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  page: Page;
  key?: React.Key;
}

export default function PageItem({ page }: Props) {
  const { state, dispatch } = useEditor();
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(page.name);
  const { t } = useTranslation();

  const handleSelectPage = () => {
    navigate(`/editor/${state.currentSite}/${page.id}`);
  };

  const handleRename = () => {
    dispatch({ type: 'RENAME_PAGE', payload: { id: page.id, name } });
    setIsRenaming(false);
  };
  
  const handleDuplicate = () => dispatch({ type: 'DUPLICATE_PAGE', payload: page.id });
  const handleDelete = () => {
      if (confirm(t('confirmDeletePage'))) {
          dispatch({ type: 'DELETE_PAGE', payload: page.id });
      }
  };

  const isSelected = state.currentPageId === page.id;

  if (isRenaming) {
    return (
      <div className="p-2">
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-1 text-sm border rounded bg-transparent"
        />
        <div className="flex space-x-1 mt-1 justify-end">
          <button onClick={handleRename} className="p-1 bg-green-500 text-white rounded"><Check size={12} /></button>
          <button onClick={() => setIsRenaming(false)} className="p-1 bg-gray-400 text-white rounded"><X size={12} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-sm">
      <span
        className={`cursor-pointer flex-grow ${isSelected ? 'font-bold text-blue-600' : ''}`}
        onClick={handleSelectPage}
      >
        {page.name}
      </span>
      {page.type === 'user' && (
        <div className="hidden group-hover:flex items-center space-x-1 bg-white dark:bg-slate-800 shadow p-1 rounded absolute right-2">
          <button onClick={() => setIsRenaming(true)} title={t('rename')}><Edit2 size={12} /></button>
          <button onClick={handleDuplicate} title={t('duplicate')}><Copy size={12} /></button>
          <button onClick={handleDelete} title={t('delete')} className="text-red-500"><Trash2 size={12} /></button>
        </div>
      )}
    </div>
  );
}