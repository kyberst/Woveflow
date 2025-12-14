import React from 'react';
import { BuilderElementNode, ViewMode, BuilderComponent } from '../../../../types';
import { ElementRenderer } from './ElementRenderer';

interface Props {
  content: (BuilderElementNode | string)[];
  components: BuilderComponent[];
  viewMode: ViewMode;
}

export const JSONRenderer: React.FC<Props> = React.memo(({ content, components, viewMode }) => {
  return (
    <>
      {content.map((node, i) => (
        <ElementRenderer 
          key={typeof node === 'string' ? i : node.id} 
          node={node} 
          components={components} 
          viewMode={viewMode} 
        />
      ))}
    </>
  );
});