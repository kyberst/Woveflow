import { EditorState, Action, BuilderElementNode } from '../../../types';
import { findNode, updateTree } from '../../../utils/tree';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const clipboardReducer = (state: EditorState, action: Action): EditorState => {
  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  if (!currentPage) return state;

  switch (action.type) {
    case 'COPY_STYLES': {
        const node = findNode(currentPage.content, action.payload);
        if (node) {
            // Deep clone styles to avoid reference issues
            const stylesToCopy = JSON.parse(JSON.stringify(node.styles));
            return { ...state, clipboard: { styles: stylesToCopy } };
        }
        return state;
    }

    case 'PASTE_STYLES': {
        if (!state.clipboard?.styles) return state;
        
        // Deep clone from clipboard to avoid mutation of clipboard state
        const stylesToPaste = JSON.parse(JSON.stringify(state.clipboard.styles));

        const newContent = updateTree(currentPage.content, action.payload, (node) => ({
            ...node,
            styles: stylesToPaste
        }));
        
        const content = newContent as BuilderElementNode[];
        
        return {
            ...state,
            pages: state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p)
        };
    }

    default:
        return state;
  }
};