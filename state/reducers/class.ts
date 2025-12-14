import { EditorState, Action } from '../../types';
import * as db from '../../services/surrealdbService';

export const classReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'ADD_GLOBAL_CLASS': {
      db.createGlobalClass(action.payload).catch(console.error);
      return {
        ...state,
        globalClasses: [...state.globalClasses, action.payload],
      };
    }

    case 'UPDATE_GLOBAL_CLASS': {
      db.updateGlobalClass(action.payload).catch(console.error);
      return {
        ...state,
        globalClasses: state.globalClasses.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
      };
    }

    case 'DELETE_GLOBAL_CLASS':
      db.deleteGlobalClass(action.payload).catch(console.error);
      return {
        ...state,
        globalClasses: state.globalClasses.filter(c => c.id !== action.payload),
      };
      
    default:
      return state;
  }
};