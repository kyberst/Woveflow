import { EditorState, Action } from '../../../types';

export const editorInitializationReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'SET_INITIAL_STATE':
            return action.payload;
        default:
            return state;
    }
};