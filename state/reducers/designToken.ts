import { EditorState, Action } from '../../types';
import * as db from '../../services/surrealdbService';

export const designTokenReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'ADD_DESIGN_TOKEN': {
      const { category } = action.payload;
      db.createDesignToken(action.payload).catch(console.error);
      const newTokens = {
        ...state.designTokens,
        [category]: [...state.designTokens[category], action.payload]
      };
      return { ...state, designTokens: newTokens };
    }

    case 'UPDATE_DESIGN_TOKEN': {
      const { id, category } = action.payload;
      db.updateDesignToken(action.payload).catch(console.error);
      const newTokens = {
        ...state.designTokens,
        [category]: state.designTokens[category].map(t => t.id === id ? action.payload : t),
      };
      return { ...state, designTokens: newTokens };
    }

    case 'DELETE_DESIGN_TOKEN': {
      const { id, category } = action.payload;
      db.deleteDesignToken(id).catch(console.error);
      const newTokens = {
        ...state.designTokens,
        [category]: state.designTokens[category].filter(t => t.id !== id),
      };
      return { ...state, designTokens: newTokens };
    }
      
    default:
      return state;
  }
};