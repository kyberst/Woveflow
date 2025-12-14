import { GlobalClass } from '../styles';

export type ClassAction =
  | { type: 'ADD_GLOBAL_CLASS', payload: GlobalClass }
  | { type: 'UPDATE_GLOBAL_CLASS', payload: GlobalClass }
  | { type: 'DELETE_GLOBAL_CLASS', payload: string };
