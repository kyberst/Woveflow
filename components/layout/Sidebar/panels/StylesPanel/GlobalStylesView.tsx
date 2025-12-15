import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import GlobalColorManager from './GlobalColorManager';
import GlobalTypographyManager from './GlobalTypographyManager';
import DesignTokensManager from './DesignTokensManager';
import GlobalClassManager from './GlobalClassManager';

export default function GlobalStylesView() {
    const { t } = useTranslation();

    return (
        <div className="h-full flex flex-col overflow-y-auto bg-white dark:bg-builder-dark">
            <div className="p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center text-slate-600 dark:text-slate-300 mb-1">
                    <Globe size={16} className="mr-2" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">{t('globalClasses')} & Tokens</h3>
                </div>
                <p className="text-[10px] text-slate-400">Select an element on the canvas to edit its specific styles.</p>
            </div>
            
            <GlobalClassManager />
            <DesignTokensManager />
        </div>
    );
}