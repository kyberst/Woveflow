import { Action } from '../../../types';
import { historyReducer as baseHistoryReducer } from './historyReducer';

export const HISTORY_ACTIONS: Action['type'][] = ['ADD_HISTORY', 'UNDO', 'REDO'];

export const historyReducer = baseHistoryReducer;