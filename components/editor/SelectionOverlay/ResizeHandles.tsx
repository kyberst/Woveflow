import React from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props {
  overlayPos: DOMRect;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

type HandleDirection = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

const handlePositions: Record<HandleDirection, { top?: string; bottom?: string; left?: string; right?: string; cursor: string }> = {
  n:  { top: '-4px', left: '50%', cursor: 'ns-resize' },
  s:  { bottom: '-4px', left: '50%', cursor: 'ns-resize' },
  e:  { top: '50%', right: '-4px', cursor: 'ew-resize' },
  w:  { top: '50%', left: '-4px', cursor: 'ew-resize' },
  nw: { top: '-4px', left: '-4px', cursor: 'nwse-resize' },
  ne: { top: '-4px', right: '-4px', cursor: 'nesw-resize' },
  sw: { bottom: '-4px', left: '-4px', cursor: 'nesw-resize' },
  se: { bottom: '-4px', right: '-4px', cursor: 'nwse-resize' },
};

export default function ResizeHandles({ overlayPos, iframeRef }: Props) {
  const { state, dispatch } = useEditor();

  const handleMouseDown = (e: React.MouseEvent, direction: HandleDirection) => {
    e.preventDefault();
    e.stopPropagation();

    if (!state.selectedElementId) return;

    // --- GRID DETECTION LOGIC ---
    let isGridChild = false;
    let gridColWidth = 0; // approximate
    let gridGap = 0;
    
    if (iframeRef.current?.contentDocument) {
        const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${state.selectedElementId}"]`) as HTMLElement;
        const parent = el?.parentElement;
        if (parent) {
            const computed = getComputedStyle(parent);
            if (computed.display === 'grid') {
                isGridChild = true;
                const gap = parseFloat(computed.columnGap) || 0;
                gridGap = gap;
                const parentWidth = parent.getBoundingClientRect().width;
                // Heuristic: Estimate column width based on uniform assumption or splitting tracks
                const tracks = computed.gridTemplateColumns.split(' ').length;
                if (tracks > 0) {
                    gridColWidth = (parentWidth - (gap * (tracks - 1))) / tracks;
                }
            }
        }
    }
    // ----------------------------

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = overlayPos.width;
    const startHeight = overlayPos.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) newWidth = startWidth + (moveEvent.clientX - startX);
      if (direction.includes('w')) newWidth = startWidth - (moveEvent.clientX - startX);
      if (direction.includes('s')) newHeight = startHeight + (moveEvent.clientY - startY);
      if (direction.includes('n')) newHeight = startHeight - (moveEvent.clientY - startY);

      // --- GRID SNAP LOGIC ---
      if (isGridChild && (direction === 'e' || direction === 'w') && gridColWidth > 0) {
          // Calculate span based on width
          const rawSpan = Math.round(newWidth / (gridColWidth + gridGap));
          const safeSpan = Math.max(1, rawSpan); // Minimum 1 column
          
          dispatch({ 
              type: 'UPDATE_CHILD_SPAN', 
              payload: { 
                  elementId: state.selectedElementId!, 
                  property: 'gridColumn', 
                  value: `span ${safeSpan}`, 
                  viewMode: state.viewMode 
              } 
          });
          // Do not update width/height style when handling grid span
          return;
      }
      // -----------------------

      // Normal Pixel Resizing
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId!, property: 'width', value: `${Math.max(10, newWidth)}px`, viewMode: state.viewMode } });
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId!, property: 'height', value: `${Math.max(10, newHeight)}px`, viewMode: state.viewMode } });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dispatch({ type: 'ADD_HISTORY' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {Object.entries(handlePositions).map(([dir, style]) => (
        <div
          key={dir}
          onMouseDown={e => handleMouseDown(e, dir as HandleDirection)}
          className="absolute w-2 h-2 bg-white border border-builder-primary rounded-full pointer-events-auto"
          style={{
            top: style.top,
            left: style.left,
            bottom: style.bottom,
            right: style.right,
            transform: 'translate(-50%, -50%)',
            cursor: style.cursor,
          }}
        />
      ))}
    </>
  );
}