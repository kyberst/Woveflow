import { CSSProperties } from 'react';

export interface SnapGuide {
    id: string;
    orientation: 'vertical' | 'horizontal';
    x: number;
    y: number;
    length: number;
}

export interface ContainerHighlight {
    rect: DOMRect;
    padding: { top: number; right: number; bottom: number; left: number };
}

export interface GridCell {
    x: number;
    y: number;
    width: number;
    height: number;
    rowIndex: number;
    colIndex: number;
}

export interface DragOverState {
  targetId: string;
  mode: 'before' | 'after' | 'inside';
  indicatorStyle: CSSProperties;
  guides: SnapGuide[];
  containerHighlight: ContainerHighlight | null;
  gridCells?: GridCell[];
  activeCell?: GridCell | null;
}