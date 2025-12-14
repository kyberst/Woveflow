import { BuilderElementNode } from '../../types';

/**
 * Recursive function to find a node by ID.
 * This function is meant to be a wrapper around `findNode` for cases where
 * the input might be `(BuilderElementNode | string)[]` and strict typing
 * for `BuilderElementNode` is desired for the found node.
 */
export const findNodeById = (nodes: (BuilderElementNode | string)[], id: string): BuilderElementNode | null => {
    for (const node of nodes) {
        if (typeof node === 'string') continue;
        if (node.id === id) return node;
        const found = findNodeById(node.children, id);
        if (found) return found;
    }
    return null;
};