import { EditorState, Action } from '../../../types';

export const generalReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'TOGGLE_PREVIEW':
            return { ...state, isPreviewing: !state.isPreviewing };
        default:
            return state;
    }
};