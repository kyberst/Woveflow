import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSwitcherViewProps {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
}

export default function LanguageSwitcherView({
  currentLanguage,
  changeLanguage,
}: LanguageSwitcherViewProps) {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1 text-sm">
        <Globe size={16} className="text-slate-500 mx-1" />
        <button 
            onClick={() => changeLanguage('en')}
            className={`px-2 py-1 rounded ${currentLanguage === 'en' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
        >
            EN
        </button>
        <button 
            onClick={() => changeLanguage('es')}
            className={`px-2 py-1 rounded ${currentLanguage === 'es' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
        >
            ES
        </button>
    </div>
  );
}