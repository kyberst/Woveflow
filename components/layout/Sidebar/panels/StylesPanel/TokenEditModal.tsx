import React, { useState } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { DesignToken, DesignTokenCategory } from '../../../../../types';

interface Props {
  initialToken: DesignToken | null;
  onClose: () => void;
}

export default function TokenEditModal({ initialToken, onClose }: Props) {
  // FIX: Get state to access currentUser
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [name, setName] = useState(initialToken?.name || '');
  const [value, setValue] = useState(initialToken?.value || '');
  const [category, setCategory] = useState<DesignTokenCategory>(initialToken?.category || 'colors');

  const handleSave = () => {
    // FIX: Add check for currentUser and include owner in payload
    if (!name.trim() || !value.trim() || !state.currentUser) return;
    const tokenData: DesignToken = {
      id: initialToken?.id || `dt-${Date.now()}`,
      name: name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(), // Sanitize token name
      value,
      category,
      owner: state.currentUser.id,
    };
    dispatch({ type: initialToken ? 'UPDATE_DESIGN_TOKEN' : 'ADD_DESIGN_TOKEN', payload: tokenData });
    onClose();
  };
  
  return (
     <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-96 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h3 className="text-lg font-bold">{initialToken ? t('editToken') : t('addToken')}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <X size={20} />
            </button>
        </div>
        <div className="p-4 space-y-4">
            <div>
                <label className="text-xs font-semibold">{t('category')}</label>
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as DesignTokenCategory)}
                    className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                >
                    <option value="colors">{t('colors')}</option>
                    <option value="fonts">{t('fonts')}</option>
                    <option value="spacing">{t('spacing')}</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-semibold">{t('tokenName')}</label>
                <input 
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
            </div>
             <div>
                <label className="text-xs font-semibold">{t('tokenValue')}</label>
                 <input 
                    type={category === 'colors' ? 'color' : 'text'}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
            </div>
        </div>
         <div className="flex justify-end p-4 border-t dark:border-slate-700 space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-builder-primary text-white rounded">{t('save')}</button>
        </div>
      </div>
    </div>
  );
}