import React from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props { iframeRef: React.RefObject<HTMLIFrameElement>; }

export default function SmartGuidesOverlay({ iframeRef }: Props) {
  const { state } = useEditor();
  const { dragOverState } = state;

  if (!dragOverState) return null;
  const { indicatorStyle, guides, containerHighlight, mode } = dragOverState;
  
  const win = iframeRef.current?.contentWindow;
  const scrollX = win?.scrollX || 0;
  const scrollY = win?.scrollY || 0;

  const style: React.CSSProperties = {
    position: 'absolute', pointerEvents: 'none', zIndex: 100,
    backgroundColor: mode !== 'inside' ? '#3b82f6' : 'transparent', 
    ...indicatorStyle,
    top: (indicatorStyle.top as number) + scrollY,
    left: (indicatorStyle.left as number) + scrollX,
  };

  return (
    <>
      {mode === 'inside' && containerHighlight && (
          <>
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY, left: containerHighlight.rect.left + scrollX, width: containerHighlight.rect.width, height: containerHighlight.padding.top }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.bottom + scrollY - containerHighlight.padding.bottom, left: containerHighlight.rect.left + scrollX, width: containerHighlight.rect.width, height: containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY + containerHighlight.padding.top, left: containerHighlight.rect.left + scrollX, width: containerHighlight.padding.left, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY + containerHighlight.padding.top, left: containerHighlight.rect.right + scrollX - containerHighlight.padding.right, width: containerHighlight.padding.right, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
          </>
      )}
      <div style={style}>
          {mode !== 'inside' && (
              <>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute right-0 top-1/2 translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
              </>
          )}
      </div>
      {guides?.map(g => (
          <div key={g.id} className="absolute border-l border-red-500 border-dashed z-50 opacity-80" style={{ left: g.x + scrollX, top: g.y + scrollY, height: g.length, width: 1 }} />
      ))}
    </>
  );
}