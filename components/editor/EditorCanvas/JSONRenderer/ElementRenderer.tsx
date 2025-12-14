import React, { useMemo } from 'react';
import { BuilderElementNode, ViewMode, BuilderComponent } from '../../../../types';
import { JSONRenderer } from './index';

interface Props {
  node: BuilderElementNode | string;
  components: BuilderComponent[];
  viewMode: ViewMode;
}

const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export const ElementRenderer: React.FC<Props> = ({ node, components, viewMode }) => {
  if (typeof node === 'string') return <>{node}</>;

  if (node.componentId) {
    const componentDef = components.find(c => c.id === node.componentId);
    if (componentDef) {
      return <JSONRenderer content={[componentDef.content]} components={components} viewMode={viewMode} />;
    }
    return <div className="p-2 text-red-500 border border-red-300 bg-red-50">Component "{node.componentId}" not found.</div>;
  }

  const computedStyles = useMemo(() => {
    let styles: React.CSSProperties = { ...node.styles.desktop };
    if (viewMode === ViewMode.Tablet || viewMode === ViewMode.Mobile) styles = { ...styles, ...node.styles.tablet };
    if (viewMode === ViewMode.Mobile) styles = { ...styles, ...node.styles.mobile };
    return styles;
  }, [node.styles, viewMode]);

  const props: any = {
    'data-builder-id': node.id,
    style: computedStyles,
    className: node.classNames?.join(' '),
    ...node.attributes
  };

  if (node.tag === 'img') {
    props.loading = 'lazy';
    if (props['data-variants']) {
      try {
        const variants = JSON.parse(props['data-variants']);
        if (viewMode === ViewMode.Mobile && variants.mobile) props.src = variants.mobile;
        else if (viewMode === ViewMode.Tablet && variants.tablet) props.src = variants.tablet;
        else props.src = variants.desktop || variants.original || props.src;
      } catch (e) { /* Ignore */ }
    }
  }

  const isVoid = VOID_ELEMENTS.includes(node.tag.toLowerCase());
  const children = isVoid ? null : <JSONRenderer content={node.children} components={components} viewMode={viewMode} />;

  return React.createElement(node.tag, props, children);
};