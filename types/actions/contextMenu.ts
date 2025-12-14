export type ContextMenuAction =
  | { type: 'SHOW_CONTEXT_MENU'; payload: { x: number; y: number; elementId: string } }
  | { type: 'HIDE_CONTEXT_MENU' };
