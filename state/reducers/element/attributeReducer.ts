import { EditorState, Action, BuilderElementNode } from '../../../types';
// Corrected import path for `updateTree`
import { updateTree } from '../../../utils/tree/index';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const attributeReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'UPDATE_ELEMENT_ATTRIBUTE': {
            const { elementId, attribute, value } = action.payload;
            const newContent = updateTree(currentPage.content, elementId, (node) => ({
                ...node, attributes: { ...node.attributes, [attribute]: value }
            }));
            return updateCurrentPageContent(state, newContent);
        }
        case 'UPDATE_ELEMENT_CLASSES': {
            const { elementId, classNames } = action.payload;
            return updateCurrentPageContent(state, updateTree(currentPage.content, elementId, (node) => ({ ...node, classNames })));
        }
        default: return state;
    }
};