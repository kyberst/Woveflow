import { BuilderElementNode } from '../../types';
import { transformTree } from './transform';

/**
 * Removes a specific node from the tree immutably.
 * @param nodes The root list of nodes.
 * @param nodeId The ID of the node to remove.
 * @returns A new version of the tree without the specified node.
 */
export const removeNode = (
    nodes: (BuilderElementNode | string)[],
    nodeId: string
): (BuilderElementNode | string)[] => {
    return transformTree(nodes, nodeId, (siblings, index) => {
        const newSiblings = [...siblings]; // Create a new array to preserve immutability
        newSiblings.splice(index, 1); // Mutate the copy
        return newSiblings; // Return the new array
    });
};