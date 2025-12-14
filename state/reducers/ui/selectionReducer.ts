import { EditorState, Action } from '../../../types';

export const selectionReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'SET_SELECTED_ELEMENT':
            if (action.payload === state.inlineEditingElementId) return state;
            return { ...state, selectedElementId: action.payload, hoveredElementId: null };
        case 'SET_HOVERED_ELEMENT':
            if (state.selectedElementId && state.selectedElementId === action.payload || state.isDragging) {
                return { ...state, hoveredElementId: null };
            }
            return { ...state, hoveredElementId: action.payload };
        case 'SET_INLINE_EDITING_ELEMENT':
            return { ...state, inlineEditingElementId: action.payload, selectedElementId: null, hoveredElementId: null };
        case 'SET_INSERTION_TARGET':
            return { ...state, insertionTarget: action.payload };
        default:
            return state;
    }
};