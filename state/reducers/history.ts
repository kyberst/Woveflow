import { EditorState, Action } from '../../types';

const MAX_HISTORY_LENGTH = 50;

export const historyReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'ADD_HISTORY': {
        // Slice history to current index to remove "future" redo states
        let newHistory = state.history.slice(0, state.historyIndex + 1);
        const lastEntry = newHistory[newHistory.length - 1];

        // OPTIMIZATION: Reference equality check on the `pages` array.
        // Because our reducers use immutable patterns (structural sharing),
        // state.pages will be a new reference if and only if any page content changed.
        // This makes storing the entire "world state" extremely cheap (just a pointer copy).
        if (!lastEntry || lastEntry.pages !== state.pages) {
            
            // Snapshot the entire pages array and the current context
            newHistory.push({ 
                pages: state.pages, 
                pageId: state.currentPageId 
            });

            // Enforce Max Limit
            if (newHistory.length > MAX_HISTORY_LENGTH) {
                newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
            }

            return { 
                ...state, 
                history: newHistory, 
                historyIndex: newHistory.length - 1 
            };
        }
        return state;
    }

    case 'UNDO': {
        if (state.historyIndex <= 0) return state;
        const newIndex = state.historyIndex - 1;
        const historyState = state.history[newIndex];
        
        return { 
            ...state, 
            historyIndex: newIndex, 
            currentPageId: historyState.pageId, 
            pages: historyState.pages,
            selectedElementId: null 
        };
    }

    case 'REDO': {
        if (state.historyIndex >= state.history.length - 1) return state;
        const newIndex = state.historyIndex + 1;
        const historyState = state.history[newIndex];
        
        return { 
            ...state, 
            historyIndex: newIndex, 
            currentPageId: historyState.pageId, 
            pages: historyState.pages,
            selectedElementId: null
        };
    }
    
    default:
      return state;
  }
};