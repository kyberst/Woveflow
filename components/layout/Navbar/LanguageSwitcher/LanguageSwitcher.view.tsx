import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSwitcherViewProps {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  wrapperRef: React.RefObject<HTMLDivElement>;
}

export default function LanguageSwitcherView({
  currentLanguage,
  changeLanguage,
  isOpen,
  toggleOpen,
  wrapperRef
}: LanguageSwitcherViewProps) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <div ref={wrapperRef} className="relative">
        <button 
            onClick={toggleOpen}
            className="flex items-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Change language"
            aria-haspopup="true"
            aria-expanded={isOpen}
        >
            <Globe size={18} />
        </button>

        {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-3 py-1.5 text-sm ${
                            currentLanguage === lang.code
                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        )}
    </div>
  );
}