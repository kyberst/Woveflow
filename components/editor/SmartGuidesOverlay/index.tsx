import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import GridInsertionOverlay from './GridInsertionOverlay'; // Updated import

interface Props { iframeRef: React.RefObject<HTMLIFrameElement>; }

export default function SmartGuidesOverlay({ iframeRef }: Props) {
  const { state } = useEditor();
  const { dragOverState } = state;

  if (!dragOverState) return null;
  const { indicatorStyle, guides, containerHighlight, mode, gridCells, activeCell } = dragOverState;
  
  // Get iframe's position in the main application's viewport
  const iframeRect = iframeRef.current?.getBoundingClientRect();
  const iframeOffsetX = iframeRect?.left || 0;
  const iframeOffsetY = iframeRect?.top || 0;

  // The main indicator's position already needs to account for iframe's viewport position
  // and its own internal scroll, as indicatorStyle.top/left are iframe-viewport-relative.
  // This logic is crucial for general indicator, not just grid.
  const win = iframeRef.current?.contentWindow;
  const iframeScrollX = win?.scrollX || 0;
  const iframeScrollY = win?.scrollY || 0;

  const style: React.CSSProperties = {
    position: 'absolute', pointerEvents: 'none', zIndex: 100,
    // Adjust background/outline for the main indicator when gridCells are present
    backgroundColor: (mode === 'inside' && gridCells && gridCells.length > 0) ? 'transparent' : '#3b82f6', 
    outline: (mode === 'inside' && gridCells && gridCells.length > 0) ? 'none' : (indicatorStyle.outline || 'none'),
    ...indicatorStyle, // Apply other indicator styles, but potentially override for grid
    // Correct positioning: indicatorStyle.top/left are iframe-viewport-relative.
    // Add iframe's own absolute position in the main window.
    top: (indicatorStyle.top as number) + iframeOffsetY,
    left: (indicatorStyle.left as number) + iframeOffsetX,
  };

  // Determine if the main indicator should render its internal blue box/text
  const shouldRenderMainIndicatorContent = mode === 'inside' && (!gridCells || gridCells.length === 0);

  return (
    <>
      {/* Container Highlight (Green padding areas) */}
      {mode === 'inside' && containerHighlight && (
          <>
            {/* These already assume SmartGuidesOverlay is positioned at top:0, left:0 of main window */}
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + iframeOffsetY, left: containerHighlight.rect.left + iframeOffsetX, width: containerHighlight.rect.width, height: containerHighlight.padding.top }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.bottom + iframeOffsetY - containerHighlight.padding.bottom, left: containerHighlight.rect.left + iframeOffsetX, width: containerHighlight.rect.width, height: containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + iframeOffsetY + containerHighlight.padding.top, left: containerHighlight.rect.left + iframeOffsetX, width: containerHighlight.padding.left, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
            <div className="absolute bg-green-500/20 z-40" style={{ top: containerHighlight.rect.top + iframeOffsetY + containerHighlight.padding.top, left: containerHighlight.rect.right + iframeOffsetX - containerHighlight.padding.right, width: containerHighlight.padding.right, height: containerHighlight.rect.height - containerHighlight.padding.top - containerHighlight.padding.bottom }} />
          </>
      )}

      {/* Grid Cell Visualization (Ghost Grid) */}
      {mode === 'inside' && gridCells && gridCells.length > 0 && (
          <GridInsertionOverlay cells={gridCells} activeCell={activeCell} iframeOffsetX={iframeOffsetX} iframeOffsetY={iframeOffsetY} />
      )}

      {/* Main Drop Indicator (Blue Line or Box) - Active Target */}
      <div style={style} className="transition-all duration-75 ease-out">
          {mode !== 'inside' && (
              <>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute right-0 top-1/2 translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
              </>
          )}
          {shouldRenderMainIndicatorContent && ( // Only render this content if NOT actively hovering a grid
              <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-500/10 flex items-center justify-center">
                  <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                      {activeCell ? `Cell ${activeCell.rowIndex}x${activeCell.colIndex}` : 'Drop Here'}
                  </div>
              </div>
          )}
      </div>

      {/* Alignment Guides (Red Lines) */}
      {guides?.map(g => (
          <div key={g.id} className="absolute border-l border-red-500 border-dashed z-50 opacity-80" style={{ left: g.x + iframeOffsetX, top: g.y + iframeOffsetY, height: g.length, width: 1 }} />
      ))}
    </>
  );
}