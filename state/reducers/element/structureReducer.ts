import { EditorState, Action, BuilderElementNode } from '../../../types';
import { transformTree, findParent, cloneNodeWithNewIds } from '../../../utils/tree';
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
            if (!targetId) return updateCurrentPageContent(state, [...currentPage.content, element]);
            const newContent = transformTree(currentPage.content, targetId, (siblings, index) => {
                const newSiblings = [...siblings];
                if (mode === 'inside') {
                    const targetNode = newSiblings[index];
                    if (typeof targetNode !== 'string') newSiblings[index] = { ...targetNode, children: [...targetNode.children, element] };
                } else if (mode === 'after') newSiblings.splice(index + 1, 0, element);
                else if (mode === 'before') newSiblings.splice(index, 0, element);
                return newSiblings;
            });
            return updateCurrentPageContent(state, newContent);
        }
        case 'MOVE_UP': {
            if (!state.selectedElementId) return state;
            const newContent = transformTree(currentPage.content, state.selectedElementId, (siblings, index) => {
                 if (index > 0) {
                     const newSiblings = [...siblings];
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
                     const newSiblings = [...siblings];
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
            const newContent = transformTree(currentPage.content, state.selectedElementId, (siblings, index) => {
                const newSiblings = [...siblings];
                newSiblings.splice(index, 1);
                return newSiblings;
            });
            return { ...updateCurrentPageContent(state, newContent), selectedElementId: null };
        }
        case 'DUPLICATE_ELEMENT': {
            const newContent = transformTree(currentPage.content, action.payload, (siblings, index) => {
                const newSiblings = [...siblings];
                const originalNode = newSiblings[index];
                newSiblings.splice(index + 1, 0, cloneNodeWithNewIds(originalNode));
                return newSiblings;
            });
            return updateCurrentPageContent(state, newContent);
        }
        default: return state;
    }
};