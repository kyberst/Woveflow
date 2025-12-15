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

export const styleReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'UPDATE_ELEMENT_STYLE': {
            const { elementId, property, value, viewMode } = action.payload;
            const camelCaseProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
            const newContent = updateTree(currentPage.content, elementId, (node) => {
                const currentStyle = { ...node.styles[viewMode] };
                if (!value) delete (currentStyle as any)[camelCaseProperty];
                else (currentStyle as any)[camelCaseProperty] = value;
                return { ...node, styles: { ...node.styles, [viewMode]: currentStyle } };
            });
            return updateCurrentPageContent(state, newContent);
        }
        default: return state;
    }
};