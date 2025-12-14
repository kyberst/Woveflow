import { EditorState, Action } from '../../types';
import { siteReducer, SITE_ACTIONS } from './site/index';
import { pageReducer, PAGE_ACTIONS } from './page/index';
import { elementReducer, ELEMENT_ACTIONS } from './element/index';
import { historyReducer, HISTORY_ACTIONS } from './history/index';
import { componentReducer, COMPONENT_ACTIONS } from './component/index';
import { uiReducer, UI_ACTIONS } from './ui/index';
import { contextMenuReducer, CONTEXT_MENU_ACTIONS } from './contextMenu/index';
import { clipboardReducer, CLIPBOARD_ACTIONS } from './clipboard/index';
import { classReducer, CLASS_ACTIONS } from './class/index';
import { designTokenReducer, DESIGN_TOKEN_ACTIONS } from './designToken/index';
import { editorInitializationReducer } from './ui/editorInitializationReducer';

export const editorReducer = (state: EditorState, action: Action): EditorState => {
    // Handle initial state setting directly
    if (action.type === 'SET_INITIAL_STATE') return editorInitializationReducer(state, action);

    // Delegate to domain-specific reducers
    if (SITE_ACTIONS.includes(action.type as Action['type'])) return siteReducer(state, action);
    if (PAGE_ACTIONS.includes(action.type as Action['type'])) return pageReducer(state, action);
    if (ELEMENT_ACTIONS.includes(action.type as Action['type'])) return elementReducer(state, action);
    if (HISTORY_ACTIONS.includes(action.type as Action['type'])) return historyReducer(state, action);
    if (COMPONENT_ACTIONS.includes(action.type as Action['type'])) return componentReducer(state, action);
    if (CLIPBOARD_ACTIONS.includes(action.type as Action['type'])) return clipboardReducer(state, action);
    if (CONTEXT_MENU_ACTIONS.includes(action.type as Action['type'])) return contextMenuReducer(state, action);
    if (CLASS_ACTIONS.includes(action.type as Action['type'])) return classReducer(state, action);
    if (DESIGN_TOKEN_ACTIONS.includes(action.type as Action['type'])) return designTokenReducer(state, action);
    
    // UI reducer handles any remaining UI-related actions
    if (UI_ACTIONS.includes(action.type as Action['type'])) return uiReducer(state, action);
    
    return state; // If no reducer handles the action, return the current state
};