import React from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Palette, Type, Layers, Globe } from 'lucide-react';
import GlobalColorManager from './GlobalColorManager';
import GlobalTypographyManager from './GlobalTypographyManager';
import DesignTokensManager from './DesignTokensManager';
import InlineStylesEditor from './InlineStylesEditor';

export default function StylesPanel() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();

  // If an element is selected, show the Element Styles Editor (Responsive)
  if (state.selectedElementId) {
      return <InlineStylesEditor />;
  }

  // Otherwise, show Global Styles / Design Tokens
  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white dark:bg-builder-dark">
      <div className="p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <div className="flex items-center text-slate-600 dark:text-slate-300 mb-1">
              <Globe size={16} className="mr-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider">{t('globalClasses')} & Tokens</h3>
          </div>
          <p className="text-[10px] text-slate-400">Select an element on the canvas to edit its specific styles.</p>
      </div>

      {/* Colors Section */}
      <div className="border-b dark:border-slate-700">
        <div className="p-4 bg-white dark:bg-builder-dark flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
             <div className="flex items-center">
                <Palette size={16} className="text-slate-500 mr-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('colors')}</h4>
             </div>
        </div>
        <GlobalColorManager />
      </div>

      {/* Typography Section */}
      <div className="border-b dark:border-slate-700">
        <div className="p-4 bg-white dark:bg-builder-dark flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center">
                <Type size={16} className="text-slate-500 mr-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('Typography')}</h4>
            </div>
        </div>
        <GlobalTypographyManager />
      </div>

      {/* Tokens Section */}
      <div className="border-b dark:border-slate-700">
        <div className="p-4 bg-white dark:bg-builder-dark flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center">
                <Layers size={16} className="text-slate-500 mr-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('designTokens')}</h4>
            </div>
        </div>
        <DesignTokensManager />
      </div>
    </div>
  );
}