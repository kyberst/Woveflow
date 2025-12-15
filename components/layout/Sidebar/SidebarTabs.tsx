import React from 'react';
import SidebarTabsView from './SidebarTabs/SidebarTabs.view';
import { useSidebarTabs } from './SidebarTabs/useSidebarTabs.hook';

export default function SidebarTabs() {
    const { activeTab, showBottomPanel, handleTabClick } = useSidebarTabs();

    return (
        <SidebarTabsView
            activeTab={activeTab}
            showBottomPanel={showBottomPanel}
            handleTabClick={handleTabClick}
        />
    );
}