import { BuilderElementNode } from '../types';

/**
 * Recursively traverses a node tree and applies a function to each node.
 */
export const traverse = (nodes: (BuilderElementNode | string)[], callback: (node: BuilderElementNode) => void) => {
  nodes.forEach(node => {
    if (typeof node === 'string') return;
    callback(node);
    if (node.children) {
      traverse(node.children, callback);
    }
  });
};