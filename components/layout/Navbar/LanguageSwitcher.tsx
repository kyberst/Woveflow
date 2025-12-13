import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1 text-sm">
        <Globe size={16} className="text-slate-500 mx-1" />
        <button 
            onClick={() => changeLanguage('en')}
            className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
        >
            EN
        </button>
        <button 
            onClick={() => changeLanguage('es')}
            className={`px-2 py-1 rounded ${i18n.language === 'es' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
        >
            ES
        </button>
    </div>
  );
}