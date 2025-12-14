import React, { useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { BuilderElementNode } from '../../../../../types';
import ScrubbableInput from '../../../../common/ScrubbableInput';

const findNodeById = (nodes: (BuilderElementNode | string)[], id: string): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        if (node.id === id) return node;
        const found = findNodeById(node.children, id);
        if (found) return found;
    }
    return null;
};

export default function BoxModelControl() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();

  const selectedNode = useMemo(() => {
    if (!state.selectedElementId) return null;
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return null;
    return findNodeById(currentPage.content, state.selectedElementId);
  }, [state.selectedElementId, state.pages, state.currentPageId]);

  const getStyle = (propName: keyof React.CSSProperties) => {
    if (!selectedNode) return '';
    const mobileStyle = selectedNode.styles.mobile?.[propName];
    const tabletStyle = selectedNode.styles.tablet?.[propName];
    const desktopStyle = selectedNode.styles.desktop?.[propName];
    if (state.viewMode === 'mobile' && mobileStyle !== undefined) return mobileStyle;
    if ((state.viewMode === 'mobile' || state.viewMode === 'tablet') && tabletStyle !== undefined) return tabletStyle;
    return desktopStyle ?? '';
  };

  const updateStyle = (prop: string, value: string) => {
    if (state.selectedElementId) {
      dispatch({ 
          type: 'UPDATE_ELEMENT_STYLE', 
          payload: { 
              elementId: state.selectedElementId, 
              property: prop, 
              value: value,
              viewMode: state.viewMode
            } 
        });
    }
  };

  if (!selectedNode) return null;

  // Render a side input (e.g., Margin Top)
  const SideInput = ({ prop, placeholder }: { prop: string, placeholder?: string }) => (
    <div className="flex justify-center items-center w-8 h-6 hover:bg-black/10 dark:hover:bg-white/10 rounded">
        <ScrubbableInput 
            value={getStyle(prop as any) as string || ''} 
            onChange={(val) => updateStyle(prop, val)}
            placeholder={placeholder || '-'}
        />
    </div>
  );

  return (
    <div className="p-4 border-b dark:border-slate-700 bg-white dark:bg-slate-900 select-none">
        <div className="text-xs font-bold mb-3 text-slate-500 uppercase tracking-wider">{t('boxModel')}</div>
        
        <div className="relative flex justify-center items-center py-2 text-[10px] font-mono leading-none">
            
            {/* MARGIN BOX */}
            <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 p-8 rounded relative shadow-sm">
                <span className="absolute top-1 left-2 text-orange-600 dark:text-orange-400 text-[8px]">MARGIN</span>
                
                {/* Margin Controls */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2"><SideInput prop="marginTop" /></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2"><SideInput prop="marginBottom" /></div>
                <div className="absolute left-1 top-1/2 -translate-y-1/2"><SideInput prop="marginLeft" /></div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2"><SideInput prop="marginRight" /></div>

                {/* BORDER BOX */}
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-8 rounded relative">
                     <span className="absolute top-1 left-2 text-yellow-600 dark:text-yellow-400 text-[8px]">BORDER</span>

                     {/* Border Width Controls - Mapping to borderTopWidth etc for simplicity, or just simple border width if uniform */}
                     <div className="absolute top-2 left-1/2 -translate-x-1/2"><SideInput prop="borderTopWidth" /></div>
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2"><SideInput prop="borderBottomWidth" /></div>
                     <div className="absolute left-1 top-1/2 -translate-y-1/2"><SideInput prop="borderLeftWidth" /></div>
                     <div className="absolute right-1 top-1/2 -translate-y-1/2"><SideInput prop="borderRightWidth" /></div>

                    {/* PADDING BOX */}
                    <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-8 rounded relative">
                        <span className="absolute top-1 left-2 text-green-600 dark:text-green-400 text-[8px]">PADDING</span>
                        
                        {/* Padding Controls */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2"><SideInput prop="paddingTop" /></div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2"><SideInput prop="paddingBottom" /></div>
                        <div className="absolute left-1 top-1/2 -translate-y-1/2"><SideInput prop="paddingLeft" /></div>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2"><SideInput prop="paddingRight" /></div>

                        {/* CONTENT BOX */}
                        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 w-24 h-12 flex items-center justify-center rounded relative">
                             <div className="flex flex-col items-center space-y-1">
                                <span className="text-blue-600 dark:text-blue-400 text-[8px] absolute top-1 left-1">CONTENT</span>
                                <div className="flex items-center space-x-1">
                                     <ScrubbableInput 
                                        className="w-8"
                                        value={getStyle('width') as string || 'auto'} 
                                        onChange={(val) => updateStyle('width', val)}
                                    />
                                    <span>x</span>
                                    <ScrubbableInput 
                                        className="w-8"
                                        value={getStyle('height') as string || 'auto'} 
                                        onChange={(val) => updateStyle('height', val)}
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}