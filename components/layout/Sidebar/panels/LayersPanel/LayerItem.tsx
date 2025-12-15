import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { BuilderElementNode, ViewMode } from '../../../../../types';
import { useEditor } from '../../../../../hooks/useEditor';
import { ChevronRight, ChevronDown, GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react'; // Renamed ChevronDown to ChevronDownIcon to avoid conflict
import { getSystemComponentById } from '../../../../../services/componentRegistry';
import { getIcon as getElementIcon } from '../../../../../utils/iconMapping'; // Import the global getIcon
import { htmlToJson } from '../../../../../utils/htmlToJson'; // Import htmlToJson for converting HTML content

interface Props { 
    node: BuilderElementNode | string; 
    depth?: number; 
    index: number;
    parentId: string | null;
}

const CONTAINER_TAGS = ['div', 'section', 'main', 'header', 'footer', 'article', 'aside', 'form', 'ul', 'ol', 'nav', 'blockquote'];

export default function LayerItem({ node, depth = 0, index, parentId }: Props) {
    const { state, dispatch } = useEditor();
    const [isExpanded, setIsExpanded] = useState(true);
    // Drag state: 'none', 'before' (top), 'after' (bottom), 'inside' (center)
    const [dropPosition, setDropPosition] = useState<'none' | 'before' | 'after' | 'inside'>('none');
    const itemRef = useRef<HTMLDivElement>(null);

    // Auto-expand if a child is selected
    useEffect(() => {
        if (typeof node === 'string') return;
        
        // Helper to check deep selection
        const containsSelection = (n: BuilderElementNode): boolean => {
            if (n.id === state.selectedElementId) return true;
            return n.children.some(child => typeof child !== 'string' && containsSelection(child));
        };

        if (containsSelection(node)) {
            setIsExpanded(true);
        }
        
        // Scroll into view if this specific item is selected
        if (node.id === state.selectedElementId && itemRef.current) {
            itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [state.selectedElementId, node]);

    if (typeof node === 'string') {
        return (
            <div className="flex items-center py-1.5 pr-2 border-l border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50 text-[10px] text-slate-400 italic truncate select-none" style={{ paddingLeft: `${depth * 16 + 28}px` }}>
                <span className="truncate">"{node.substring(0, 25)}{node.length > 25 ? '...' : ''}"</span>
            </div>
        );
    }

    const isSelected = state.selectedElementId === node.id;
    const hasChildren = node.children.length > 0;
    const isContainer = CONTAINER_TAGS.includes(node.tag.toLowerCase());
    
    // Visibility Check (using Tailwind hidden class logic)
    const isHidden = node.classNames?.includes('hidden') || 
                     (state.viewMode === ViewMode.Mobile && node.styles.mobile?.display === 'none') ||
                     (state.viewMode === ViewMode.Tablet && node.styles.tablet?.display === 'none') ||
                     (node.styles.desktop?.display === 'none');

    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentClasses = node.classNames || [];
        let newClasses;
        if (currentClasses.includes('hidden')) {
            newClasses = currentClasses.filter(c => c !== 'hidden');
        } else {
            newClasses = [...currentClasses, 'hidden'];
        }
        dispatch({ type: 'UPDATE_ELEMENT_CLASSES', payload: { elementId: node.id, classNames: newClasses }});
        dispatch({ type: 'ADD_HISTORY' });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this element?')) {
            dispatch({ type: 'SET_SELECTED_ELEMENT', payload: node.id }); // Select first to target
            dispatch({ type: 'DELETE_ELEMENT' });
            dispatch({ type: 'ADD_HISTORY' });
        }
    };
    
    const handleZIndexChange = (increment: number) => {
        const currentZIndexStr = (node.styles[state.viewMode]?.zIndex || node.styles.desktop?.zIndex || '0') as string;
        let currentZIndex = parseInt(currentZIndexStr);
        if (isNaN(currentZIndex)) currentZIndex = 0; // Default to 0 if not a number

        const newZIndex = currentZIndex + increment;
        
        dispatch({ 
            type: 'UPDATE_ELEMENT_STYLE', 
            payload: { 
                elementId: node.id, 
                property: 'zIndex', 
                value: String(newZIndex), 
                viewMode: state.viewMode 
            } 
        });
        dispatch({ type: 'ADD_HISTORY' });
    };

    // --- DRAG & DROP LOGIC ---

    const handleDragStart = (e: DragEvent) => {
        e.stopPropagation();
        // Ensure we are dragging a node from the layer panel
        if (typeof node !== 'string') {
            e.dataTransfer.setData('application/json', JSON.stringify({ layerId: node.id }));
            e.dataTransfer.effectAllowed = 'move';
            dispatch({ type: 'SET_IS_DRAGGING', payload: true });
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!state.isDragging) return; // Only show indicators if something is actively being dragged

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        // Zones: Top 25% (Before), Bottom 25% (After), Middle 50% (Inside - if container)
        if (y < height * 0.25) {
            setDropPosition('before');
        } else if (y > height * 0.75) {
            setDropPosition('after');
        } else if (isContainer) {
            setDropPosition('inside');
        } else {
            setDropPosition('after'); // Default for non-containers in middle
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropPosition('none');
        dispatch({ type: 'CLEAR_DRAG_STATE' });

        const data = e.dataTransfer.getData('application/json');
        if (!data) return;

        try {
            const parsed = JSON.parse(data);
            const targetElementId = node.id;
            const position = dropPosition;

            if (parsed.layerId) {
                // --- MOVE EXISTING ELEMENT FROM LAYER PANEL ---
                if (parsed.layerId === targetElementId) return; // Ignore self-drop

                dispatch({ 
                    type: 'MOVE_ELEMENT', 
                    payload: { 
                        elementId: parsed.layerId, 
                        targetId: targetElementId, 
                        position: position as 'before' | 'after' | 'inside' 
                    } 
                });
            } else if (parsed.id) {
                // --- ADD NEW COMPONENT FROM COMPONENTS PANEL ---
                const customComp = state.components.find(c => c.id === parsed.id);
                const systemComp = getSystemComponentById(parsed.id);
                const comp = customComp || systemComp;

                if (comp) {
                    let elementContent: BuilderElementNode;
                    // System components might have content as string HTML, parse it.
                    if (typeof comp.content === 'string') {
                        const parsedHtml = htmlToJson(comp.content);
                        if (parsedHtml.length > 0) {
                            elementContent = parsedHtml[0]; // Assume single root node for component content
                        } else {
                            console.warn("Component content could not be parsed to a BuilderElementNode:", comp.content);
                            return;
                        }
                    } else {
                        elementContent = comp.content;
                    }
                    
                    // Deep copy to ensure unique IDs for new instances
                    const newElement = JSON.parse(JSON.stringify(elementContent));

                    dispatch({ 
                        type: 'ADD_ELEMENT', 
                        payload: { 
                            targetId: targetElementId, 
                            mode: position as 'before' | 'after' | 'inside', 
                            element: newElement 
                        } 
                    });
                }
            }
            dispatch({ type: 'ADD_HISTORY' }); // Add history after successful operation
        } catch (err) {
            console.error("Layer drop failed", err);
        }
    };

    const dropIndicatorClass = (pos: typeof dropPosition) => {
        switch (pos) {
          case 'before':
            return 'absolute top-0 left-0 right-0 h-1 bg-blue-500 z-50 pointer-events-none animate-pulse-line';
          case 'after':
            return 'absolute bottom-0 left-0 right-0 h-1 bg-blue-500 z-50 pointer-events-none animate-pulse-line';
          case 'inside':
            return 'bg-blue-50 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-500'; 
          default:
            return '';
        }
    };

    return (
        <div className="select-none">
            <div 
                ref={itemRef}
                draggable={typeof node !== 'string'} // Only allow dragging BuilderElementNodes
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={() => setDropPosition('none')}
                onDrop={handleDrop}
                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_SELECTED_ELEMENT', payload: node.id }); }}
                onContextMenu={(e) => { e.preventDefault(); dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, elementId: node.id } }); }}
                className={`
                    group relative flex items-center py-1.5 pr-2 transition-colors text-sm border-l-2
                    ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40 border-l-blue-600' : 'border-l-transparent hover:bg-gray-100 dark:hover:bg-slate-800'}
                    ${dropPosition === 'inside' ? dropIndicatorClass('inside') : ''}
                    ${state.isDragging && state.selectedElementId === node.id ? 'opacity-50' : ''}
                    cursor-grab active:cursor-grabbing
                `}
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
                data-element-id={node.id}
                data-drop-position={dropPosition !== 'none' ? dropPosition : undefined}
            >
                {dropPosition === 'before' && <div className={dropIndicatorClass('before')} />}
                {dropPosition === 'after' && <div className={dropIndicatorClass('after')} />}

                {/* Expander Arrow */}
                <div 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className={`p-0.5 rounded mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${hasChildren ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </div>

                {/* Icon */}
                <div className="mr-2 opacity-80">{getElementIcon(node)}</div>

                {/* Label */}
                <span className={`text-xs font-medium truncate flex-grow ${isSelected ? 'text-blue-700 dark:text-blue-200' : 'text-slate-700 dark:text-slate-300'}`}>
                    {node.attributes['data-name'] || node.tag}
                    {node.id && <span className="ml-1.5 text-[9px] font-mono text-slate-400 font-normal opacity-50">#{node.id.split('-').pop()}</span>}
                </span>

                {/* Hover Actions */}
                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSelected && ( // Z-index controls visible only when selected
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleZIndexChange(1); }} 
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                                title="Increase z-index"
                            >
                                <ChevronUp size={10} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleZIndexChange(-1); }} 
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                                title="Decrease z-index"
                            >
                                <ChevronDownIcon size={10} />
                            </button>
                        </>
                    )}
                    <button onClick={handleToggleVisibility} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500">
                        {isHidden ? <EyeOff size={10} /> : <Eye size={10} />}
                    </button>
                    <button onClick={handleDelete} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500">
                        <Trash2 size={10} />
                    </button>
                </div>
            </div>

            {/* Recursive Children */}
            {hasChildren && isExpanded && (
                <div className="relative">
                    {/* Vertical Guide Line */}
                    <div 
                        className="absolute bottom-0 border-l border-slate-200 dark:border-slate-700 pointer-events-none"
                        style={{ left: `${depth * 12 + 11}px`, top: '0px' }}
                    />
                    {node.children.map((child, i) => (
                        <LayerItem 
                            key={typeof child === 'string' ? i : child.id} 
                            node={child} 
                            depth={depth + 1}
                            index={i}
                            parentId={node.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}