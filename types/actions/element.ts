import { BuilderElementNode } from '../element';
import { ViewMode } from '../enums';
import { CSSProperties } from 'react';

export type ElementAction =
  | { type: 'UPDATE_ELEMENT_ATTRIBUTE'; payload: { elementId: string; attribute: string; value: string } }
  | { type: 'UPDATE_ELEMENT_STYLE'; payload: { elementId: string; property: string; value: string; viewMode: ViewMode } }
  | { type: 'UPDATE_ELEMENT_TEXT'; payload: { elementId: string; text: string } }
  | { type: 'UPDATE_ELEMENT_innerHTML'; payload: { elementId: string; html: string } }
  | { type: 'UPDATE_ELEMENT_CLASSES'; payload: { elementId: string; classNames: string[] } }
  | { type: 'ADD_ELEMENT'; payload: { targetId: string | null; mode: 'inside' | 'after' | 'before'; element: BuilderElementNode } }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_DOWN' }
  | { type: 'SELECT_PARENT' }
  | { type: 'DELETE_ELEMENT' }
  | { type: 'DUPLICATE_ELEMENT'; payload: string }
  | { type: 'SET_GRID_LAYOUT'; payload: { elementId: string; layout: 'grid' | 'flex'; columns?: number; gap?: string } }
  | { type: 'SET_CONTAINER_LAYOUT'; payload: { elementId: string; styles: CSSProperties; viewMode: ViewMode } }
  | { type: 'UPDATE_CHILD_SPAN'; payload: { elementId: string; property: 'gridColumn'; value: string; viewMode: ViewMode } }
  | { type: 'RESIZE_GRID_COLUMN'; payload: { elementId: string; index: number; size: string } };