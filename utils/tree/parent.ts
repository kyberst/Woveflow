import { BuilderElementNode } from '../../types';

/**
 * Finds the parent node of a given element ID.
 */
export const findParent = (
    nodes: (BuilderElementNode | string)[],
    childId: string
): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        
        // Check immediate children
        if (node.children.some(c => typeof c !== 'string' && c.id === childId)) {
            return node;
        }
        
        // Recurse
        const found = findParent(node.children, childId);
        if (found) return found;
    }
    return null;
};