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
      
      let targetEl = (doc.elementFromPoint(e.clientX, e.clientY) as HTMLElement)?.closest('[data-builder-id]') as HTMLElement;
      
      if (!targetEl) { dispatch({ type: 'SET_DRAG_OVER_STATE', payload: null }); return; }

      const rect = targetEl.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const isContainer = CONTAINER_TAGS.includes(targetEl.tagName.toLowerCase());
      
      let gridContainerEl: HTMLElement | null = null;
      let isGrid = false;

      // --- CORRECCIÓN CRÍTICA AQUÍ ---
      // Si el elemento actual NO es grid, revisamos si su PADRE inmediato es grid.
      const targetElComputed = doc.defaultView?.getComputedStyle(targetEl);
      if (targetElComputed?.display === 'grid') {
          gridContainerEl = targetEl;
          isGrid = true;
      } else if (targetEl.parentElement) {
          const parent = targetEl.parentElement;
          const parentComputed = doc.defaultView?.getComputedStyle(parent);
          if (parentComputed?.display === 'grid') {
              gridContainerEl = parent;
              isGrid = true;
          }
      }
      // --------------------------------

      // Still need original target's computed for padding/margins in standard logic if it's not a grid.
      // If a gridContainerEl was found, use its computed styles for grid properties.
      const computed = doc.defaultView?.getComputedStyle(targetEl); 
      
      // Thresholds
      const threshold = isContainer ? rect.height * 0.25 : rect.height * 0.5;

      let mode: 'before' | 'after' | 'inside' = 'after';
      let indicatorStyle: CSSProperties = {};
      let gridCells: GridCell[] = [];
      let activeCell: GridCell | null = null;
      let finalTargetId = targetEl.dataset.builderId!;

      // --- GRID SNAPPING LOGIC ---
      if (isGrid && gridContainerEl) {
          mode = 'inside';
          finalTargetId = gridContainerEl.dataset.builderId!; // Target is now the grid container

          const gridComputed = doc.defaultView?.getComputedStyle(gridContainerEl);
          const gridRect = gridContainerEl.getBoundingClientRect();

          const parseTracks = (val: string) => {
              if (!val || val === 'none') return [];
              return val.split(/\s+/).map(v => parseFloat(v));
          };

          const colTracks = parseTracks(gridComputed.gridTemplateColumns);
          const rowTracks = parseTracks(gridComputed.gridTemplateRows);
          const colGap = parseFloat(gridComputed.columnGap) || 0;
          const rowGap = parseFloat(gridComputed.rowGap) || 0;

          const borderLeft = parseFloat(gridComputed.borderLeftWidth) || 0;
          const borderTop = parseFloat(gridComputed.borderTopWidth) || 0;
          const paddingLeft = parseFloat(gridComputed.paddingLeft) || 0;
          const paddingTop = parseFloat(gridComputed.paddingTop) || 0;

          const startX = gridRect.left + borderLeft + paddingLeft;
          const startY = gridRect.top + borderTop + paddingTop;

          let currentY = startY;
          
          for(let r = 0; r < rowTracks.length; r++) {
              const h = rowTracks[r];
              let currentX = startX;
              
              for(let c = 0; c < colTracks.length; c++) {
                  const w = colTracks[c];
                  
                  // This is the actual renderable cell area, excluding gaps.
                  const cellRect = {
                      x: currentX,
                      y: currentY,
                      width: w,
                      height: h,
                  };

                  gridCells.push({
                      ...cellRect,
                      rowIndex: r + 1, // CSS Grid is 1-based
                      colIndex: c + 1
                  });
                  
                  currentX += w + colGap;
              }
              currentY += h + rowGap;
          }

          // Match mouse position to cell
          const matchedCell = gridCells.find(cell => 
              mouseX >= cell.x && mouseX <= cell.x + cell.width &&
              mouseY >= cell.y && mouseY <= cell.y + cell.height
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
               // Fallback if hovering gap or padding, highlight the whole grid container lightly
               indicatorStyle = { top: gridRect.top, left: gridRect.left, width: gridRect.width, height: gridRect.height, outline: '2px solid #3b82f6', outlineOffset: '-1px', zIndex: 50, backgroundColor: 'rgba(59, 130, 246, 0.05)' };
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

      // Calculate Smart Guides (Red lines) using the original targetEl
      const { guides, containerHighlight } = calculateSnapping(rect, targetEl, doc);
      
      dispatch({ type: 'SET_DRAG_OVER_STATE', payload: { targetId: finalTargetId, mode, indicatorStyle, guides, containerHighlight, gridCells, activeCell } });
  };
  
  const throttledDragOver = throttle(handleDragOver, 60);

  return throttledDragOver;
};