import React from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props {
  overlayPos: DOMRect;
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

export default function ResizeHandles({ overlayPos }: Props) {
  const { state, dispatch } = useEditor();

  const handleMouseDown = (e: React.MouseEvent, direction: HandleDirection) => {
    e.preventDefault();
    e.stopPropagation();

    if (!state.selectedElementId) return;

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

      // FIX: Add the required `viewMode` property to the action payload.
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'width', value: `${Math.max(10, newWidth)}px`, viewMode: state.viewMode } });
      // FIX: Add the required `viewMode` property to the action payload.
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'height', value: `${Math.max(10, newHeight)}px`, viewMode: state.viewMode } });
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
