import React, { useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { STYLE_PROPERTIES } from '../../../../../constants';
import StyleInput from './StyleInput';
import { BuilderElementNode, ViewMode } from '../../../../../types';
import BoxModelControl from './BoxModelControl';
import AppliedClassesManager from './AppliedClassesManager';
import { Smartphone, Tablet, Monitor, ArrowLeft } from 'lucide-react';

const findNodeById = (nodes: (BuilderElementNode | string)[], id: string): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        if (node.id === id) return node;
        const found = findNodeById(node.children, id);
        if (found) return found;
    }
    return null;
};

export default function InlineStylesEditor() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();

  const selectedNode = useMemo(() => {
    if (!state.selectedElementId) return null;
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    return currentPage ? findNodeById(currentPage.content, state.selectedElementId) : null;
  }, [state.selectedElementId, state.pages, state.currentPageId]);

  // Check if a specific property is set for the CURRENT view mode
  const isOverridden = (prop: keyof React.CSSProperties) => {
      if (!selectedNode) return false;
      const styles = state.viewMode === ViewMode.Mobile ? selectedNode.styles.mobile 
                   : state.viewMode === ViewMode.Tablet ? selectedNode.styles.tablet 
                   : selectedNode.styles.desktop;
      return styles && (styles as any)[prop] !== undefined;
  };

  // Get the effective style based on cascade (Desktop -> Tablet -> Mobile)
  const getEffectiveStyle = (prop: keyof React.CSSProperties) => {
    if (!selectedNode) return '';
    const { mobile, tablet, desktop } = selectedNode.styles;
    
    // Cascade logic
    if (state.viewMode === ViewMode.Mobile) {
        if (mobile && (mobile as any)[prop] !== undefined) return (mobile as any)[prop];
        if (tablet && (tablet as any)[prop] !== undefined) return (tablet as any)[prop];
        return (desktop as any)[prop] ?? '';
    }
    if (state.viewMode === ViewMode.Tablet) {
        if (tablet && (tablet as any)[prop] !== undefined) return (tablet as any)[prop];
        return (desktop as any)[prop] ?? '';
    }
    return (desktop as any)[prop] ?? '';
  };

  const handleChange = (prop: string, value: string) => {
    if (state.selectedElementId) {
        dispatch({ 
            type: 'UPDATE_ELEMENT_STYLE', 
            payload: { 
                elementId: state.selectedElementId, 
                property: prop, 
                value, 
                viewMode: state.viewMode 
            } 
        });
        dispatch({ type: 'ADD_HISTORY' });
    }
  };

  if (!selectedNode) return null;

  const ViewIcon = state.viewMode === ViewMode.Mobile ? Smartphone 
                 : state.viewMode === ViewMode.Tablet ? Tablet 
                 : Monitor;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-builder-dark">
      {/* Header with ViewMode Indicator */}
      <div className="flex items-center justify-between p-3 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
           <div className="flex items-center">
               <button 
                  onClick={() => dispatch({ type: 'SET_SELECTED_ELEMENT', payload: null })}
                  className="mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
               >
                   <ArrowLeft size={14} />
               </button>
               <div>
                   <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase truncate max-w-[120px]">
                       {selectedNode.tag} <span className="opacity-50">#{selectedNode.id.split('-').pop()}</span>
                   </h3>
                   <div className={`flex items-center text-[10px] mt-0.5 ${
                       state.viewMode === ViewMode.Desktop ? 'text-slate-500' : 'text-blue-600 font-semibold'
                   }`}>
                       <ViewIcon size={10} className="mr-1" />
                       Editing {state.viewMode === ViewMode.Desktop ? 'Base (Desktop)' : `${state.viewMode} Override`}
                   </div>
               </div>
           </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
          {/* Box Model Visualization */}
          <BoxModelControl />

          {/* Classes Input */}
          <AppliedClassesManager />

          {/* Style Properties Groups */}
          {STYLE_PROPERTIES.map(group => (
            <div key={group.group} className="border-b border-gray-100 dark:border-slate-800">
              <details className="group" open={['Layout', 'Flex & Grid Parent', 'Spacing'].includes(group.group)}>
                  <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 select-none">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t(group.group)}</span>
                  </summary>
                  <div className="p-3 pt-0 space-y-2">
                    {group.properties.map(p => (
                      <StyleInput 
                        key={p.prop} 
                        label={p.label} 
                        prop={p.prop} 
                        type={p.type} 
                        options={(p as any).options} 
                        value={getEffectiveStyle(p.prop as any) as string} 
                        onStyleChange={handleChange} 
                        isOverridden={isOverridden(p.prop as any)} 
                      />
                    ))}
                  </div>
              </details>
            </div>
          ))}
          
          <div className="p-8"></div> {/* Bottom Spacer */}
      </div>
    </div>
  );
}