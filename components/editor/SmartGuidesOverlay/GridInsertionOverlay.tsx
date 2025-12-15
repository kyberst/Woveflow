import React from 'react';
import { GridCell } from '../../../types';

interface Props {
  cells: GridCell[];
  activeCell?: GridCell | null;
  iframeOffsetX: number; // New prop for iframe's X position in main viewport
  iframeOffsetY: number; // New prop for iframe's Y position in main viewport
}

/**
 * GridInsertionOverlay (formerly GridDropZones)
 * Renders transparent divs with dashed borders to visualize individual grid cells
 * during drag-and-drop operations, highlighting the active cell under the cursor.
 */
export default function GridInsertionOverlay({ cells, activeCell, iframeOffsetX, iframeOffsetY }: Props) {
  if (!cells || cells.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 pointer-events-none z-40">
      {cells.map((cell, i) => {
        const isActive = activeCell && activeCell.rowIndex === cell.rowIndex && activeCell.colIndex === cell.colIndex;
        
        return (
            <div 
            key={`${cell.rowIndex}-${cell.colIndex}`} // Use unique key based on grid position
            className={`absolute border-2 flex items-center justify-center transition-colors duration-150 ${
                isActive 
                ? 'border-red-500 bg-red-500/30' // BRIGHT RED for active
                : 'border-red-500/50 bg-red-500/10' // Softer RED for inactive
            }`}
            style={{
                // cell.x/y are relative to iframe viewport. Add iframe's offset in main viewport.
                top: cell.y + iframeOffsetY,
                left: cell.x + iframeOffsetX,
                width: cell.width,
                height: cell.height,
            }}
            >
                <div className={`text-[8px] font-mono select-none ${isActive ? 'text-red-700 font-bold opacity-100' : 'text-red-400/50 opacity-0'}`}>
                    {isActive ? `R${cell.rowIndex} C${cell.colIndex}` : `R${cell.rowIndex} C${cell.colIndex}`}
                </div>
            </div>
        );
      })}
    </div>
  );
}