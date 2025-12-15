import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import GridDropZones from './GridDropZones';

interface Props { iframeRef: React.RefObject<HTMLIFrameElement>; }

export default function SmartGuidesOverlay({ iframeRef }: Props) {
  const { state } = useEditor();
  const { dragOverState } = state;

  if (!dragOverState) return null;
  const { indicatorStyle, guides, containerHighlight, mode, gridCells, activeCell } = dragOverState;
  
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
      {/* Container Highlight (Green padding areas) */}
      {mode === 'inside' && containerHighlight && (
          <>
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY, left: containerHighlight.rect.left + scrollX, width: containerHighlight.rect.width, height: containerHighlight.padding.top }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.bottom + scrollY - containerHighlight.padding.bottom, left: containerHighlight.rect.left + scrollX, width: containerHighlight.rect.width, height: containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY + containerHighlight.padding.top, left: containerHighlight.rect.left + scrollX, width: containerHighlight.padding.left, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + scrollY + containerHighlight.padding.top, left: containerHighlight.rect.right + scrollX - containerHighlight.padding.right, width: containerHighlight.padding.right, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
          </>
      )}

      {/* Grid Cell Visualization (Ghost Grid) */}
      {mode === 'inside' && gridCells && gridCells.length > 0 && (
          <GridDropZones cells={gridCells} activeCell={activeCell} scrollX={scrollX} scrollY={scrollY} />
      )}

      {/* Main Drop Indicator (Blue Line or Box) - Active Target */}
      <div style={style} className="transition-all duration-75 ease-out">
          {mode !== 'inside' && (
              <>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute right-0 top-1/2 translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
              </>
          )}
          {mode === 'inside' && (
              <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-500/10 flex items-center justify-center">
                  <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                      {activeCell ? `Cell ${activeCell.rowIndex}x${activeCell.colIndex}` : 'Drop Here'}
                  </div>
              </div>
          )}
      </div>

      {/* Alignment Guides (Red Lines) */}
      {guides?.map(g => (
          <div key={g.id} className="absolute border-l border-red-500 border-dashed z-50 opacity-80" style={{ left: g.x + scrollX, top: g.y + scrollY, height: g.length, width: 1 }} />
      ))}
    </>
  );
}