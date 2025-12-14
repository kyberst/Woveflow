import { EditorState, Action } from '../../../types';

export const contextMenuReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'SHOW_CONTEXT_MENU':
        return { ...state, contextMenu: action.payload };
    
    case 'HIDE_CONTEXT_MENU':
        return { ...state, contextMenu: null };
        
    default:
        return state;
  }
};