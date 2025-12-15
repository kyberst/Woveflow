import { EditorState, Action } from '../../types';
import { themeReducer } from './ui/themeReducer';
import { viewModeReducer } from './ui/viewModeReducer';
import { modalsReducer } from './ui/modalsReducer';
import { selectionReducer } from './ui/selectionReducer';
import { dragAndDropReducer } from './ui/dragAndDropReducer';
import { panelsReducer } from './ui/panelsReducer';
import { commandPaletteReducer } from './ui/commandPaletteReducer';
import { generalReducer } from './ui/generalReducer';

export const uiReducer = (state: EditorState, action: Action): EditorState => {
    let nextState = themeReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = viewModeReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = modalsReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = selectionReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = dragAndDropReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = panelsReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = commandPaletteReducer(state, action);
    if (nextState !== state) return nextState;

    nextState = generalReducer(state, action);
    if (nextState !== state) return nextState;
    
    return state;
};