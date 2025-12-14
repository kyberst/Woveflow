import { Action } from '../../../types';
import { clipboardReducer as baseClipboardReducer } from './clipboardReducer';

export const CLIPBOARD_ACTIONS: Action['type'][] = ['COPY_STYLES', 'PASTE_STYLES'];

export const clipboardReducer = baseClipboardReducer;