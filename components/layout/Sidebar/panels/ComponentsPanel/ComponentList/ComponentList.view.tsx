import React from 'react';
import { BuilderComponent } from '../../../../../../types';
import ComponentItem from '../ComponentItem';
import { useTranslation } from 'react-i18next';
import { COMPONENT_CATEGORIES } from '../../../../../../constants/componentCategories';

interface ComponentListViewProps {
    components: BuilderComponent[];
    onItemClick?: (component: BuilderComponent) => void;
}

export default function ComponentListView({ components, onItemClick }: ComponentListViewProps) {
    const { t } = useTranslation();

    return (
        <div className="flex-grow overflow-y-auto space-y-6 p-4">
            {COMPONENT_CATEGORIES.map(cat => {
                const filteredComponents = components.filter(c => c.category === cat);
                if (filteredComponents.length === 0) return null;

                return (
                    <div key={cat}>
                        <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">{t(cat)}</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {filteredComponents.map(comp => <ComponentItem key={comp.id} component={comp} onClick={onItemClick} />)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}