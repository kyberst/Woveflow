import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { File, Layout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../../hooks/useEditor';
import { CommandItem } from './types';
import { getStaticActions } from './actions';

export const useCommandSearch = (isOpen: boolean) => {
    const { state, dispatch } = useEditor();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const allCommands = useMemo(() => {
        const commands: CommandItem[] = [];
        
        // 1. Pages
        const currentSiteRecord = state.sites.find(s => s.name === state.currentSite);
        if (currentSiteRecord) {
            state.pages.filter(p => p.site === currentSiteRecord.id).forEach(page => {
                commands.push({
                    id: `page-${page.id}`,
                    type: 'page',
                    label: page.name,
                    description: page.type === 'system' ? 'System Page' : 'User Page',
                    icon: File,
                    action: () => navigate(`/editor/${state.currentSite}/${page.id}`)
                });
            });
        }

        // 2. Components
        state.components.forEach(comp => {
            commands.push({
                id: `comp-${comp.id}`,
                type: 'component',
                label: comp.name,
                description: t(comp.category),
                icon: Layout,
                action: () => {
                    const payload = { 
                        targetId: state.selectedElementId || null, 
                        mode: state.selectedElementId ? 'after' : 'inside', 
                        element: JSON.parse(JSON.stringify(comp.content)) 
                    };
                    dispatch({ type: 'ADD_ELEMENT', payload: payload as any }); // Cast due to strict payload typing
                    dispatch({ type: 'ADD_HISTORY' });
                }
            });
        });

        // 3. Actions
        commands.push(...getStaticActions(state, dispatch, t));

        return commands;
    }, [state, dispatch, navigate, t]);

    const filteredCommands = useMemo(() => {
        if (!query) return allCommands.slice(0, 10);
        const lowerQuery = query.toLowerCase();
        return allCommands.filter(cmd => 
            cmd.label.toLowerCase().includes(lowerQuery) ||
            cmd.description?.toLowerCase().includes(lowerQuery) ||
            cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
        );
    }, [query, allCommands]);

    // Reset query on close
    useEffect(() => {
        if (!isOpen) setQuery('');
    }, [isOpen]);

    return { query, setQuery, filteredCommands };
};