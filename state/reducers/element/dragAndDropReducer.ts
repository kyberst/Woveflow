import { EditorState, Action, BuilderElementNode } from '../../../types';
import { transformTree, findNode, updateTree } from '../../../utils/tree';
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
            const { elementId, targetId, position } = action.payload;
            if (elementId === targetId) return state;
            const nodeToMove = findNode(currentPage.content, elementId);
            if (!nodeToMove) return state;
            if (findNode(nodeToMove.children, targetId)) return state; // Prevent moving into own child
            
            // 1. Remove element from its original position
            const afterRemoval = transformTree(currentPage.content, elementId, (siblings, i) => {
                const newSiblings = [...siblings];
                newSiblings.splice(i, 1);
                return newSiblings;
            });

            // 2. Insert element into its new position
            let finalContent;
            if (position === 'inside') {
                 finalContent = updateTree(afterRemoval, targetId, (node) => ({ ...node, children: [...node.children, nodeToMove] }));
            } else {
                 finalContent = transformTree(afterRemoval, targetId, (siblings, i) => {
                    const newSiblings = [...siblings];
                    newSiblings.splice(position === 'before' ? i : i + 1, 0, nodeToMove);
                    return newSiblings;
                 });
            }
            return updateCurrentPageContent(state, finalContent);
        }
        default: return state;
    }
};