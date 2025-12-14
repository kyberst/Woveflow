import { BuilderElementNode, BuilderComponent, ViewMode, GlobalClass, EditorState } from '../types';
import { CSSProperties } from 'react';

const toKebabCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export const generateDesignTokensCSS = (tokens: EditorState['designTokens']): string => {
  const allTokens = [...tokens.colors, ...tokens.fonts, ...tokens.spacing];
  const cssVars = allTokens
    .map(token => `  --${token.name}: ${token.value};`)
    .join('\n');
  return `:root {\n${cssVars}\n}`;
};

export const generateGlobalStyles = (globalClasses: GlobalClass[]): string => {
  return globalClasses.map(cls => {
    const styles = Object.entries(cls.styles)
      .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
      .join('\n');
    return `.${cls.name} {\n${styles}\n}`;
  }).join('\n\n');
};

/**
 * Converts a JSON tree of BuilderElementNodes back into an HTML string.
 * It resolves component references, applies responsive styles, and can strip builder-specific attributes for production.
 */
export const jsonToHtml = (
    nodes: (BuilderElementNode | string)[], 
    components: BuilderComponent[],
    isRootLevel: boolean = true,
    viewMode: ViewMode = ViewMode.Desktop,
    isProduction: boolean = false
): string => {
  if (!nodes) return '';
  return nodes.map(node => {
    if (typeof node === 'string') {
      return node;
    }

    const { id, tag, attributes, styles, children, componentId, classNames } = node;
    const finalAttributes = { ...attributes };
    
    // --- Asset Optimization Logic ---
    if (tag === 'img') {
        // 1. Force Lazy Loading for performance
        finalAttributes['loading'] = 'lazy';

        // 2. Responsive Image Swapping
        // If we have optimized variants stored, use the one matching the current ViewMode
        if (finalAttributes['data-variants']) {
            try {
                const variants = JSON.parse(String(finalAttributes['data-variants']));
                if (viewMode === ViewMode.Mobile && variants.mobile) {
                    finalAttributes['src'] = variants.mobile;
                } else if (viewMode === ViewMode.Tablet && variants.tablet) {
                    finalAttributes['src'] = variants.tablet;
                } else {
                    finalAttributes['src'] = variants.desktop || variants.original || finalAttributes['src'];
                }
            } catch (e) {
                // Fallback to original src if JSON parse fails
                console.warn('Failed to parse image variants', e);
            }
        }
    }
    // --------------------------------

    const attrsArray = Object.entries(finalAttributes).map(([key, value]) => {
        // For production export, we might want to clean up data-variants to reduce HTML size,
        // but for now, we keep it so the exported JS could potentially use it (though this is static HTML export).
        // A robust export would generate <picture> tags here.
        return `${key}="${value}"`;
    });

    if (classNames && classNames.length > 0) {
      attrsArray.push(`class="${classNames.join(' ')}"`);
    }
    
    let finalStyles: CSSProperties = { ...styles.desktop };
    if (viewMode === ViewMode.Tablet || viewMode === ViewMode.Mobile) {
        finalStyles = { ...finalStyles, ...styles.tablet };
    }
    if (viewMode === ViewMode.Mobile) {
        finalStyles = { ...finalStyles, ...styles.mobile };
    }

    const stylesArray = Object.entries(finalStyles).map(([key, value]) => {
        return `${toKebabCase(key)}: ${value}`;
    });

    if (stylesArray.length > 0) {
      attrsArray.push(`style="${stylesArray.join('; ')}"`);
    }

    const allAttrs = isRootLevel && !isProduction 
      ? [`data-builder-id="${id}"`, ...attrsArray].filter(Boolean).join(' ') 
      : attrsArray.join(' ');
    
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    if (voidElements.has(tag)) {
        return `<${tag} ${allAttrs}>`;
    }

    let childrenHtml = componentId 
      ? resolveComponentHtml(componentId, components, viewMode, isProduction) 
      : jsonToHtml(children || [], components, isRootLevel, viewMode, isProduction);

    return `<${tag} ${allAttrs}>${childrenHtml}</${tag}>`;
  }).join('');
};

function resolveComponentHtml(componentId: string, components: BuilderComponent[], viewMode: ViewMode, isProduction: boolean): string {
    const componentDef = components.find(c => c.id === componentId);
    if (componentDef) {
        // When resolving a component, its content is not considered "root level" for attribute purposes.
        return jsonToHtml([componentDef.content], components, false, viewMode, isProduction);
    }
    return `<div class="p-2 text-red-500">Component "${componentId}" not found.</div>`;
}