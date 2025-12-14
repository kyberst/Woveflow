import { BuilderElementNode } from '../../types';

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