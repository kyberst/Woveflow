import React from 'react';
import PagesPanel from '../panels/PagesPanel';
import ComponentsPanel from '../panels/ComponentsPanel';
import StylesPanel from '../panels/StylesPanel';
import LayersPanel from '../panels/LayersPanel';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface SidebarPanelViewProps {
    activeTab: string | null;
    handleCloseSidebarPanel: () => void;
}

export default function SidebarPanelView({ activeTab, handleCloseSidebarPanel }: SidebarPanelViewProps) {
    const { t } = useTranslation();

    const renderContent = () => {
        switch (activeTab) {
            case 'pages':
                return <PagesPanel />;
            case 'components':
                return <ComponentsPanel />;
            case 'layers':
                return <LayersPanel />;
            case 'styles':
                return <StylesPanel />;
            case 'code':
                return <div className="p-6 text-sm text-slate-500">Code Editor (Coming Soon)</div>;
            default:
                return null;
        }
    };

    if (!activeTab) return null;

    return (
        <div className="w-80 max-w-[calc(100vw-4rem)] bg-white dark:bg-builder-dark border-r border-builder-border dark:border-builder-darkBorder h-full overflow-hidden flex flex-col builder-sidebar-panel animate-in slide-in-from-left-2 duration-200 shadow-xl z-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-builder-border dark:border-builder-darkBorder bg-gray-50/50 dark:bg-slate-900/20">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">{t(activeTab)}</h3>
                <button 
                    onClick={handleCloseSidebarPanel}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
            {renderContent()}
        </div>
    );
}