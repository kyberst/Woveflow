import React, { useState, DragEvent } from 'react';
import { BuilderElementNode } from '../../../../../types';
import { useEditor } from '../../../../../hooks/useEditor';
import { ChevronRight, ChevronDown, Box, Type, Image as ImageIcon, Layout, GripVertical, Grid3x3 } from 'lucide-react';

interface Props { 
    node: BuilderElementNode | string; 
    depth?: number; 
}

const getIcon = (node: BuilderElementNode) => {
    if (node.tag === 'img') return <ImageIcon size={12} className="text-purple-500" />;
    if (['p','h1','h2','h3','h4','h5','h6','span','strong','em'].includes(node.tag)) return <Type size={12} className="text-slate-500" />;
    
    // Check for Grid Layout
    const isGrid = node.styles?.desktop?.display === 'grid';
    if (isGrid) return <Grid3x3 size={12} className="text-indigo-600" />;
    
    if (['div','section','main','header','footer'].includes(node.tag)) return <Layout size={12} className="text-blue-500" />;
    return <Box size={12} className="text-slate-400" />;
};

const CONTAINER_TAGS = ['div', 'section', 'main', 'header', 'footer', 'article', 'aside', 'form', 'ul', 'ol', 'nav', 'blockquote'];

export default function LayerItem({ node, depth = 0 }: Props) {
    const { state, dispatch } = useEditor();
    const [isExpanded, setIsExpanded] = useState(true);
    const [dropPos, setDropPos] = useState<'none' | 'top' | 'bottom' | 'inside'>('none');

    // Text nodes are rendered simply
    if (typeof node === 'string') {
        return (
            <div className="pl-8 py-1 text-[10px] text-slate-400 italic truncate border-l border-transparent ml-2">
                "{node.substring(0, 20)}{node.length > 20 ? '...' : ''}"
            </div>
        );
    }

    const isSelected = state.selectedElementId === node.id;
    const hasChildren = node.children.length > 0;
    const isContainer = CONTAINER_TAGS.includes(node.tag.toLowerCase());

    const handleDragStart = (e: DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/json', JSON.stringify({ layerId: node.id }));
        e.dataTransfer.effectAllowed = 'move';
        // Set drag image or styling here if needed
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault(); 
        e.stopPropagation();

        // Prevent dragging into self is handled in Drop, but we can visualize it here if we accessed drag source
        
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;

        // Logic: Top 25% -> Before, Bottom 25% -> After, Middle -> Inside (if container)
        if (y < height * 0.25) {
            setDropPos('top');
        } else if (y > height * 0.75) {
            setDropPos('bottom');
        } else {
            if (isContainer) {
                setDropPos('inside');
            } else {
                // If not a container, default to bottom/after
                setDropPos('bottom');
            }
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        setDropPos('none');

        const data = e.dataTransfer.getData('application/json');
        if (!data) return;

        try {
            const { layerId } = JSON.parse(data);
            if (layerId === node.id) return; // Cannot drop on self

            let position: 'before' | 'after' | 'inside' = 'after';
            
            if (dropPos === 'top') position = 'before';
            else if (dropPos === 'inside') position = 'inside';
            else position = 'after';

            dispatch({ 
                type: 'MOVE_ELEMENT', 
                payload: { elementId: layerId, targetId: node.id, position } 
            });
            dispatch({ type: 'ADD_HISTORY' });
        } catch (err) { 
            console.error("Layer Drop Error", err); 
        }
    };

    // Styling based on state
    let containerClasses = "group flex items-center py-1.5 pr-2 cursor-pointer transition-colors border-l-2 text-sm";
    
    // Selection Style
    if (isSelected) {
        containerClasses += " bg-blue-100 dark:bg-blue-900/30 border-l-blue-600 dark:border-l-blue-400";
    } else {
        containerClasses += " border-l-transparent hover:bg-gray-100 dark:hover:bg-slate-800";
    }

    // Drop Target Styles
    if (dropPos === 'top') containerClasses += " border-t-2 border-t-blue-500";
    if (dropPos === 'bottom') containerClasses += " border-b-2 border-b-blue-500";
    if (dropPos === 'inside') containerClasses += " ring-2 ring-inset ring-blue-400 bg-blue-50 dark:bg-blue-900/50";

    const selectElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({ type: 'SET_SELECTED_ELEMENT', payload: node.id });
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="select-none">
            <div
                draggable 
                onDragStart={handleDragStart} 
                onDragOver={handleDragOver} 
                onDragLeave={() => setDropPos('none')} 
                onDrop={handleDrop}
                className={containerClasses}
                style={{ paddingLeft: `${depth * 12 + 6}px` }}
                onClick={selectElement}
            >
                {/* Drag Handle */}
                <div className="mr-1 text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-500">
                    <GripVertical size={12} />
                </div>

                {/* Expander */}
                <div 
                    onClick={hasChildren ? toggleExpand : undefined} 
                    className={`mr-1 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${hasChildren ? 'cursor-pointer opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </div>

                {/* Icon & Label */}
                <div className="mr-2 opacity-80">{getIcon(node)}</div>
                <div className="flex flex-col truncate">
                    <span className={`text-[11px] leading-tight font-medium ${isSelected ? 'text-blue-700 dark:text-blue-200' : 'text-slate-700 dark:text-slate-300'}`}>
                        {node.tag} 
                        {node.id && <span className="ml-1.5 text-[9px] font-mono text-slate-400 font-normal">#{node.id.split('-').pop()}</span>}
                    </span>
                    {node.classNames && node.classNames.length > 0 && (
                        <span className="text-[9px] text-slate-400 truncate max-w-[120px]">.{node.classNames.join('.')}</span>
                    )}
                </div>
            </div>

            {/* Children Recursion */}
            {hasChildren && isExpanded && (
                <div className="border-l border-gray-100 dark:border-slate-800 ml-3">
                    {node.children.map((child, i) => (
                        <LayerItem 
                            key={typeof child === 'string' ? i : child.id} 
                            node={child} 
                            depth={depth + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}