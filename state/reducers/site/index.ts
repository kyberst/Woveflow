import { Action } from '../../../types';
import { siteReducer as baseSiteReducer } from './siteReducer';

export const SITE_ACTIONS: Action['type'][] = ['SET_SITE', 'UPDATE_SITE'];

export const siteReducer = baseSiteReducer;