import { ElementType } from 'react';

export type CommandType = 'page' | 'action' | 'component';

export interface CommandItem {
    id: string;
    type: CommandType;
    label: string;
    description?: string;
    icon: ElementType;
    action: () => void;
    keywords?: string[];
}