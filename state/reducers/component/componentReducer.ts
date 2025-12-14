import { EditorState, Action } from '../../../types';
import * as db from '../../../services/surrealdbService';

export const componentReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'ADD_COMPONENT': {
        const newComponent = action.payload;
        db.createComponent(newComponent).catch(console.error);

        // Add the new custom component to the start of the list
        const newComponents = [
            newComponent, 
            ...state.components
        ];
        
        return { ...state, components: newComponents };
    }
    default:
        return state;
  }
};