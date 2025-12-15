import { EditorState, Action, BuilderElementNode } from '../../../types';
// Corrected import paths for `findNode`, `updateTree`, `removeNode`, and `insertNode`
import { findNode, updateTree, removeNode, insertNode } from '../../../utils/tree/index';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const dragAndDropReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'MOVE_ELEMENT': {
            const { elementId, targetId, position, newStyles, viewMode } = action.payload;
            if (elementId === targetId) return state;
            const nodeToMove = findNode(currentPage.content, elementId);
            if (!nodeToMove) return state;
            if (findNode(nodeToMove.children, targetId)) return state; // Prevent moving into own child
            
            // 1. Remove element from its original position (immutable)
            const afterRemoval = removeNode(currentPage.content, elementId);

            // 2. Insert element into its new position (immutable)
            let finalContent = insertNode(afterRemoval, targetId, position, nodeToMove as BuilderElementNode);
            
            // 3. Apply new styles (e.g., Grid placement) if provided
            if (newStyles && viewMode) {
                finalContent = updateTree(finalContent, elementId, (node) => {
                    const targetView = viewMode; 
                    const currentStyles = node.styles[targetView] || {};
                    
                    return {
                        ...node,
                        styles: {
                            ...node.styles,
                            [targetView]: { ...currentStyles, ...newStyles }
                        }
                    };
                });
            }

            return updateCurrentPageContent(state, finalContent);
        }
        default: return state;
    }
};