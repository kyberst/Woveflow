import { useState, useMemo } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { getSystemComponents } from '../../../../../services/componentRegistry';

export const useComponentsPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'system' | 'custom'>('system');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        structure: true, basic: true, widget: true, section: true
    });
    
    const { state } = useEditor();

    const allComponents = useMemo(() => {
        const systemComponents = getSystemComponents();
        const customComponents = state.components.filter(c => c.category === 'custom');
        return [...systemComponents, ...customComponents];
    }, [state.components]);

    const filteredComponents = useMemo(() => {
        let items = allComponents;
        
        if (activeTab === 'system') {
            items = items.filter(c => c.category !== 'custom');
        } else {
            items = items.filter(c => c.category === 'custom');
        }

        if (searchTerm) {
            items = items.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return items;
    }, [searchTerm, activeTab, allComponents]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        expandedGroups,
        toggleGroup,
        filteredComponents,
    };
};
