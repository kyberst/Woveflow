import { EditorState, Action } from '../../types';

const MAX_HISTORY_LENGTH = 50;

export const historyReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'ADD_HISTORY': {
      let newHistory = state.history.slice(0, state.historyIndex + 1);
      const lastEntry = newHistory[newHistory.length - 1];

      // Structural sharing check: only push if reference changed
      if (!lastEntry || lastEntry.pages !== state.pages) {
        newHistory.push({
          pages: state.pages,
          pageId: state.currentPageId
        });

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