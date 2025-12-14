import React from 'react';
import { Box, Type, Image as ImageIcon, Layout, GripVertical, Grid3x3 } from 'lucide-react'; // Added Grid3x3 from context
import { BuilderElementNode } from '../types';

export const getIcon = (node: BuilderElementNode): React.JSX.Element => {
    if (node.tag === 'img') return <ImageIcon size={12} className="text-purple-500" />;
    if (['p','h1','h2','h3','h4','h5','h6','span','strong','em'].includes(node.tag)) return <Type size={12} className="text-slate-500" />;
    
    // Check for Grid Layout
    const isGrid = node.styles?.desktop?.display === 'grid';
    if (isGrid) return <Grid3x3 size={12} className="text-indigo-600" />;
    
    if (['div','section','main','header','footer'].includes(node.tag)) return <Layout size={12} className="text-blue-500" />;
    return <Box size={12} className="text-slate-400" />;
};