import { Action } from '../../../types';
import { classReducer as baseClassReducer } from './classReducer';

export const CLASS_ACTIONS: Action['type'][] = ['ADD_GLOBAL_CLASS', 'UPDATE_GLOBAL_CLASS', 'DELETE_GLOBAL_CLASS'];

export const classReducer = baseClassReducer;
