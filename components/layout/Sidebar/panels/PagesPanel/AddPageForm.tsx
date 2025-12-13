import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useEditor } from '../../../../../hooks/useEditor';
import { Page } from '../../../../../types';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
}

export default function AddPageForm({ onClose }: Props) {
  const { state, dispatch } = useEditor();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validate = (pageName: string) => {
    if (!pageName.trim()) return t('pageNameError.empty');
    if (state.pages.some(p => p.name.toLowerCase() === pageName.toLowerCase())) {
      return t('pageNameError.exists');
    }
    return '';
  };

  const handleAdd = () => {
    const validationError = validate(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    const newPage: Page = {
      id: `user-${Date.now()}`,
      name,
      type: 'user',
      content: '<div class="p-4"><h1>New Page</h1></div>'
    };
    dispatch({ type: 'ADD_PAGE', payload: newPage });
    onClose();
  };

  return (
    <div className="pl-4 mb-2">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className={`w-full text-sm p-1 border rounded ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-transparent`}
        placeholder={t('pageName')}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <div className="flex space-x-1 mt-1">
        <button onClick={handleAdd} className="p-1 bg-green-500 text-white rounded"><Check size={12} /></button>
        <button onClick={onClose} className="p-1 bg-gray-400 text-white rounded"><X size={12} /></button>
      </div>
    </div>
  );
}