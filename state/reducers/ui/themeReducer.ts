import { EditorState, Action } from '../../../types';

export const themeReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
};