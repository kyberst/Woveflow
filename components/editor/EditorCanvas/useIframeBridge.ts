import { useRef, useEffect, CSSProperties } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { throttle } from '../../../utils/throttle';
import { getSystemComponentById } from '../../../services/componentRegistry';
import { calculateSnapping } from '../../../utils/snapUtils';
import { htmlToJson } from '../../../utils/htmlToJson';

const CONTAINER_TAGS = ['div', 'section', 'main', 'header', 'footer', 'article', 'aside', 'form', 'ul', 'ol', 'nav'];

export const useIframeBridge = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { state, dispatch } = useEditor();
  const { currentPageId, pages, components } = state;

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current?.contentDocument) {
        const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [state.selectedElementId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (!state.dragOverState) return;
      const data = e.dataTransfer?.getData('application/json');
      if (!data) return;
      
      try {
        const parsed = JSON.parse(data);
        const { targetId, mode } = state.dragOverState;
        
        if (parsed.layerId) {
             dispatch({ type: 'MOVE_ELEMENT', payload: { elementId: parsed.layerId, targetId, position: mode } });
        } else if (parsed.id) {
            // Check custom components first, then system components via Registry
            const customComp = components.find(c => c.id === parsed.id);
            const systemComp = getSystemComponentById(parsed.id);
            const comp = customComp || systemComp;

            if (comp) {
                const content = typeof comp.content === 'string' 
                    ? htmlToJson(comp.content as string)[0] 
                    : comp.content;

                dispatch({ type: 'ADD_ELEMENT', payload: { targetId, mode, element: JSON.parse(JSON.stringify(content)) } });
            }
        }
        dispatch({ type: 'ADD_HISTORY' });
      } catch (error) { console.error('Drop Error', error); }
      dispatch({ type: 'CLEAR_DRAG_STATE' });
    };

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
    const handleDragLeave = () => {}; 
    const onClick = (e: MouseEvent) => {
      dispatch({ type: 'HIDE_CONTEXT_MENU' });
      e.stopPropagation();
      const id = (e.target as HTMLElement).closest('[data-builder-id]')?.getAttribute('data-builder-id');
      dispatch({ type: 'SET_SELECTED_ELEMENT', payload: id || null });
    };

    const handleLoad = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      doc.body.addEventListener('dragover', throttledDragOver);
      doc.body.addEventListener('dragleave', handleDragLeave);
      doc.body.addEventListener('drop', onDrop);
      doc.body.addEventListener('click', onClick);
    };

    iframe.addEventListener('load', handleLoad);
    if(iframe.contentDocument?.readyState === 'complete') handleLoad();

    return () => {
       iframe.removeEventListener('load', handleLoad);
       const doc = iframe.contentDocument;
       if (doc) {
         doc.body.removeEventListener('dragover', throttledDragOver);
         doc.body.removeEventListener('drop', onDrop);
         doc.body.removeEventListener('click', onClick);
       }
    };
  }, [currentPageId, dispatch, pages, components, state.isDragging]);

  return iframeRef;
};