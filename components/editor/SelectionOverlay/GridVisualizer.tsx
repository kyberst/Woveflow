import React, { useMemo, useState, useRef } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { GripVertical } from 'lucide-react';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  overlayPos: DOMRect;
}

export default function GridVisualizer({ iframeRef, overlayPos }: Props) {
  const { state, dispatch } = useEditor();
  const { selectedElementId } = state;
  const [activeGridId, setActiveGridId] = useState<string | null>(null);

  // Memoize grid data calculation to prevent flickering
  const gridData = useMemo(() => {
    if (!selectedElementId || !iframeRef.current?.contentDocument) return null;
    
    // 1. Find the selected element in the DOM
    const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${selectedElementId}"]`) as HTMLElement;
    if (!el) return null;

    let targetGrid: HTMLElement | null = null;
    
    // 2. Determine which element is the Grid
    // Case A: The selected element IS the grid container
    const elComputed = getComputedStyle(el);
    if (elComputed.display === 'grid') {
        targetGrid = el;
    } 
    // Case B: The parent is the grid container (we are selecting a child)
    else if (el.parentElement) {
        const parentComputed = getComputedStyle(el.parentElement);
        if (parentComputed.display === 'grid') {
            targetGrid = el.parentElement;
        }
    }

    if (!targetGrid) return null;

    // Store ID for actions
    const tId = targetGrid.getAttribute('data-builder-id');
    if (tId !== activeGridId) setActiveGridId(tId);

    const computed = getComputedStyle(targetGrid);
    const targetRect = targetGrid.getBoundingClientRect();

    // 3. Parse Grid Definition (Browser returns computed pixels e.g., "100px 200px")
    const parseTracks = (value: string) => {
        if (!value || value === 'none') return [];
        return value.split(/\s+/).map(v => parseFloat(v));
    };

    const colGap = parseFloat(computed.columnGap) || 0;
    const rowGap = parseFloat(computed.rowGap) || 0;
    
    const cols = parseTracks(computed.gridTemplateColumns);
    const rows = parseTracks(computed.gridTemplateRows);

    // 4. Calculate Offset relative to the SelectionOverlay wrapper
    // The SelectionOverlay is positioned on top of the *selected element* (el).
    // We need to draw relative to that overlay position.
    const offsetX = targetRect.left - overlayPos.left;
    const offsetY = targetRect.top - overlayPos.top;

    // These values are now relative to the targetGrid's top-left corner (its own content box)
    const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
    const borderTop = parseFloat(computed.borderTopWidth) || 0;
    const paddingLeft = parseFloat(computed.paddingLeft) || 0;
    const paddingTop = parseFloat(computed.paddingTop) || 0;

    return { 
        cols, rows, colGap, rowGap, 
        offsetX, offsetY, 
        width: targetRect.width, 
        height: targetRect.height,
        initialContentX: borderLeft + paddingLeft, // Start X for content area, relative to targetGrid's border-box top-left
        initialContentY: borderTop + paddingTop, // Start Y for content area, relative to targetGrid's border-box top-left
        targetId: tId
    };
  }, [selectedElementId, iframeRef, overlayPos, activeGridId, state.pages]); // Re-calc when content changes

  // --- DRAG LOGIC (Column Resizing) ---
  const handleRef = useRef<{ index: number, startX: number, startCols: number[] } | null>(null);

  const onHandleMouseDown = (e: React.MouseEvent, index: number) => {
      if (!gridData || !activeGridId) return;
      e.preventDefault();
      e.stopPropagation();
      
      handleRef.current = {
          index,
          startX: e.clientX,
          startCols: [...gridData.cols] // Snapshot current pixel widths
      };
      
      document.body.style.cursor = 'col-resize';
      
      const onMove = (moveEvent: MouseEvent) => {
          if (!handleRef.current || !activeGridId) return;
          const { startX, startCols } = handleRef.current;
          const delta = moveEvent.clientX - startX;
          
          // Calculate new width for the specific column
          const newWidth = Math.max(10, Math.round(startCols[index] + delta));

          // Construct new template string using pixels for ALL columns to maintain stability
          const newCols = [...startCols];
          newCols[index] = newWidth;
          
          const newTemplate = newCols.map(c => `${c}px`).join(' ');

          dispatch({ 
              type: 'UPDATE_ELEMENT_STYLE', 
              payload: { 
                  elementId: activeGridId, 
                  property: 'gridTemplateColumns', 
                  value: newTemplate,
                  viewMode: state.viewMode 
              } 
          });
      };

      const onUp = () => {
          dispatch({ type: 'ADD_HISTORY' });
          handleRef.current = null;
          document.body.style.cursor = '';
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
  };


  if (!gridData) return null;

  const { cols, rows, colGap, rowGap, offsetX, offsetY, width, height, initialContentX, initialContentY } = gridData;

  // Render Vertical Lines (Columns) & Resize Handles
  const renderVerticalLines = () => {
    let currentX = initialContentX; // This is now relative to the GridVisualizer's wrapper (targetGrid's top-left)
    const elements = [];

    // Loop through columns to draw boundaries and handles
    for (let i = 0; i < cols.length; i++) {
        const trackWidth = cols[i];
        
        // The right edge of the current column, relative to the GridVisualizer's wrapper
        const lineLeft = currentX + trackWidth;
        
        // 1. Visual Divider Line
        elements.push(
            <div 
                key={`c-line-${i}`} 
                className="absolute top-0 bottom-0 border-r border-dashed border-indigo-400/30 pointer-events-none z-10" 
                style={{ left: lineLeft }} 
            />
        );

        // 2. Resize Handle (Only if not the very last edge, or if we want to allow resizing the last col width explicitly)
        // Usually grid handles are between columns. 
        // We allow resizing all columns.
        elements.push(
             <div
                key={`h-${i}`}
                onMouseDown={(e) => onHandleMouseDown(e, i)}
                className="absolute top-0 bottom-0 w-4 -ml-2 cursor-col-resize z-50 flex flex-col justify-center items-center group pointer-events-auto hover:bg-indigo-500/10 transition-colors"
                style={{ left: lineLeft }}
                title={`Resize Column ${i + 1} (${Math.round(trackWidth)}px)`}
             >
                 <div className="w-1 h-4 bg-indigo-400 group-hover:bg-indigo-600 rounded-full shadow-sm transition-all group-hover:h-8 group-hover:w-1.5 flex items-center justify-center">
                    <GripVertical size={8} className="text-white opacity-0 group-hover:opacity-100" />
                 </div>
                 
                 {/* Tooltip showing width */}
                 <div className="absolute top-0 mt-2 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(trackWidth)}px
                 </div>
             </div>
        );

        currentX += trackWidth;

        // 3. Gap Visualization
        if (i < cols.length - 1 && colGap > 0) {
             elements.push(
                <div 
                    key={`c-gap-${i}`} 
                    className="absolute top-0 bottom-0 bg-yellow-400/10 hatch-pattern pointer-events-none border-l border-r border-transparent" 
                    style={{ left: lineLeft, width: colGap }} 
                />
             );
             currentX += colGap;
        }
    }
    return elements;
  };

  // Render Horizontal Lines (Rows) - Visualization only
  const renderHorizontalLines = () => {
    let currentY = initialContentY; // This is now relative to the GridVisualizer's wrapper (targetGrid's top-left)
    return rows.map((trackHeight, i) => {
        const els = [];
        
        // The bottom edge of the current row, relative to the GridVisualizer's wrapper
        const lineTop = currentY + trackHeight;
        
        els.push(
            <div key={`r-line-${i}`} className="absolute left-0 right-0 border-b border-dashed border-indigo-400/30 pointer-events-none z-10" style={{ top: lineTop }} />
        );
        
        currentY += trackHeight;

        if (i < rows.length - 1 && rowGap > 0) {
             els.push(
                <div key={`r-gap-${i}`} className="absolute left-0 right-0 bg-yellow-400/10 hatch-pattern pointer-events-none" style={{ top: lineTop, height: rowGap }} />
             );
             currentY += rowGap;
        }

        return els;
    });
  };

  return (
    <div 
        className="absolute pointer-events-none z-0"
        style={{
            top: offsetY,
            left: offsetX,
            width: width,
            height: height,
            // Outline the whole grid container lightly, as requested
            outline: '1px solid rgba(99, 102, 241, 0.5)',
        }}
    >
        {renderVerticalLines()}
        {renderHorizontalLines()}
        
        {/* Grid Label Badge */}
        <div className="absolute -top-5 left-0 bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-t font-bold uppercase tracking-wider shadow-sm pointer-events-none flex items-center">
            Grid
        </div>
    </div>
  );
}