import { Action } from '../../../types';
import { componentReducer as baseComponentReducer } from './componentReducer';

export const COMPONENT_ACTIONS: Action['type'][] = ['ADD_COMPONENT'];

export const componentReducer = baseComponentReducer;