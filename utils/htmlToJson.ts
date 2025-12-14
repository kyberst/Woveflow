import { sanitizeHTML } from '../services/securityService';
import { BuilderElementNode } from '../types';
import { CSSProperties } from 'react';

/**
 * Parses a sanitized HTML string into an array of BuilderElementNodes.
 */
export const htmlToJson = (htmlString: string): BuilderElementNode[] => {
    const sanitized = sanitizeHTML(htmlString);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitized.trim();

    const parseNode = (node: Node): BuilderElementNode | string | null => {
        if (node.nodeType === 3) { // Text node
            return node.textContent || '';
        }
        if (node.nodeType !== 1) { // Not an element node
            return null;
        }

        const element = node as HTMLElement;
        const style: CSSProperties = {};
        if (element.style.cssText) {
            for(let i=0; i < element.style.length; i++) {
                const key = element.style[i];
                const camelKey = key.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof CSSProperties;
                (style as any)[camelKey] = element.style.getPropertyValue(key);
            }
        }

        const jsonNode: BuilderElementNode = {
            id: `el-${Math.random().toString(36).substr(2, 9)}`,
            tag: element.tagName.toLowerCase(),
            attributes: {},
            styles: { desktop: style },
            children: [],
        };
        
        for (const attr of Array.from(element.attributes)) {
            if (attr.name !== 'style' && attr.name !== 'data-builder-id') {
                jsonNode.attributes[attr.name] = attr.value;
            } else if (attr.name === 'data-builder-id') {
                jsonNode.id = attr.value;
            }
        }
        
        element.childNodes.forEach(child => {
            const parsedChild = parseNode(child);
            if (parsedChild !== null && (typeof parsedChild !== 'string' || parsedChild.trim() !== '')) {
                jsonNode.children.push(parsedChild);
            }
        });

        return jsonNode;
    };
    
    return Array.from(tempDiv.childNodes).map(child => parseNode(child)).filter(Boolean) as BuilderElementNode[];
};
