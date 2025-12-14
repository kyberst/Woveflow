import React, { useMemo } from 'react';
import { BuilderElementNode, ViewMode, BuilderComponent } from '../../../types';

// Importing JSONRenderer to handle recursion for children
import { JSONRenderer } from './JSONRenderer';

interface RendererProps {
    node: BuilderElementNode | string;
    components: BuilderComponent[];
    viewMode: ViewMode;
}

const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export const Renderer: React.FC<RendererProps> = ({ node, components, viewMode }) => {
    // 1. Handle Text Nodes
    if (typeof node === 'string') {
        return <>{node}</>;
    }

    // 2. Handle Component References
    if (node.componentId) {
        const componentDef = components.find(c => c.id === node.componentId);
        if (componentDef) {
            return (
                <JSONRenderer 
                    content={[componentDef.content]} 
                    components={components} 
                    viewMode={viewMode} 
                />
            );
        }
        return <div className="p-2 text-red-500 border border-red-300 bg-red-50">Component "{node.componentId}" not found.</div>;
    }

    // 3. Resolve Responsive Styles (Cascade Strategy: Desktop -> Tablet -> Mobile)
    const computedStyles = useMemo(() => {
        // Base styles (Desktop is default in this architecture)
        let styles: React.CSSProperties = { ...node.styles.desktop };
        
        // If Tablet, merge tablet styles on top of desktop
        if (viewMode === ViewMode.Tablet || viewMode === ViewMode.Mobile) {
            // Only merge keys that exist in tablet config
            if (node.styles.tablet) {
                styles = { ...styles, ...node.styles.tablet };
            }
        }
        
        // If Mobile, merge mobile styles on top of the result
        if (viewMode === ViewMode.Mobile) {
            if (node.styles.mobile) {
                styles = { ...styles, ...node.styles.mobile };
            }
        }
        return styles;
    }, [node.styles, viewMode]);

    // 4. Resolve Attributes & Classes
    const props: any = {
        'data-builder-id': node.id, // Critical for selection & visualizer logic
        style: computedStyles,
        className: node.classNames?.join(' '),
        ...node.attributes
    };

    // 5. Handle Responsive Images (Performance optimization)
    if (node.tag === 'img') {
        props.loading = 'lazy';
        if (props['data-variants']) {
            try {
                const variants = JSON.parse(props['data-variants']);
                if (viewMode === ViewMode.Mobile && variants.mobile) {
                    props.src = variants.mobile;
                } else if (viewMode === ViewMode.Tablet && variants.tablet) {
                    props.src = variants.tablet;
                } else {
                    props.src = variants.desktop || variants.original || props.src;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    // 6. Render Children
    const isVoid = VOID_ELEMENTS.includes(node.tag.toLowerCase());
    
    // Use JSONRenderer for children recursion
    const children = isVoid ? null : (
        <JSONRenderer 
            content={node.children} 
            components={components} 
            viewMode={viewMode} 
        />
    );

    return React.createElement(node.tag, props, children);
};