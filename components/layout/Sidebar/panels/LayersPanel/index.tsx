import React from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import LayerItem from './LayerItem';
import { Layers, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LayersPanel() {
    const { state } = useEditor();
    const { t } = useTranslation();
    
    const currentPage = state.pages.find(p => p.id === state.currentPageId);

    if (!currentPage) return null;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-builder-dark">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                    <Layers size={16} className="mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('layers')}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center cursor-help" title="Drag to reorder. Hover for actions.">
                    <Network size={12} className="mr-1" /> Navigator
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto py-2 custom-scrollbar">
                {currentPage.content.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                            <Layers size={20} className="opacity-50" />
                        </div>
                        <span className="font-medium text-slate-500">Page is empty</span>
                        <span className="text-[10px] mt-1 text-slate-400">Add components from the "+" panel to see the tree structure.</span>
                    </div>
                ) : (
                    <div className="pb-10">
                         {currentPage.content.map((node, index) => (
                            <LayerItem 
                                key={typeof node === 'string' ? index : node.id} 
                                node={node}
                                depth={0}
                                index={index}
                                parentId={null}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}