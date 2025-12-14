import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  overlayPos: DOMRect;
}

export default function GridVisualizer({ iframeRef, overlayPos }: Props) {
  const { state, dispatch } = useEditor();
  const { selectedElementId } = state;
  const [activeGridId, setActiveGridId] = useState<string | null>(null);

  // Memoize grid data calculation to prevent flickering, but depend on DOM updates via ResizeObserver in parent
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

    // 3. Parse Grid Definition
    const parseTracks = (value: string) => {
        if (!value || value === 'none') return [];
        // Tracks are computed to pixels by the browser (e.g. "100px 200px")
        // We use a regex to split spaces safely
        return value.split(/\s+/).map(v => parseFloat(v));
    };

    const colGap = parseFloat(computed.columnGap) || 0;
    const rowGap = parseFloat(computed.rowGap) || 0;
    
    const cols = parseTracks(computed.gridTemplateColumns);
    const rows = parseTracks(computed.gridTemplateRows);

    // 4. Calculate Offset relative to the SelectionOverlay wrapper
    // The SelectionOverlay is positioned on top of the *selected element* (el).
    // If we are visualizing the *parent*, we need to offset our drawing.
    // However, in SelectionOverlay.view.tsx, overlayPos is passed down. 
    // We render absolute to the *document* or relative to the overlay?
    // Let's render absolute relative to the overlay wrapper which is at `overlayPos`.
    
    // Wait, the parent SelectionOverlay wrapper has top/left set to overlayPos.
    // If targetGrid !== el, we need to calculate the difference.
    const offsetX = targetRect.left - overlayPos.left;
    const offsetY = targetRect.top - overlayPos.top;

    return { 
        cols, rows, colGap, rowGap, 
        offsetX, offsetY, 
        width: targetRect.width, 
        height: targetRect.height,
        paddingLeft: parseFloat(computed.paddingLeft) || 0,
        paddingTop: parseFloat(computed.paddingTop) || 0,
        targetId: tId
    };
  }, [selectedElementId, iframeRef, overlayPos, activeGridId, state.pages]); // Re-calc when content changes

  // --- DRAG LOGIC (Column Resizing) ---
  const handleRef = useRef<{ index: number, startX: number, startWidth: number } | null>(null);

  const onHandleMouseDown = (e: React.MouseEvent, index: number) => {
      if (!gridData || !activeGridId) return;
      e.preventDefault();
      e.stopPropagation();
      
      handleRef.current = {
          index,
          startX: e.clientX,
          startWidth: gridData.cols[index]
      };
      
      document.body.style.cursor = 'col-resize';
      
      const onMove = (moveEvent: MouseEvent) => {
          if (!handleRef.current || !activeGridId) return;
          const { startX, startWidth } = handleRef.current;
          const delta = moveEvent.clientX - startX;
          const newWidth = Math.max(10, Math.round(startWidth + delta));

          // Construct new template string using pixels for the dragged column
          // We must map ALL columns to pixels to maintain structure during drag
          const newCols = [...gridData.cols];
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

  const { cols, rows, colGap, rowGap, offsetX, offsetY, width, height, paddingLeft, paddingTop } = gridData;

  // Render Vertical Lines (Columns)
  const renderVerticalLines = () => {
    let currentX = paddingLeft;
    return cols.map((trackWidth, i) => {
        const els = [];
        
        // Column Box (Transparent) - Optional: could highlight on hover
        // els.push(<div className="absolute top-0 bottom-0 bg-blue-500/5" style={{ left: currentX, width: trackWidth }} />);

        // Track End Line (Right side of column)
        const lineLeft = currentX + trackWidth;
        
        els.push(
            <div key={`c-line-${i}`} className="absolute top-0 bottom-0 border-r border-dashed border-indigo-400/50 pointer-events-none z-10" style={{ left: lineLeft }} />
        );

        // RESIZE HANDLE
        // We place a handle at the end of the column.
        if (i < cols.length) { // Allow resizing all columns for now
             els.push(
                 <div
                    key={`h-${i}`}
                    onMouseDown={(e) => onHandleMouseDown(e, i)}
                    className="absolute top-0 bottom-0 w-4 cursor-col-resize z-50 flex flex-col justify-center items-center group pointer-events-auto hover:bg-indigo-500/10 transition-colors"
                    style={{ left: lineLeft - 2 }} // Centered on the line
                    title={`Resize Column ${i + 1}`}
                 >
                     <div className="w-1 h-6 bg-indigo-400 group-hover:bg-indigo-600 rounded-full shadow-sm" />
                 </div>
             );
        }

        currentX += trackWidth;

        // Render Gap Area
        if (i < cols.length - 1 && colGap > 0) {
             els.push(
                <div key={`c-gap-${i}`} className="absolute top-0 bottom-0 bg-yellow-400/10 hatch-pattern pointer-events-none border-l border-r border-transparent" style={{ left: lineLeft, width: colGap }} />
             );
             currentX += colGap;
        }

        return els;
    });
  };

  // Render Horizontal Lines (Rows) - Visualization only, no resize yet
  const renderHorizontalLines = () => {
    let currentY = paddingTop;
    return rows.map((trackHeight, i) => {
        const els = [];
        
        // Track End Line
        const lineTop = currentY + trackHeight;
        
        els.push(
            <div key={`r-line-${i}`} className="absolute left-0 right-0 border-b border-dashed border-indigo-400/50 pointer-events-none z-10" style={{ top: lineTop }} />
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
            outline: '1px dashed rgba(99, 102, 241, 0.3)',
            backgroundColor: 'rgba(99, 102, 241, 0.01)'
        }}
    >
        {renderVerticalLines()}
        {renderHorizontalLines()}
        <div className="absolute -top-5 left-0 bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-t font-bold uppercase tracking-wider shadow-sm pointer-events-none">
            Grid System
        </div>
    </div>
  );
}