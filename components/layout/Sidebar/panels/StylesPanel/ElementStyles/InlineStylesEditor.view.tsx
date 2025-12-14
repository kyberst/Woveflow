import React from 'react';
import { useTranslation } from 'react-i18next';
import { STYLE_PROPERTIES } from '../../../../../../constants';
import StyleInput from '../StyleInput';
import BoxModelControl from '../BoxModelControl';
import AppliedClassesManager from '../AppliedClassesManager';
import { Smartphone, Tablet, Monitor, ArrowLeft } from 'lucide-react';
import { useInlineStyles } from './useInlineStyles.hook';
import { ViewMode } from '../../../../../../types';

export default function InlineStylesEditorView() {
  const { selectedNode, viewMode, isOverridden, getEffectiveStyle, handleStyleChange, dispatch } = useInlineStyles();
  const { t } = useTranslation();

  if (!selectedNode) return null;

  const ViewIcon = viewMode === ViewMode.Mobile ? Smartphone : viewMode === ViewMode.Tablet ? Tablet : Monitor;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-builder-dark">
      <div className="flex items-center justify-between p-3 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
           <div className="flex items-center">
               <button onClick={() => dispatch({ type: 'SET_SELECTED_ELEMENT', payload: null })} className="mr-2 text-slate-400 hover:text-slate-600">
                   <ArrowLeft size={14} />
               </button>
               <div>
                   <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase truncate max-w-[120px]">
                       {selectedNode.tag} <span className="opacity-50">#{selectedNode.id.split('-').pop()}</span>
                   </h3>
                   <div className={`flex items-center text-[10px] mt-0.5 ${viewMode === ViewMode.Desktop ? 'text-slate-500' : 'text-blue-600 font-semibold'}`}>
                       <ViewIcon size={10} className="mr-1" />
                       Editing {viewMode === ViewMode.Desktop ? 'Base (Desktop)' : `${viewMode} Override`}
                   </div>
               </div>
           </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
          <BoxModelControl />
          <AppliedClassesManager />
          {STYLE_PROPERTIES.map(group => (
            <div key={group.group} className="border-b border-gray-100 dark:border-slate-800">
              <details className="group" open={['Layout', 'Flex & Grid Parent', 'Spacing'].includes(group.group)}>
                  <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 select-none">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t(group.group)}</span>
                  </summary>
                  <div className="p-3 pt-0 space-y-2">
                    {group.properties.map(p => (
                      <StyleInput 
                        key={p.prop} label={p.label} prop={p.prop} type={p.type} 
                        options={(p as any).options} value={getEffectiveStyle(p.prop as any) as string} 
                        onStyleChange={handleStyleChange} isOverridden={isOverridden(p.prop as any)} 
                      />
                    ))}
                  </div>
              </details>
            </div>
          ))}
          <div className="p-8"></div>
      </div>
    </div>
  );
}