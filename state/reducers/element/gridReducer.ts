import { EditorState, Action, BuilderElementNode } from '../../../types';
import { updateTree } from '../../../utils/tree';
import * as db from '../../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const gridReducer = (state: EditorState, action: Action): EditorState => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return state;

    switch (action.type) {
        case 'SET_GRID_LAYOUT': {
            const { elementId, layout, columns = 2, gap = '1rem' } = action.payload;
            const { viewMode } = state;
            
            const newContent = updateTree(currentPage.content, elementId, (node) => {
                 const styleToUpdate = { ...node.styles[viewMode] };
                 
                 styleToUpdate.display = layout;
                 styleToUpdate.gap = gap;
                 
                 if (layout === 'grid') {
                     styleToUpdate.gridTemplateColumns = `repeat(${columns}, 1fr)`;
                     // Clean up flex props
                     delete (styleToUpdate as any).flexDirection;
                     delete (styleToUpdate as any).flexWrap;
                     delete (styleToUpdate as any).alignItems;
                     delete (styleToUpdate as any).justifyContent;
                 } else {
                     styleToUpdate.display = 'flex';
                     styleToUpdate.flexWrap = 'wrap';
                     // Clean up grid props
                     delete (styleToUpdate as any).gridTemplateColumns;
                     delete (styleToUpdate as any).gridTemplateRows;
                 }
                 
                 return {
                     ...node,
                     styles: { ...node.styles, [viewMode]: styleToUpdate }
                 };
            });
            return updateCurrentPageContent(state, newContent);
        }
        case 'UPDATE_COLUMN_SPAN': {
            const { elementId, span } = action.payload;
            const { viewMode } = state;
            
            const newContent = updateTree(currentPage.content, elementId, (node) => {
                const styleToUpdate = { ...node.styles[viewMode] };
                styleToUpdate.gridColumn = `span ${span}`;
                
                return {
                    ...node,
                    styles: { ...node.styles, [viewMode]: styleToUpdate }
                };
            });
            return updateCurrentPageContent(state, newContent);
        }
        default: return state;
    }
};