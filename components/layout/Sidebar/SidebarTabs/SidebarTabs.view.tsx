import React from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_TABS } from '../../../../constants/sidebarTabs'; // Use new constant location

interface SidebarTabsViewProps {
    activeTab: string | null;
    showBottomPanel: boolean;
    handleTabClick: (tabId: string) => void;
}

export default function SidebarTabsView({ activeTab, showBottomPanel, handleTabClick }: SidebarTabsViewProps) {
    const { t } = useTranslation();

    return (
        <div className="w-16 bg-builder-darker text-slate-400 border-r border-slate-800 flex flex-col items-center py-6 space-y-2 z-10">
            {SIDEBAR_TABS.map(tab => {
                const isActive = tab.id === 'code' ? showBottomPanel : activeTab === tab.id;
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