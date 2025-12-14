import React, { useMemo } from 'react';
import { useEditor } from '../../../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Grid3x3, LayoutTemplate, Columns, ArrowRightLeft } from 'lucide-react';
import { findParent } from '../../../../../../utils/tree';
import { BuilderElementNode, ViewMode } from '../../../../../../types';

interface Props {
    node: BuilderElementNode;
    viewMode: ViewMode;
}

export default function GridSettings({ node, viewMode }: Props) {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    // Helper to get style value for current view mode
    const getStyle = (n: BuilderElementNode, prop: string) => {
        const styles = n.styles[viewMode] || {};
        return (styles as any)[prop] || n.styles.desktop[prop as any] || '';
    };

    const updateStyle = (elementId: string, prop: string, value: string) => {
        dispatch({
            type: 'UPDATE_ELEMENT_STYLE',
            payload: { elementId, property: prop, value, viewMode }
        });
        dispatch({ type: 'ADD_HISTORY' });
    };

    // 1. Check if current node is a Grid Container
    const isGridContainer = getStyle(node, 'display') === 'grid';

    // 2. Check if current node is a Grid Child
    const parent = useMemo(() => {
        const currentPage = state.pages.find(p => p.id === state.currentPageId);
        return currentPage ? findParent(currentPage.content, node.id) : null;
    }, [state.currentPageId, state.pages, node.id]);

    const isGridChild = parent && (getStyle(parent, 'display') === 'grid');

    if (!isGridContainer && !isGridChild) return null;

    return (
        <div className="border-b border-gray-100 dark:border-slate-800 p-4 bg-indigo-50/50 dark:bg-indigo-900/10">
            {isGridContainer && (
                <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center">
                        <Grid3x3 size={12} className="mr-1.5" /> Grid Layout
                    </h4>
                    <div className="space-y-2">
                        {/* Presets */}
                        <div className="grid grid-cols-4 gap-1">
                            <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', '1fr 1fr')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex justify-center"
                                title="2 Columns"
                            >
                                <div className="flex gap-0.5 h-3"><div className="w-1.5 bg-indigo-300 rounded-sm" /><div className="w-1.5 bg-indigo-300 rounded-sm" /></div>
                            </button>
                            <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', '1fr 1fr 1fr')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex justify-center"
                                title="3 Columns"
                            >
                                <div className="flex gap-0.5 h-3"><div className="w-1.5 bg-indigo-300 rounded-sm" /><div className="w-1.5 bg-indigo-300 rounded-sm" /><div className="w-1.5 bg-indigo-300 rounded-sm" /></div>
                            </button>
                            <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', 'repeat(4, 1fr)')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex justify-center"
                                title="4 Columns"
                            >
                                <div className="flex gap-0.5 h-3"><div className="w-1 bg-indigo-300 rounded-sm" /><div className="w-1 bg-indigo-300 rounded-sm" /><div className="w-1 bg-indigo-300 rounded-sm" /><div className="w-1 bg-indigo-300 rounded-sm" /></div>
                            </button>
                             <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', 'repeat(12, 1fr)')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex items-center justify-center text-[8px] font-bold text-indigo-500"
                                title="12 Columns (System)"
                            >
                                12
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', '2fr 1fr')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex justify-center"
                                title="2/3 + 1/3"
                            >
                                <div className="flex gap-0.5 h-3"><div className="w-4 bg-indigo-300 rounded-sm" /><div className="w-2 bg-indigo-300 rounded-sm" /></div>
                            </button>
                            <button 
                                onClick={() => updateStyle(node.id, 'gridTemplateColumns', '1fr 2fr')}
                                className="p-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-600 rounded hover:border-indigo-500 flex justify-center"
                                title="1/3 + 2/3"
                            >
                                <div className="flex gap-0.5 h-3"><div className="w-2 bg-indigo-300 rounded-sm" /><div className="w-4 bg-indigo-300 rounded-sm" /></div>
                            </button>
                        </div>
                        
                        {/* Gap */}
                        <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold w-8">Gap</label>
                            <input 
                                type="text" 
                                value={getStyle(node, 'gap')} 
                                onChange={(e) => updateStyle(node.id, 'gap', e.target.value)}
                                className="flex-1 text-xs p-1 border rounded dark:bg-slate-800 dark:border-slate-600"
                                placeholder="e.g. 1rem"
                            />
                        </div>
                         {/* Manual Template */}
                         <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold w-8">Tpl</label>
                            <input 
                                type="text" 
                                value={getStyle(node, 'gridTemplateColumns')} 
                                onChange={(e) => updateStyle(node.id, 'gridTemplateColumns', e.target.value)}
                                className="flex-1 text-xs p-1 border rounded dark:bg-slate-800 dark:border-slate-600"
                                placeholder="e.g. 1fr 200px"
                            />
                        </div>
                    </div>
                </div>
            )}

            {isGridChild && (
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center">
                        <LayoutTemplate size={12} className="mr-1.5" /> Grid Placement
                    </h4>
                    <div className="space-y-2">
                        {/* Column Span */}
                        <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold w-8">Span</label>
                            <div className="flex-1 grid grid-cols-4 gap-1">
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 1')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">1</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 2')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">2</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 3')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">3</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 4')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">4</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 6')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">6</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', 'span 12')} className="px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">12</button>
                                <button onClick={() => updateStyle(node.id, 'gridColumn', '1 / -1')} className="col-span-2 px-1 py-1 text-[10px] bg-white dark:bg-slate-800 border rounded hover:bg-indigo-50">Full Row</button>
                            </div>
                        </div>
                        {/* Manual Grid Column */}
                         <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold w-8"><Columns size={10} /></label>
                            <input 
                                type="text" 
                                value={getStyle(node, 'gridColumn')} 
                                onChange={(e) => updateStyle(node.id, 'gridColumn', e.target.value)}
                                className="flex-1 text-xs p-1 border rounded dark:bg-slate-800 dark:border-slate-600"
                                placeholder="e.g. 2 / span 6"
                            />
                        </div>
                         {/* Manual Grid Row */}
                         <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold w-8"><ArrowRightLeft size={10} className="rotate-90" /></label>
                            <input 
                                type="text" 
                                value={getStyle(node, 'gridRow')} 
                                onChange={(e) => updateStyle(node.id, 'gridRow', e.target.value)}
                                className="flex-1 text-xs p-1 border rounded dark:bg-slate-800 dark:border-slate-600"
                                placeholder="grid-row"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}