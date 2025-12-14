import React from 'react';
import { Box, Type, Image as ImageIcon, Layout, Grid3x3 } from 'lucide-react';
import { BuilderElementNode } from '../types';

export const getIcon = (node: BuilderElementNode): React.ReactElement => {
    if (node.tag === 'img') {
        return React.createElement(ImageIcon, { size: 12, className: "text-purple-500" });
    }
    
    if (['p','h1','h2','h3','h4','h5','h6','span','strong','em'].includes(node.tag)) {
        return React.createElement(Type, { size: 12, className: "text-slate-500" });
    }
    
    // Check for Grid Layout
    const isGrid = node.styles?.desktop?.display === 'grid';
    if (isGrid) {
        return React.createElement(Grid3x3, { size: 12, className: "text-indigo-600" });
    }
    
    if (['div','section','main','header','footer'].includes(node.tag)) {
        return React.createElement(Layout, { size: 12, className: "text-blue-500" });
    }
    
    return React.createElement(Box, { size: 12, className: "text-slate-400" });
};