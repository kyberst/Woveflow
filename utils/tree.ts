import { BuilderElementNode } from '../types';

/**
 * Deep clones a node and assigns new unique IDs to it and all its children.
 */
export const cloneNodeWithNewIds = (node: BuilderElementNode | string): BuilderElementNode | string => {
    if (typeof node === 'string') return node;

    const newId = `el-${Math.random().toString(36).substr(2, 9)}`;
    const clonedChildren = node.children ? node.children.map(cloneNodeWithNewIds) : [];
    
    return {
        ...JSON.parse(JSON.stringify(node)), // Deep clone properties
        id: newId,
        children: clonedChildren as (BuilderElementNode | string)[],
    };
};

/**
 * Efficiently updates a specific node in the tree while preserving references for unchanged branches.
 * @param nodes The root list of nodes.
 * @param targetId The ID of the node to update.
 * @param updateFn A function that takes the old node and returns the new node.
 */
export const updateTree = (
    nodes: (BuilderElementNode | string)[],
    targetId: string,
    updateFn: (node: BuilderElementNode) => BuilderElementNode
): (BuilderElementNode | string)[] => {
    let modified = false;

    const nextNodes = nodes.map(node => {
        if (typeof node === 'string') return node;

        // Match found: Update the node
        if (node.id === targetId) {
            modified = true;
            return updateFn(node);
        }

        // Recursive step: Check children
        if (node.children && node.children.length > 0) {
            const newChildren = updateTree(node.children, targetId, updateFn);
            // Reference check: If children array changed, we must clone the parent
            if (newChildren !== node.children) {
                modified = true;
                return { ...node, children: newChildren };
            }
        }

        return node;
    });

    // Return original reference if no changes occurred (Structural Sharing)
    return modified ? nextNodes : nodes;
};

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