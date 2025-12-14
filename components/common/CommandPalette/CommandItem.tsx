import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CommandItem as CommandItemType } from './types';

interface Props {
    item: CommandItemType;
    isActive: boolean;
    onClick: () => void;
}

export default function CommandItem({ item, isActive, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                isActive 
                    ? 'bg-builder-primary text-white' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
        >
            <div className={`p-2 rounded-lg mr-4 ${
                isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'
            }`}>
                <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            </div>
            <div className="flex-grow">
                <div className="font-medium text-sm">{item.label}</div>
                {item.description && (
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.description}
                    </div>
                )}
            </div>
            {isActive && (
                <ArrowRight size={16} className="ml-2 animate-pulse" />
            )}
        </button>
    );
}