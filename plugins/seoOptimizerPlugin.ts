import { Plugin, BuilderElementNode } from '../types';
import { traverse } from '../utils/treeTraverse';

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