import { EditorState, Action, BuilderElementNode } from '../../../types';
// Corrected import path for `updateTree`
import { updateTree } from '../../../utils/tree/index';
import { htmlToJson } from '../../../utils/htmlToJson';
import { validateNodeTree } from '../../../services/validationService';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const contentReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'UPDATE_ELEMENT_TEXT': {
            const { elementId, text } = action.payload;
            return updateCurrentPageContent(state, updateTree(currentPage.content, elementId, (node) => ({ ...node, children: [text] })));
        }
        case 'UPDATE_ELEMENT_innerHTML': {
            const { elementId, html } = action.payload;
            const newChildren = htmlToJson(html);
            const validationResult = validateNodeTree(newChildren, state.components);
            if (!validationResult.isValid) { alert(`Error: ${validationResult.error}`); return state; }
            return updateCurrentPageContent(state, updateTree(currentPage.content, elementId, (node) => ({ ...node, children: newChildren })));
        }
        default: return state;
    }
};