import { EditorState, Action } from '../../../types';
import { themeReducer } from './themeReducer';
import { viewModeReducer } from './viewModeReducer';
import { modalsReducer } from './modalsReducer';
import { selectionReducer } from './selectionReducer';
import { dragAndDropReducer } from './dragAndDropReducer';
import { panelsReducer } from './panelsReducer';
import { commandPaletteReducer } from './commandPaletteReducer';
import { generalReducer } from './generalReducer';

export const UI_ACTIONS: Action['type'][] = [
    'TOGGLE_THEME', 'SET_VIEW_MODE', 'SET_ZOOM', 'SET_ACTIVE_TAB', 'CLOSE_SIDEBAR_PANEL',
    'SET_SELECTED_ELEMENT', 'SET_HOVERED_ELEMENT', 'SET_INLINE_EDITING_ELEMENT', 'SET_INSERTION_TARGET',
    'TOGGLE_AI_MODAL', 'TOGGLE_PREVIEW', 'TOGGLE_ADD_COMPONENT_MODAL', 'TOGGLE_CODE_EDITOR_MODAL',
    'TOGGLE_SAVE_COMPONENT_MODAL', 'TOGGLE_SETTINGS_MODAL', 'TOGGLE_SITE_SETTINGS_MODAL',
    'SET_IS_DRAGGING', 'SET_DRAG_OVER_STATE', 'CLEAR_DRAG_STATE',
    'TOGGLE_BOTTOM_PANEL', 'SET_BOTTOM_TAB', 'TOGGLE_COMMAND_PALETTE'
];

export const uiReducer = (state: EditorState, action: Action): EditorState => {
    const nextState = themeReducer(state, action);
    if (nextState !== state) return nextState;

    const nextState2 = viewModeReducer(state, action);
    if (nextState2 !== state) return nextState2;

    const nextState3 = modalsReducer(state, action);
    if (nextState3 !== state) return nextState3;

    const nextState4 = selectionReducer(state, action);
    if (nextState4 !== state) return nextState4;

    const nextState5 = dragAndDropReducer(state, action);
    if (nextState5 !== state) return nextState5;

    const nextState6 = panelsReducer(state, action);
    if (nextState6 !== state) return nextState6;

    const nextState7 = commandPaletteReducer(state, action);
    if (nextState7 !== state) return nextState7;

    const nextState8 = generalReducer(state, action);
    if (nextState8 !== state) return nextState8;
    
    return state;
};