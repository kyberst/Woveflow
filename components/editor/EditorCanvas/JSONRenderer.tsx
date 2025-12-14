import React from 'react';
import { BuilderElementNode, ViewMode, BuilderComponent } from '../../../types';
import { Renderer } from './Renderer';

interface Props {
    content: (BuilderElementNode | string)[];
    components: BuilderComponent[];
    viewMode: ViewMode;
}

export const JSONRenderer: React.FC<Props> = ({ content, components, viewMode }) => {
    return (
        <>
            {content.map((node, i) => (
                <Renderer 
                    key={typeof node === 'string' ? i : node.id} 
                    node={node} 
                    components={components} 
                    viewMode={viewMode} 
                />
            ))}
        </>
    );
};