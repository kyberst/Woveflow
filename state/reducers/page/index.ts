import { Action } from '../../../types';
import { pageReducer as basePageReducer } from './pageReducer';

export const PAGE_ACTIONS: Action['type'][] = [
    'SET_CURRENT_PAGE', 'ADD_PAGE', 'DELETE_PAGE', 'RENAME_PAGE', 
    'DUPLICATE_PAGE', 'UPDATE_PAGE_CONTENT'
];

export const pageReducer = basePageReducer;