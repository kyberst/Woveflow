import { EditorState, Action, BuilderElementNode } from '../../types';
import { updateTree, transformTree, findParent, cloneNodeWithNewIds, findNode } from '../../utils/tree';
import { htmlToJson } from '../../utils/htmlToJson';
import { validateNodeTree } from '../../services/validationService';
import * as db from '../../services/surrealdbService';

const updateCurrentPageContent = (state: EditorState, newContent: (BuilderElementNode | string)[]) => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage && currentPage.content === newContent) return state;
    const content = newContent as BuilderElementNode[];
    const newPages = state.pages.map(p => p.id === state.currentPageId ? { ...p, content } : p);
    db.updatePageContent(state.currentPageId, content).catch(console.error);
    return { ...state, pages: newPages };
};

export const elementReducer = (state: EditorState, action: Action): EditorState => {
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
    case 'UPDATE_ELEMENT_CLASSES': {
      const { elementId, classNames } = action.payload;
      return updateCurrentPageContent(state, updateTree(currentPage.content, elementId, (node) => ({ ...node, classNames })));
    }
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
    case 'MOVE_ELEMENT': {
        const { elementId, targetId, position } = action.payload;
        if (elementId === targetId) return state;
        const nodeToMove = findNode(currentPage.content, elementId);
        if (!nodeToMove) return state;
        if (findNode(nodeToMove.children, targetId)) return state; // Prevent moving into own child
        const afterRemoval = transformTree(currentPage.content, elementId, (siblings, i) => {
            const newSiblings = [...siblings];
            newSiblings.splice(i, 1);
            return newSiblings;
        });
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
    case 'UPDATE_CHILD_SPAN': {
        const { elementId, span } = action.payload;
        const { viewMode } = state;
        
        const newContent = updateTree(currentPage.content, elementId, (node) => {
            const styleToUpdate = { ...node.styles[viewMode] };
            
            const spanValue = typeof span === 'number' ? `span ${span}` : span;
            styleToUpdate.gridColumn = spanValue as string;
            
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