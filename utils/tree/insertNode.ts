import { BuilderElementNode } from '../../types';
import { transformTree } from './transform';
import { updateTree } from './update';

/**
 * Inserts a node into the tree at a specified position relative to a target node, immutably.
 * @param nodes The root list of nodes.
 * @param targetId The ID of the node to use as a reference point for insertion. If null, inserts at the root level.
 * @param position 'before' | 'after' | 'inside'
 * @param nodeToInsert The node to insert.
 * @returns A new version of the tree with the node inserted.
 */
export const insertNode = (
    nodes: (BuilderElementNode | string)[],
    targetId: string | null, // null for root level
    position: 'before' | 'after' | 'inside',
    nodeToInsert: BuilderElementNode
): (BuilderElementNode | string)[] => {
    if (targetId === null) {
        // Insert at the root level (always as a new top-level element)
        return [...nodes, nodeToInsert];
    }

    if (position === 'inside') {
        // Find the target node and add `nodeToInsert` to its children
        return updateTree(nodes, targetId, (targetNode) => ({
            ...targetNode,
            children: [...targetNode.children, nodeToInsert] // Create new children array
        }));
    } else {
        // Insert as a sibling before or after the target node
        return transformTree(nodes, targetId, (siblings, index) => {
            const newSiblings = [...siblings]; // Create a new array to preserve immutability
            newSiblings.splice(position === 'before' ? index : index + 1, 0, nodeToInsert); // Mutate the copy
            return newSiblings; // Return the new array
        });
    }
};