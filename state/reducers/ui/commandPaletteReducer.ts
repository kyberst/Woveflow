import { EditorState, Action } from '../../../types';

export const commandPaletteReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'TOGGLE_COMMAND_PALETTE':
            return { ...state, showCommandPalette: action.payload };
        default:
            return state;
    }
};