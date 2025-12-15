import { EditorState, Action, BuilderElementNode } from '../../../types';
// Corrected import paths for `transformTree`, `findParent`, `cloneNodeWithNewIds`, `removeNode`, and `insertNode`
import { transformTree, findParent, cloneNodeWithNewIds, removeNode, insertNode } from '../../../utils/tree/index';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const structureReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'ADD_ELEMENT': {
            const { targetId, mode, element } = action.payload;
            const newContent = insertNode(currentPage.content, targetId, mode, element);
            return updateCurrentPageContent(state, newContent);
        }
        case 'MOVE_UP': {
            if (!state.selectedElementId) return state;
            const newContent = transformTree(currentPage.content, state.selectedElementId, (siblings, index) => {
                 if (index > 0) {
                     const newSiblings = [...siblings]; // Immutable copy
                     [newSiblings[index], newSiblings[index - 1]] = [newSiblings[index - 1], newSiblings[index]];
                     return newSiblings;
                 }
                 return siblings;
            });
            return updateCurrentPageContent(state, newContent);
        }
        case 'MOVE_DOWN': {
            if (!state.selectedElementId) return state;
            const newContent = transformTree(currentPage.content, state.selectedElementId, (siblings, index) => {
                 if (index < siblings.length - 1) {
                     const newSiblings = [...siblings]; // Immutable copy
                     [newSiblings[index], newSiblings[index + 1]] = [newSiblings[index + 1], newSiblings[index]];
                     return newSiblings;
                 }
                 return siblings;
            });
            return updateCurrentPageContent(state, newContent);
        }
        case 'SELECT_PARENT': {
            if (!state.selectedElementId) return state;
            const parent = findParent(currentPage.content, state.selectedElementId);
            return parent ? { ...state, selectedElementId: parent.id } : state;
        }
        case 'DELETE_ELEMENT': {
            if (!state.selectedElementId) return state;
            const newContent = removeNode(currentPage.content, state.selectedElementId);
            return { ...updateCurrentPageContent(state, newContent), selectedElementId: null };
        }
        case 'DUPLICATE_ELEMENT': {
            const newContent = transformTree(currentPage.content, action.payload, (siblings, index) => {
                const newSiblings = [...siblings]; // Immutable copy
                const originalNode = newSiblings[index];
                newSiblings.splice(index + 1, 0, cloneNodeWithNewIds(originalNode));
                return newSiblings;
            });
            return updateCurrentPageContent(state, newContent);
        }
        default: return state;
    }
};