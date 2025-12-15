import { EditorState, Action } from '../../types';
import { attributeReducer } from './element/attributeReducer';
import { styleReducer } from './element/styleReducer';
import { contentReducer } from './element/contentReducer';
import { structureReducer } from './element/structureReducer';
import { dragAndDropReducer } from './element/dragAndDropReducer';
import { gridReducer } from './element/gridReducer';

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
        case 'SET_CONTAINER_LAYOUT':
        case 'UPDATE_CHILD_SPAN':
        case 'RESIZE_GRID_COLUMN':
            return gridReducer(state, action);
        default: return state;
    }
};