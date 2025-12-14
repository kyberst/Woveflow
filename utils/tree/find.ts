import { BuilderElementNode } from '../../types';

/**
 * Finds a node by its ID in the tree.
 */
export const findNode = (
    nodes: (BuilderElementNode | string)[],
    id: string
): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        if (node.id === id) return node;
        
        const found = findNode(node.children, id);
        if (found) return found;
    }
    return null;
};