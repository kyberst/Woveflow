import { BuilderElementNode } from '../../types';

/**
 * Handles structural changes (Insert, Delete, Move) by finding the parent array of the target
 * and applying a transformation to that array.
 * @param nodes The root list of nodes.
 * @param targetId The ID of the node to locate (as a reference point).
 * @param operation A function that receives the array containing the target and the target's index, returning a new array.
 */
export const transformTree = (
    nodes: (BuilderElementNode | string)[],
    targetId: string,
    operation: (siblings: (BuilderElementNode | string)[], index: number) => (BuilderElementNode | string)[]
): (BuilderElementNode | string)[] => {
    
    // Check if target is in the current level
    const index = nodes.findIndex(n => typeof n !== 'string' && n.id === targetId);
    
    if (index !== -1) {
        // Target found in this array. Apply the operation (e.g., splice, filter).
        const newSiblings = operation(nodes, index);
        // Only return new array if it's actually different (length or content check could be added, but operation usually implies change)
        return newSiblings; 
    }

    // Not found, recurse into children
    let modified = false;
    const nextNodes = nodes.map(node => {
        if (typeof node === 'string') return node;
        
        if (node.children && node.children.length > 0) {
            const newChildren = transformTree(node.children, targetId, operation);
            if (newChildren !== node.children) {
                modified = true;
                return { ...node, children: newChildren };
            }
        }
        return node;
    });

    return modified ? nextNodes : nodes;
};