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
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                    <Layers size={16} className="mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('layers')}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center" title="Hierarchical View">
                    <Network size={12} className="mr-1" /> Tree
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto py-2 custom-scrollbar">
                {currentPage.content.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs italic flex flex-col items-center">
                        <Layers size={24} className="mb-2 opacity-50" />
                        <span>No elements on this page.</span>
                        <span className="text-[10px] mt-1">Drag components from the "Add" panel.</span>
                    </div>
                ) : (
                    <div className="px-2 pb-10">
                         {currentPage.content.map((node, index) => (
                            <LayerItem 
                                key={typeof node === 'string' ? index : node.id} 
                                node={node} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}