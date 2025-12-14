import { EditorState } from '../editor';

export type EditorInitializationAction =
  | { type: 'SET_INITIAL_STATE'; payload: EditorState };
