import { BuilderElementNode } from '../../types';

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