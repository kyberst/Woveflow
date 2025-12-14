import { DesignToken, DesignTokenCategory } from '../styles';

export type DesignTokenAction =
  | { type: 'ADD_DESIGN_TOKEN', payload: DesignToken }
  | { type: 'UPDATE_DESIGN_TOKEN', payload: DesignToken }
  | { type: 'DELETE_DESIGN_TOKEN', payload: { id: string; category: DesignTokenCategory } };
