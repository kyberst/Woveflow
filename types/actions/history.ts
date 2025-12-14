export type HistoryAction =
  | { type: 'ADD_HISTORY' }
  | { type: 'UNDO' }
  | { type: 'REDO' };
