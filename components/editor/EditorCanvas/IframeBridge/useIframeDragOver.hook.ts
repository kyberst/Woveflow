import { DragEvent, CSSProperties } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { throttle } from '../../../../utils/throttle';
import { calculateSnapping } from '../../../../utils/snapUtils';
import { CONTAINER_TAGS } from '../../../../constants';

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
      const x = e.clientX - rect.left;
      const isContainer = CONTAINER_TAGS.includes(targetEl.tagName.toLowerCase());
      const computed = doc.defaultView?.getComputedStyle(targetEl);
      const isGrid = computed?.display === 'grid';
      
      // Thresholds
      const threshold = isContainer ? rect.height * 0.25 : rect.height * 0.5;

      let mode: 'before' | 'after' | 'inside' = 'after';
      let indicatorStyle: CSSProperties = {};

      // --- GRID SNAPPING LOGIC ---
      if (isContainer && isGrid) {
          mode = 'inside';
          
          // Parse grid tracks (handling 'none' or space-separated pixel values)
          const parseTracks = (val: string) => val === 'none' ? [] : val.split(' ').map(parseFloat);
          const colTracks = parseTracks(computed.gridTemplateColumns);
          const rowTracks = parseTracks(computed.gridTemplateRows);
          const colGap = parseFloat(computed.columnGap) || 0;
          const rowGap = parseFloat(computed.rowGap) || 0;

          // Offsets for content box
          const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
          const borderTop = parseFloat(computed.borderTopWidth) || 0;
          const paddingLeft = parseFloat(computed.paddingLeft) || 0;
          const paddingTop = parseFloat(computed.paddingTop) || 0;

          let trackX = borderLeft + paddingLeft;
          let trackY = borderTop + paddingTop;
          
          let cellX = trackX;
          let cellY = trackY;
          let cellW = 0;
          let cellH = 0;
          let matched = false;

          // Find matching Column
          for(let i = 0; i < colTracks.length; i++) {
              const w = colTracks[i];
              if (x >= trackX && x <= trackX + w + colGap) {
                  cellX = trackX;
                  cellW = w;
                  // Find matching Row inside this column
                  for(let j = 0; j < rowTracks.length; j++) {
                      const h = rowTracks[j];
                      if (y >= trackY && y <= trackY + h + rowGap) {
                          cellY = trackY;
                          cellH = h;
                          matched = true;
                          break;
                      }
                      trackY += h + rowGap;
                  }
                  break;
              }
              trackX += w + colGap;
          }

          if (matched) {
               // Snap indicator to the grid cell
               indicatorStyle = { 
                   top: rect.top + cellY, 
                   left: rect.left + cellX, 
                   width: cellW, 
                   height: cellH, 
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
      
      dispatch({ type: 'SET_DRAG_OVER_STATE', payload: { targetId: targetEl.dataset.builderId!, mode, indicatorStyle, guides, containerHighlight } });
  };
  
  const throttledDragOver = throttle(handleDragOver, 60);

  return throttledDragOver;
};