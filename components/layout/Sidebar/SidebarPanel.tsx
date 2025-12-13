import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import PagesPanel from './panels/PagesPanel';
import ComponentsPanel from './panels/ComponentsPanel';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function SidebarPanel() {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();

    const renderContent = () => {
        switch (state.activeTab) {
            case 'pages':
                return <PagesPanel />;
            case 'components':
                return <ComponentsPanel />;
            case 'layers':
                return <div className="p-4">Navigation Tree (Coming Soon)</div>;
            case 'styles':
                return <div className="p-4">Style Editor (Coming Soon)</div>;
            case 'code':
                return <div className="p-4">Code Editor (Coming Soon)</div>;
            default:
                return null;
        }
    };

    if (!state.activeTab) return null;

    return (
        <div className="w-72 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 h-full overflow-hidden flex flex-col shadow-xl builder-sidebar-panel">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                <h3 className="font-bold text-lg capitalize">{t(state.activeTab)}</h3>
                <button 
                    onClick={() => dispatch({ type: 'CLOSE_SIDEBAR_PANEL' })}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                    <X size={20} />
                </button>
            </div>
            {renderContent()}
        </div>
    );
}