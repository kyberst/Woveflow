import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AVAILABLE_COMPONENTS } from '../../../../../constants';
import ComponentList from './ComponentList';
import { useTranslation } from 'react-i18next';
import { BuilderComponent } from '../../../../../types';

interface Props {
    onItemClick?: (component: BuilderComponent) => void;
}

export default function ComponentsPanel({ onItemClick }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [customComponents, setCustomComponents] = useState<BuilderComponent[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        try {
            const stored = localStorage.getItem('mis componentes');
            if (stored) {
                const parsed = JSON.parse(stored);
                const mapped: BuilderComponent[] = parsed.map((item: any, index: number) => ({
                    id: `custom-${index}-${Date.now()}`,
                    name: item.name,
                    category: 'custom',
                    html: item.content,
                    icon: 'star'
                }));
                setCustomComponents(mapped);
            }
        } catch(e) {
            console.error("Failed to load custom components", e);
        }
    }, []);

    const allComponents = useMemo(() => {
        return [...customComponents, ...AVAILABLE_COMPONENTS];
    }, [customComponents]);

    const filteredComponents = useMemo(() => {
        if (!searchTerm) return allComponents;
        return allComponents.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allComponents]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b dark:border-slate-700">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder={t('searchComponents')}
                        className="w-full pl-8 pr-2 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ComponentList components={filteredComponents} onItemClick={onItemClick} />
        </div>
    );
}