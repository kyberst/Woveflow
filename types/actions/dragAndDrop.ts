import { DragOverState } from '../dragAndDrop';

export type DragAndDropAction =
  | { type: 'SET_IS_DRAGGING'; payload: boolean }
  | { type: 'SET_DRAG_OVER_STATE'; payload: DragOverState | null }
  | { type: 'CLEAR_DRAG_STATE' }
  | { type: 'SET_HOVERED_ELEMENT'; payload: string | null }
  | { type: 'SET_SELECTED_ELEMENT'; payload: string | null }
  | { type: 'SET_INLINE_EDITING_ELEMENT'; payload: string | null }
  | { type: 'SET_INSERTION_TARGET'; payload: { elementId: string; mode: 'inside' | 'after' } | null };