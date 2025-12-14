import { Action } from '../../../types';
import { contextMenuReducer as baseContextMenuReducer } from './contextMenuReducer';

export const CONTEXT_MENU_ACTIONS: Action['type'][] = ['SHOW_CONTEXT_MENU', 'HIDE_CONTEXT_MENU'];

export const contextMenuReducer = baseContextMenuReducer;