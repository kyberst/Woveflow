import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  overlayPos: DOMRect;
}

export default function GridVisualizer({ iframeRef, overlayPos }: Props) {
  const { state, dispatch } = useEditor();
  const { selectedElementId } = state;
  const [parentId, setParentId] = useState<string | null>(null);

  const gridData = useMemo(() => {
    if (!selectedElementId || !iframeRef.current?.contentDocument) return null;
    
    // 1. Find the selected element in the DOM
    const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${selectedElementId}"]`) as HTMLElement;
    if (!el || !el.parentElement) return null;

    // 2. Check the Parent
    const parent = el.parentElement;
    // Store parent ID for actions
    const pId = parent.getAttribute('data-builder-id');
    if (pId !== parentId) setParentId(pId);

    const computed = getComputedStyle(parent);
    
    if (computed.display !== 'grid') return null;

    // 3. Get Parent Dimensions & Position relative to viewport (iframe)
    const parentRect = parent.getBoundingClientRect();

    // 4. Parse Grid Definition
    const parseTracks = (value: string) => {
        if (!value || value === 'none') return [];
        return value.split(/\s+/).map(v => parseFloat(v));
    };

    const colGap = parseFloat(computed.columnGap) || 0;
    const rowGap = parseFloat(computed.rowGap) || 0;
    
    const cols = parseTracks(computed.gridTemplateColumns);
    const rows = parseTracks(computed.gridTemplateRows);

    // 5. Calculate Offset relative to the Child (Overlay Wrapper)
    const offsetX = parentRect.left - overlayPos.left;
    const offsetY = parentRect.top - overlayPos.top;

    return { 
        cols, rows, colGap, rowGap, 
        offsetX, offsetY, 
        width: parentRect.width, 
        height: parentRect.height,
        paddingLeft: parseFloat(computed.paddingLeft) || 0,
        paddingTop: parseFloat(computed.paddingTop) || 0,
        fullTemplate: computed.gridTemplateColumns // Pass full string for reconstruction if needed
    };
  }, [selectedElementId, iframeRef, overlayPos, parentId]); // Added parentId to dependency to avoid loops, handled by set check

  // --- DRAG LOGIC ---
  const handleRef = useRef<{ index: number, startX: number, startWidth: number } | null>(null);

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!handleRef.current || !parentId || !gridData) return;
          
          const { index, startX, startWidth } = handleRef.current;
          const delta = e.clientX - startX;
          const newWidth = Math.max(10, startWidth + delta); // Min 10px

          // Construct new template string
          // We use the pixel values derived from computed style to ensure smooth dragging
          const newCols = [...gridData.cols];
          newCols[index] = newWidth;
          
          const newTemplate = newCols.map(c => `${c}px`).join(' ');

          dispatch({ 
              type: 'UPDATE_ELEMENT_STYLE', // Using generic style update for full string replacement
              payload: { 
                  elementId: parentId, 
                  property: 'gridTemplateColumns', 
                  value: newTemplate,
                  viewMode: state.viewMode 
              } 
          });
      };

      const handleMouseUp = () => {
          if (handleRef.current) {
              dispatch({ type: 'ADD_HISTORY' });
              handleRef.current = null;
              document.body.style.cursor = 'default';
          }
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };

      if (handleRef.current) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [handleRef.current]); // Relying on ref presence isn't enough for effect triggering, logic moved to event handlers below

  const onHandleMouseDown = (e: React.MouseEvent, index: number) => {
      if (!gridData) return;
      e.preventDefault();
      e.stopPropagation();
      
      handleRef.current = {
          index,
          startX: e.clientX,
          startWidth: gridData.cols[index]
      };
      
      document.body.style.cursor = 'col-resize';
      
      // Attach listeners manually here to ensure closure has latest state if needed, 
      // but standard React pattern uses useEffect. 
      // For performance in high-frequency drag, direct listener attachment is often cleaner.
      
      const onMove = (moveEvent: MouseEvent) => {
          if (!handleRef.current || !parentId) return;
          const { startX, startWidth } = handleRef.current;
          const delta = moveEvent.clientX - startX;
          const newWidth = Math.max(10, Math.round(startWidth + delta));

          // Create the full string manually to update state
          const newCols = [...gridData.cols];
          newCols[index] = newWidth;
          const newTemplate = newCols.map(c => `${c}px`).join(' ');

          dispatch({ 
              type: 'UPDATE_ELEMENT_STYLE', 
              payload: { 
                  elementId: parentId, 
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
        
        // Track Start
        els.push(
            <div key={`c-${i}`} className="absolute top-0 bottom-0 border-l border-dashed border-indigo-400/30" style={{ left: currentX }} />
        );
        
        // Track End
        els.push(
            <div key={`c-e-${i}`} className="absolute top-0 bottom-0 border-r border-dashed border-indigo-400/30" style={{ left: currentX + trackWidth }} />
        );

        // RESIZE HANDLE (Right side of column)
        // Only render if it's not the last line of the container (unless we want to resize the container itself, but usually grid resize is internal tracks)
        // Actually, CSS Grid tracks define the layout. Dragging the line between Col 1 and Col 2 resizes Col 1.
        if (i < cols.length - 1 || (i === cols.length - 1 && cols.length > 0)) {
             els.push(
                 <div
                    key={`h-${i}`}
                    onMouseDown={(e) => onHandleMouseDown(e, i)}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-8 cursor-col-resize z-50 flex items-center justify-center group pointer-events-auto"
                    style={{ left: currentX + trackWidth - 2 }} // Center over the line
                 >
                     <div className="w-1.5 h-6 bg-white border border-indigo-500 rounded-full shadow-md group-hover:bg-indigo-500 transition-colors" />
                 </div>
             );
        }

        currentX += trackWidth;

        // Gap
        if (i < cols.length - 1 && colGap > 0) {
             els.push(
                <div key={`c-g-${i}`} className="absolute top-0 bottom-0 bg-yellow-400/10 hatch-pattern" style={{ left: currentX, width: colGap }} />
             );
             currentX += colGap;
        }

        return els;
    });
  };

  // Render Horizontal Lines (Rows)
  const renderHorizontalLines = () => {
    let currentY = paddingTop;
    return rows.map((trackHeight, i) => {
        const els = [];
        
        // Track Body
        els.push(
            <div key={`r-${i}`} className="absolute left-0 right-0 border-t border-dashed border-indigo-400/30" style={{ top: currentY }} />
        );
        els.push(
            <div key={`r-e-${i}`} className="absolute left-0 right-0 border-b border-dashed border-indigo-400/30" style={{ top: currentY + trackHeight }} />
        );
        
        currentY += trackHeight;

        // Gap
        if (i < rows.length - 1 && rowGap > 0) {
             els.push(
                <div key={`r-g-${i}`} className="absolute left-0 right-0 bg-yellow-400/10 hatch-pattern" style={{ top: currentY, height: rowGap }} />
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
            outline: '1px dashed rgba(99, 102, 241, 0.5)',
            backgroundColor: 'rgba(99, 102, 241, 0.02)'
        }}
    >
        {renderVerticalLines()}
        {renderHorizontalLines()}
        <div className="absolute -top-5 left-0 bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-t font-bold uppercase tracking-wider shadow-sm pointer-events-none">
            Parent Grid
        </div>
    </div>
  );
}