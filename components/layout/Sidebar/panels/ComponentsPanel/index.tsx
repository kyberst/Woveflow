import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import ComponentItem from './ComponentItem';
import { useTranslation } from 'react-i18next';
import { BuilderComponent } from '../../../../../types';
import { useEditor } from '../../../../../hooks/useEditor';
import { getSystemComponents } from '../../../../../services/componentRegistry';

interface Props {
    onItemClick?: (component: BuilderComponent) => void;
}

const GROUPS = [
    { id: 'structure', label: 'Structure' },
    { id: 'basic', label: 'Components' },
    { id: 'widget', label: 'Widgets' },
    { id: 'section', label: 'Sections' },
];

export default function ComponentsPanel({ onItemClick }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'system' | 'custom'>('system');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        structure: true, basic: true, widget: true, section: true
    });
    
    const { state } = useEditor();
    const { t } = useTranslation();

    // Use the Registry for system components
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

    return (
        <div className="h-full flex flex-col bg-white dark:bg-builder-dark">
            <div className="flex border-b border-gray-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('system')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'system' ? 'text-builder-primary border-b-2 border-builder-primary' : 'text-slate-500'}`}
                >
                    System
                </button>
                <button 
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'custom' ? 'text-builder-primary border-b-2 border-builder-primary' : 'text-slate-500'}`}
                >
                    My Components
                </button>
            </div>

            <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder={t('searchComponents')}
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-gray-100 dark:bg-slate-800 rounded border-none focus:ring-1 focus:ring-builder-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-2">
                {activeTab === 'custom' && (
                    <div className="grid grid-cols-3 gap-2">
                        {filteredComponents.map(comp => (
                            <ComponentItem key={comp.id} component={comp} onClick={onItemClick} />
                        ))}
                         {filteredComponents.length === 0 && <div className="col-span-3 text-center text-xs text-slate-400 py-4">No custom components found.</div>}
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="space-y-1">
                        {GROUPS.map(group => {
                            const groupItems = filteredComponents.filter(c => c.category === group.id);
                            if (groupItems.length === 0 && searchTerm) return null;

                            return (
                                <div key={group.id} className="border-b border-gray-50 dark:border-slate-800/50 pb-2 last:border-0">
                                    <button 
                                        onClick={() => toggleGroup(group.id)}
                                        className="w-full flex items-center py-2 px-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded transition-colors"
                                    >
                                        {expandedGroups[group.id] ? <ChevronDown size={14} className="mr-1"/> : <ChevronRight size={14} className="mr-1"/>}
                                        {t(group.id) || group.label}
                                    </button>
                                    
                                    {expandedGroups[group.id] && (
                                        <div className="grid grid-cols-3 gap-2 px-1 mt-1">
                                            {groupItems.map(comp => (
                                                <ComponentItem key={comp.id} component={comp} onClick={onItemClick} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}