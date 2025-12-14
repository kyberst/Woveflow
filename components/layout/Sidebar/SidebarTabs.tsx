import React from 'react';
import { Folder, Layers, Layout, Palette, Code } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

const TABS = [
    { id: 'pages', icon: Folder },
    { id: 'layers', icon: Layers },
    { id: 'components', icon: Layout },
    { id: 'styles', icon: Palette },
    { id: 'code', icon: Code },
];

export default function SidebarTabs() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    const handleTabClick = (tabId: string) => {
        if (tabId === 'code') {
            dispatch({ type: 'TOGGLE_BOTTOM_PANEL', payload: !state.showBottomPanel });
            dispatch({ type: 'SET_BOTTOM_TAB', payload: 'code' });
        } else {
            const isActive = state.activeTab === tabId;
            dispatch({ type: 'SET_ACTIVE_TAB', payload: isActive ? null : tabId });
        }
    };

    return (
        <div className="w-16 bg-builder-darker text-slate-400 border-r border-slate-800 flex flex-col items-center py-6 space-y-2 z-10">
            {TABS.map(tab => {
                const isActive = tab.id === 'code' ? state.showBottomPanel : state.activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`group relative p-3 rounded-xl transition-all duration-200 ${
                            isActive 
                                ? 'bg-builder-primary text-white shadow-lg shadow-builder-primary/30' 
                                : 'hover:bg-white/10 hover:text-white'
                        }`}
                        title={t(tab.id)}
                    >
                        <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </button>
                );
            })}
        </div>
    );
}