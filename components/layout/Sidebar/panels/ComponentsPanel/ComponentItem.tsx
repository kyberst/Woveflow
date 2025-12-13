import React from 'react';
import { Layout } from 'lucide-react'; // Using a generic icon for now
import { BuilderComponent } from '../../../../../types';

interface Props {
    component: BuilderComponent;
    onClick?: (component: BuilderComponent) => void;
}

export default function ComponentItem({ component, onClick }: Props) {
    const isClickable = !!onClick;

    const handleDragStart = (e: React.DragEvent, component: BuilderComponent) => {
        e.dataTransfer.setData('application/json', JSON.stringify(component));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable={!isClickable}
            onDragStart={!isClickable ? (e) => handleDragStart(e, component) : undefined}
            onClick={isClickable ? () => onClick(component) : undefined}
            className={`flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded hover:shadow-md transition-shadow ${isClickable ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div className="mb-1 text-slate-600 dark:text-slate-300">
                <Layout size={20} />
            </div>
            <span className="text-[10px] text-center leading-tight">{component.name}</span>
        </div>
    );
}