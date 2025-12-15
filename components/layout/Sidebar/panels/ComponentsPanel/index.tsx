import React from 'react';
import { BuilderComponent } from '../../../../../types';
import ComponentsPanelView from './ComponentsPanel.view';
import { useComponentsPanel } from './useComponentsPanel.hook';

interface Props {
    onItemClick?: (component: BuilderComponent) => void;
}

export default function ComponentsPanel({ onItemClick }: Props) {
    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        expandedGroups,
        toggleGroup,
        filteredComponents,
    } = useComponentsPanel();

    return (
        <ComponentsPanelView
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            filteredComponents={filteredComponents}
            onItemClick={onItemClick}
        />
    );
}