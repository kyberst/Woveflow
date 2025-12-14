import { EditorState, Action } from '../../../types';
import { attributeReducer } from './attributeReducer';
import { styleReducer } from './styleReducer';
import { contentReducer } from './contentReducer';
import { structureReducer } from './structureReducer';
import { dragAndDropReducer } from './dragAndDropReducer';
import { gridReducer } from './gridReducer';

export const ELEMENT_ACTIONS: Action['type'][] = [
    'UPDATE_ELEMENT_ATTRIBUTE', 'UPDATE_ELEMENT_STYLE', 'UPDATE_ELEMENT_TEXT', 'UPDATE_ELEMENT_innerHTML',
    'UPDATE_ELEMENT_CLASSES', 'ADD_ELEMENT', 'MOVE_UP', 'MOVE_DOWN', 'SELECT_PARENT', 'DELETE_ELEMENT',
    'DUPLICATE_ELEMENT', 'MOVE_ELEMENT', 'SET_GRID_LAYOUT', 'UPDATE_CHILD_SPAN', 'RESIZE_GRID_COLUMN'
];

export const elementReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'UPDATE_ELEMENT_ATTRIBUTE':
        case 'UPDATE_ELEMENT_CLASSES':
            return attributeReducer(state, action);
        case 'UPDATE_ELEMENT_STYLE':
            return styleReducer(state, action);
        case 'UPDATE_ELEMENT_TEXT':
        case 'UPDATE_ELEMENT_innerHTML':
            return contentReducer(state, action);
        case 'ADD_ELEMENT':
        case 'MOVE_UP':
        case 'MOVE_DOWN':
        case 'SELECT_PARENT':
        case 'DELETE_ELEMENT':
        case 'DUPLICATE_ELEMENT':
            return structureReducer(state, action);
        case 'MOVE_ELEMENT':
            return dragAndDropReducer(state, action);
        case 'SET_GRID_LAYOUT':
        case 'UPDATE_CHILD_SPAN':
        case 'RESIZE_GRID_COLUMN':
            return gridReducer(state, action);
        default: return state;
    }
};