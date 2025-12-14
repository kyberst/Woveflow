import React, { useMemo } from 'react';
import { useEditor } from '../../../hooks/useEditor';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  overlayPos: DOMRect;
}

export default function GridVisualizer({ iframeRef, overlayPos }: Props) {
  const { state } = useEditor();
  const { selectedElementId } = state;

  const gridData = useMemo(() => {
    if (!selectedElementId || !iframeRef.current?.contentDocument) return null;
    
    const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${selectedElementId}"]`) as HTMLElement;
    if (!el) return null;

    const computed = getComputedStyle(el);
    if (computed.display !== 'grid') return null;

    const parseTracks = (value: string, gap: number) => {
        if (!value || value === 'none') return [];
        // Computed styles usually return pixels: "100px 200px 100px"
        return value.split(' ').map(parseFloat);
    };

    const colGap = parseFloat(computed.columnGap) || 0;
    const rowGap = parseFloat(computed.rowGap) || 0;
    
    const cols = parseTracks(computed.gridTemplateColumns, colGap);
    const rows = parseTracks(computed.gridTemplateRows, rowGap);

    return { cols, rows, colGap, rowGap };
  }, [selectedElementId, iframeRef, overlayPos]); // Re-calc when overlay moves

  if (!gridData) return null;

  const { cols, rows, colGap, rowGap } = gridData;

  const renderVerticalLines = () => {
    let currentX = 0;
    return cols.map((width, i) => {
        const lines = [];
        
        // Column Start
        // lines.push(<div key={`c-s-${i}`} className="absolute top-0 bottom-0 border-l border-dashed border-blue-300/50" style={{ left: currentX }} />);
        
        currentX += width;
        
        // Column End
        lines.push(
            <div key={`c-e-${i}`} className="absolute top-0 bottom-0 border-r border-dashed border-builder-primary/30 pointer-events-none" style={{ left: currentX }}>
                <span className="absolute top-0 -translate-y-full right-0 text-[9px] bg-builder-primary text-white px-1 opacity-0 group-hover:opacity-100">{Math.round(width)}px</span>
            </div>
        );

        // Gap
        if (i < cols.length - 1 && colGap > 0) {
             lines.push(
                <div key={`c-g-${i}`} className="absolute top-0 bottom-0 bg-yellow-500/10" style={{ left: currentX, width: colGap }} />
             );
             currentX += colGap;
        }

        return lines;
    });
  };

  const renderHorizontalLines = () => {
    let currentY = 0;
    return rows.map((height, i) => {
        const lines = [];
        
        currentY += height;
        
        lines.push(
            <div key={`r-e-${i}`} className="absolute left-0 right-0 border-b border-dashed border-builder-primary/30 pointer-events-none" style={{ top: currentY }} />
        );

        if (i < rows.length - 1 && rowGap > 0) {
             lines.push(
                <div key={`r-g-${i}`} className="absolute left-0 right-0 bg-yellow-500/10" style={{ top: currentY, height: rowGap }} />
             );
             currentY += rowGap;
        }

        return lines;
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none group overflow-hidden rounded-sm">
        {renderVerticalLines()}
        {renderHorizontalLines()}
        <div className="absolute top-0 right-0 bg-builder-primary/90 text-white text-[9px] px-1.5 py-0.5 rounded-bl">GRID</div>
    </div>
  );
}