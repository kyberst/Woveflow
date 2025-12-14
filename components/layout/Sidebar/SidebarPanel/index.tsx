import React from 'react';
import SidebarPanelView from './SidebarPanel.view';
import { useSidebarPanel } from './useSidebarPanel.hook';

export default function SidebarPanel() {
    const { activeTab, handleCloseSidebarPanel } = useSidebarPanel();

    return (
        <SidebarPanelView
            activeTab={activeTab}
            handleCloseSidebarPanel={handleCloseSidebarPanel}
        />
    );
}