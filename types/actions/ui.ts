import { ViewMode } from '../enums';

export type UiAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: string | null }
  | { type: 'CLOSE_SIDEBAR_PANEL' }
  | { type: 'TOGGLE_AI_MODAL'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'TOGGLE_ADD_COMPONENT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_CODE_EDITOR_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SAVE_COMPONENT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SETTINGS_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SITE_SETTINGS_MODAL'; payload: boolean }
  | { type: 'TOGGLE_BOTTOM_PANEL'; payload: boolean }
  | { type: 'SET_BOTTOM_TAB'; payload: 'code' | 'logs' | null }
  | { type: 'TOGGLE_COMMAND_PALETTE'; payload: boolean };
