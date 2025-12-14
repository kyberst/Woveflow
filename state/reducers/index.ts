import { EditorState, Action } from '../../types';
import { siteReducer } from './site';
import { pageReducer } from './page';
import { elementReducer } from './element';
import { historyReducer } from './history';
import { componentReducer } from './component';
import { uiReducer } from './ui';
import { contextMenuReducer } from './contextMenu';
import { clipboardReducer } from './clipboard';
import { classReducer } from './class';
import { designTokenReducer } from './designToken';

// List of action types for each domain-specific reducer
const SITE_ACTIONS: Action['type'][] = ['SET_SITE', 'UPDATE_SITE', 'SET_CURRENT_PAGE'];
const PAGE_ACTIONS: Action['type'][] = ['ADD_PAGE', 'DELETE_PAGE', 'RENAME_PAGE', 'DUPLICATE_PAGE', 'UPDATE_PAGE_CONTENT'];
const ELEMENT_ACTIONS: Action['type'][] = ['UPDATE_ELEMENT_ATTRIBUTE', 'UPDATE_ELEMENT_STYLE', 'UPDATE_ELEMENT_TEXT', 'UPDATE_ELEMENT_innerHTML', 'UPDATE_ELEMENT_CLASSES', 'ADD_ELEMENT', 'MOVE_UP', 'MOVE_DOWN', 'SELECT_PARENT', 'DELETE_ELEMENT', 'DUPLICATE_ELEMENT', 'MOVE_ELEMENT', 'SET_GRID_LAYOUT', 'UPDATE_COLUMN_SPAN'];
const HISTORY_ACTIONS: Action['type'][] = ['ADD_HISTORY', 'UNDO', 'REDO'];
const COMPONENT_ACTIONS: Action['type'][] = ['ADD_COMPONENT'];
const CLIPBOARD_ACTIONS: Action['type'][] = ['COPY_STYLES', 'PASTE_STYLES'];
const CONTEXT_MENU_ACTIONS: Action['type'][] = ['SHOW_CONTEXT_MENU', 'HIDE_CONTEXT_MENU'];
const CLASS_ACTIONS: Action['type'][] = ['ADD_GLOBAL_CLASS', 'UPDATE_GLOBAL_CLASS', 'DELETE_GLOBAL_CLASS'];
const DESIGN_TOKEN_ACTIONS: Action['type'][] = ['ADD_DESIGN_TOKEN', 'UPDATE_DESIGN_TOKEN', 'DELETE_DESIGN_TOKEN'];

export const editorReducer = (state: EditorState, action: Action): EditorState => {
    if (action.type === 'SET_INITIAL_STATE') return action.payload;
    if (SITE_ACTIONS.includes(action.type)) return siteReducer(state, action);
    if (PAGE_ACTIONS.includes(action.type)) return pageReducer(state, action);
    if (ELEMENT_ACTIONS.includes(action.type)) return elementReducer(state, action);
    if (HISTORY_ACTIONS.includes(action.type)) return historyReducer(state, action);
    if (COMPONENT_ACTIONS.includes(action.type)) return componentReducer(state, action);
    if (CLIPBOARD_ACTIONS.includes(action.type)) return clipboardReducer(state, action);
    if (CONTEXT_MENU_ACTIONS.includes(action.type)) return contextMenuReducer(state, action);
    if (CLASS_ACTIONS.includes(action.type)) return classReducer(state, action);
    if (DESIGN_TOKEN_ACTIONS.includes(action.type)) return designTokenReducer(state, action);
    return uiReducer(state, action);
};