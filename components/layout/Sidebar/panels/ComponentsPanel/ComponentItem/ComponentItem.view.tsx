import React from 'react';
import { Layout } from 'lucide-react'; // Using a generic icon for now

interface ComponentItemViewProps {
    componentName: string;
    isClickable: boolean;
    handleDragStart: (e: React.DragEvent) => void;
    handleDragEnd: () => void;
    handleClick: () => void;
}

export default function ComponentItemView({ 
    componentName, 
    isClickable, 
    handleDragStart, 
    handleDragEnd, 
    handleClick 
}: ComponentItemViewProps) {
    return (
        <div
            draggable={!isClickable}
            onDragStart={!isClickable ? handleDragStart : undefined}
            onDragEnd={!isClickable ? handleDragEnd : undefined}
            onClick={isClickable ? handleClick : undefined}
            className={`flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded hover:shadow-md transition-shadow ${isClickable ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div className="mb-1 text-slate-600 dark:text-slate-300">
                <Layout size={20} />
            </div>
            <span className="text-[10px] text-center leading-tight">{componentName}</span>
        </div>
    );
}