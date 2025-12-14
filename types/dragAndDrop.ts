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

export interface DragOverState {
  targetId: string;
  mode: 'before' | 'after' | 'inside';
  indicatorStyle: CSSProperties;
  guides: SnapGuide[];
  containerHighlight: ContainerHighlight | null;
}