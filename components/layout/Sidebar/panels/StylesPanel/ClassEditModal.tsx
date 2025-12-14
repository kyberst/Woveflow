import React, { useState, useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { GlobalClass } from '../../../../../types';
import { STYLE_PROPERTIES } from '../../../../../constants';
import StyleInput from './StyleInput';
import { CSSProperties } from 'react';

interface Props {
  initialClass: GlobalClass | null;
  initialStyles?: CSSProperties;
  onClose: () => void;
}

export default function ClassEditModal({ initialClass, initialStyles, onClose }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [name, setName] = useState(initialClass?.name || '');
  const [styles, setStyles] = useState(initialClass?.styles || initialStyles || {});

  const handleStyleChange = (prop: string, value: string) => {
    setStyles(prev => ({ ...prev, [prop]: value }));
  };

  const handleSave = () => {
    if (!name.trim() || !state.currentUser) return;
    const classData: GlobalClass = {
      id: initialClass?.id || `cls-${Date.now()}`,
      name: name.replace(/[^a-zA-Z0-9-_]/g, ''), // Sanitize class name
      styles,
      owner: state.currentUser.id,
    };
    dispatch({ type: initialClass ? 'UPDATE_GLOBAL_CLASS' : 'ADD_GLOBAL_CLASS', payload: classData });
    onClose();
  };
  
  return (
     <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-[24rem] h-[80vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h3 className="text-lg font-bold">{initialClass ? t('editClass') : t('createClass')}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <X size={20} />
            </button>
        </div>
        <div className="p-4 border-b dark:border-slate-700">
            <label className="text-xs font-semibold">{t('className')}</label>
            <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                placeholder="e.g., my-custom-card"
            />
        </div>
        <div className="flex-grow overflow-y-auto">
            {STYLE_PROPERTIES.map(group => (
                <div key={group.group} className="border-b dark:border-slate-700">
                <h4 className="p-2 text-sm font-bold bg-gray-50 dark:bg-slate-900/50">{t(group.group)}</h4>
                <div className="p-2 space-y-2">
                    {group.properties.map(prop => (
                    <StyleInput
                        key={prop.prop}
                        label={prop.label}
                        prop={prop.prop}
                        type={prop.type}
                        options={(prop as any).options}
                        value={(styles as any)[prop.prop] || ''}
                        onStyleChange={handleStyleChange}
                    />
                    ))}
                </div>
                </div>
            ))}
        </div>
         <div className="flex justify-end p-4 border-t dark:border-slate-700 space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-builder-primary text-white rounded">{t('save')}</button>
        </div>
      </div>
    </div>
  );
}