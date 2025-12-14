import { Action } from '../../../types';
import { designTokenReducer as baseDesignTokenReducer } from './designTokenReducer';

export const DESIGN_TOKEN_ACTIONS: Action['type'][] = ['ADD_DESIGN_TOKEN', 'UPDATE_DESIGN_TOKEN', 'DELETE_DESIGN_TOKEN'];

export const designTokenReducer = baseDesignTokenReducer;