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

    const handleTabClick = (tabId: string | null) => {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
    };

    return (
        <div className="w-16 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col items-center py-4 space-y-4">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(state.activeTab === tab.id ? null : tab.id)}
                    className={`p-3 rounded-xl transition-colors ${state.activeTab === tab.id ? 'bg-blue-100 text-blue-600 dark:bg-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                    title={t(tab.id)}
                >
                    <tab.icon size={24} />
                </button>
            ))}
        </div>
    );
}