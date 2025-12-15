import { DragEvent, CSSProperties } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { throttle } from '../../../../utils/throttle';
import { calculateSnapping } from '../../../../utils/snapUtils';
import { CONTAINER_TAGS } from '../../../../constants';
import { GridCell } from '../../../../types';

export const useIframeDragOver = (iframeRef: React.RefObject<HTMLIFrameElement>) => {
  const { dispatch } = useEditor();

  const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const targetEl = (doc.elementFromPoint(e.clientX, e.clientY) as HTMLElement)?.closest('[data-builder-id]') as HTMLElement;
      
      if (!targetEl) { dispatch({ type: 'SET_DRAG_OVER_STATE', payload: null }); return; }

      const rect = targetEl.getBoundingClientRect();
      const y = e.clientY - rect.top;
      // const x = e.clientX - rect.left; // Not strictly used if we use viewport coords for matching
      const isContainer = CONTAINER_TAGS.includes(targetEl.tagName.toLowerCase());
      const computed = doc.defaultView?.getComputedStyle(targetEl);
      const isGrid = computed?.display === 'grid';
      
      // Thresholds
      const threshold = isContainer ? rect.height * 0.25 : rect.height * 0.5;

      let mode: 'before' | 'after' | 'inside' = 'after';
      let indicatorStyle: CSSProperties = {};
      let gridCells: GridCell[] = [];
      let activeCell: GridCell | null = null;

      // --- GRID SNAPPING LOGIC ---
      if (isContainer && isGrid) {
          mode = 'inside';
          
          // Parse grid tracks (handling 'none' or space-separated pixel values)
          const parseTracks = (val: string) => {
              if (!val || val === 'none') return [];
              // Simple split by space, computed styles usually return "px" values separated by spaces
              return val.split(/\s+/).map(v => parseFloat(v));
          };

          const colTracks = parseTracks(computed.gridTemplateColumns);
          const rowTracks = parseTracks(computed.gridTemplateRows);
          const colGap = parseFloat(computed.columnGap) || 0;
          const rowGap = parseFloat(computed.rowGap) || 0;

          // Offsets for content box relative to the element's bounding box
          const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
          const borderTop = parseFloat(computed.borderTopWidth) || 0;
          const paddingLeft = parseFloat(computed.paddingLeft) || 0;
          const paddingTop = parseFloat(computed.paddingTop) || 0;

          // Starting coordinate relative to viewport (using rect)
          const startX = rect.left + borderLeft + paddingLeft;
          const startY = rect.top + borderTop + paddingTop;

          let currentY = startY;
          
          // Calculate all cells
          for(let r = 0; r < rowTracks.length; r++) {
              const h = rowTracks[r];
              let currentX = startX;
              
              for(let c = 0; c < colTracks.length; c++) {
                  const w = colTracks[c];
                  
                  gridCells.push({
                      x: currentX,
                      y: currentY,
                      width: w,
                      height: h,
                      rowIndex: r + 1, // CSS Grid is 1-based
                      colIndex: c + 1
                  });
                  
                  currentX += w + colGap;
              }
              currentY += h + rowGap;
          }

          // Match mouse position to cell
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const matchedCell = gridCells.find(cell => 
              mouseX >= cell.x && mouseX <= cell.x + cell.width + (colGap/2) && // approximate gap inclusion
              mouseY >= cell.y && mouseY <= cell.y + cell.height + (rowGap/2)
          );

          if (matchedCell) {
               activeCell = matchedCell;
               // Snap indicator to the grid cell
               indicatorStyle = { 
                   top: matchedCell.y, 
                   left: matchedCell.x, 
                   width: matchedCell.width, 
                   height: matchedCell.height, 
                   outline: '2px dashed #3b82f6', 
                   backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                   zIndex: 50 
               };
          } else {
               // Fallback if hovering gap or padding
               indicatorStyle = { top: rect.top, left: rect.left, width: rect.width, height: rect.height, outline: '2px solid #3b82f6', outlineOffset: '-1px', zIndex: 50 };
          }

      } 
      // --- STANDARD CONTAINER LOGIC ---
      else if (isContainer && y > threshold && y < rect.height - threshold) {
          mode = 'inside';
          indicatorStyle = { top: rect.top, left: rect.left, width: rect.width, height: rect.height, outline: '2px solid #3b82f6', outlineOffset: '-1px', zIndex: 50 };
      } 
      // --- SIBLING INSERTION LOGIC ---
      else {
          mode = y < rect.height / 2 ? 'before' : 'after';
          indicatorStyle = { top: mode === 'before' ? rect.top : rect.bottom, left: rect.left, width: rect.width, height: '4px' };
      }

      // Calculate Smart Guides (Red lines)
      const { guides, containerHighlight } = calculateSnapping(rect, targetEl, doc);
      
      dispatch({ type: 'SET_DRAG_OVER_STATE', payload: { targetId: targetEl.dataset.builderId!, mode, indicatorStyle, guides, containerHighlight, gridCells, activeCell } });
  };
  
  const throttledDragOver = throttle(handleDragOver, 60);

  return throttledDragOver;
};