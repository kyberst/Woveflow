import { Zap } from 'lucide-react';
import { CommandItem } from './types';
import { EditorState, Action } from '../../../types';
import { Dispatch } from 'react';

export const getStaticActions = (
    state: EditorState, 
    dispatch: Dispatch<Action>, 
    t: (key: string) => string
): CommandItem[] => [
    {
        id: 'undo',
        type: 'action',
        label: t('undo'),
        icon: Zap,
        action: () => { dispatch({ type: 'UNDO' }); },
        keywords: ['undo', 'back', 'z']
    },
    {
        id: 'redo',
        type: 'action',
        label: t('redo'),
        icon: Zap,
        action: () => { dispatch({ type: 'REDO' }); },
        keywords: ['redo', 'forward', 'y']
    },
    {
        id: 'preview',
        type: 'action',
        label: state.isPreviewing ? t('exitPreview') : t('preview'),
        icon: Zap,
        action: () => { dispatch({ type: 'TOGGLE_PREVIEW' }); },
        keywords: ['preview', 'view', 'play']
    },
    {
        id: 'theme',
        type: 'action',
        label: 'Toggle Dark/Light Mode',
        icon: Zap,
        action: () => { dispatch({ type: 'TOGGLE_THEME' }); },
        keywords: ['theme', 'dark', 'light', 'mode']
    },
    {
        id: 'zoom-in',
        type: 'action',
        label: 'Zoom In',
        icon: Zap,
        action: () => { dispatch({ type: 'SET_ZOOM', payload: Math.min(150, state.zoom + 25) }); },
        keywords: ['zoom', 'magnify', 'bigger']
    },
    {
        id: 'zoom-out',
        type: 'action',
        label: 'Zoom Out',
        icon: Zap,
        action: () => { dispatch({ type: 'SET_ZOOM', payload: Math.max(25, state.zoom - 25) }); },
        keywords: ['zoom', 'shrink', 'smaller']
    },
    {
        id: 'export',
        type: 'action',
        label: t('publish'),
        icon: Zap,
        action: () => { alert(t('publishing')); },
        keywords: ['publish', 'export', 'save', 'download']
    }
];