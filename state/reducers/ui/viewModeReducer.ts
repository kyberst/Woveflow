import { EditorState, Action } from '../../../types';

export const viewModeReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_ZOOM':
            return { ...state, zoom: action.payload };
        default:
            return state;
    }
};