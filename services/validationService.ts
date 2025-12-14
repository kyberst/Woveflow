import { BuilderElementNode, BuilderComponent } from '../types';

/**
 * Type guard to check if an object is a valid BuilderElementNode.
 * It checks for the presence and basic types of required properties.
 */
function isBuilderElementNode(obj: any): obj is BuilderElementNode {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.tag === 'string' &&
    typeof obj.attributes === 'object' &&
    typeof obj.styles === 'object' &&
    typeof obj.styles.desktop === 'object' &&
    Array.isArray(obj.children)
  );
}

/**
 * Recursively validates a tree of nodes against the BuilderElementNode schema
 * and checks for broken component references.
 *
 * @param nodes The array of nodes to validate.
 * @param components The array of available components for reference checking.
 * @returns An object with an `isValid` boolean and an `error` message string if invalid.
 */
export const validateNodeTree = (
  nodes: any[],
  components: BuilderComponent[]
): { isValid: boolean; error: string | null } => {
  for (const node of nodes) {
    if (typeof node === 'string') {
      continue; // Text nodes are valid.
    }

    if (!isBuilderElementNode(node)) {
      console.error('Validation failed for node:', node);
      return {
        isValid: false,
        error: `Invalid node structure found. Ensure all elements have required properties (id, tag, attributes, styles, children).`,
      };
    }

    // Check for broken component references
    if (node.componentId && !components.some(c => c.id === node.componentId)) {
        return {
            isValid: false,
            error: `Invalid component reference found: ID "${node.componentId}" does not exist.`,
        };
    }

    // Recursively validate children
    const childrenValidation = validateNodeTree(node.children, components);
    if (!childrenValidation.isValid) {
      return childrenValidation; // Propagate the error up
    }
  }

  return { isValid: true, error: null };
};
