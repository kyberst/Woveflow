import { Plugin, BuilderElementNode } from '../types';

/**
 * Recursively traverses a node tree and applies a function to each node.
 */
const traverse = (nodes: (BuilderElementNode | string)[], callback: (node: BuilderElementNode) => void) => {
  nodes.forEach(node => {
    if (typeof node === 'string') return;
    callback(node);
    if (node.children) {
      traverse(node.children, callback);
    }
  });
};

export const seoOptimizerPlugin: Plugin = {
  name: 'SEO Optimizer',

  /**
   * This hook runs before the page is published.
   * It scans the content for common SEO and accessibility issues.
   */
  onPublish: async (content, context) => {
    console.log(`[SEO Optimizer] Checking page: "${context.page.name}" for issues...`);
    
    traverse(content, (node) => {
      // Check 1: Ensure all images have alt tags.
      if (node.tag === 'img' && !node.attributes.alt) {
        console.warn(
          `[SEO Optimizer] SEO Issue Found: Image with src "${node.attributes.src}" is missing an 'alt' attribute. This is bad for SEO and accessibility.`,
          `Element ID: ${node.id}`
        );
      }
      
      // Future checks could be added here, e.g., checking for proper heading structure (h1, h2, etc.)
    });

    // This plugin only inspects, it doesn't modify the content.
    // A more advanced version could use AI to automatically add alt tags.
    return content;
  },
};
