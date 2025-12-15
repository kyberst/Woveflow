import React from 'react';
import { GridCell } from '../../../types';

interface Props {
  cells: GridCell[];
  activeCell?: GridCell | null;
  scrollX: number;
  scrollY: number;
}

/**
 * GridInsertionOverlay (formerly GridDropZones)
 * Renders transparent divs with dashed borders to visualize individual grid cells
 * during drag-and-drop operations, highlighting the active cell under the cursor.
 */
export default function GridInsertionOverlay({ cells, activeCell, scrollX, scrollY }: Props) {
  if (!cells || cells.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 pointer-events-none z-40">
      {cells.map((cell, i) => {
        const isActive = activeCell && activeCell.rowIndex === cell.rowIndex && activeCell.colIndex === cell.colIndex;
        
        return (
            <div 
            key={`${cell.rowIndex}-${cell.colIndex}`} // Use unique key based on grid position
            className={`absolute border flex items-center justify-center transition-colors duration-150 ${
                isActive 
                ? 'border-blue-500 bg-blue-500/20' 
                : 'border-indigo-400/30 bg-indigo-500/5'
            }`}
            style={{
                top: cell.y + scrollY,
                left: cell.x + scrollX,
                width: cell.width,
                height: cell.height,
            }}
            >
                <div className={`text-[8px] font-mono select-none ${isActive ? 'text-blue-700 font-bold opacity-100' : 'text-indigo-400/50 opacity-0'}`}>
                    {isActive ? `R${cell.rowIndex} C${cell.colIndex}` : `R${cell.rowIndex} C${cell.colIndex}`}
                </div>
            </div>
        );
      })}
    </div>
  );
}