import { EditorState, Action } from '../../../types';

export const dragAndDropReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'SET_IS_DRAGGING':
            return { ...state, isDragging: action.payload };
        case 'SET_DRAG_OVER_STATE':
            return { ...state, dragOverState: action.payload };
        case 'CLEAR_DRAG_STATE':
            return { ...state, isDragging: false, dragOverState: null };
        default:
            return state;
    }
};