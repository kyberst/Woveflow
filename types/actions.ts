import { EditorState } from './editor';
import { SiteName, ViewMode } from './enums';
import { Site } from './site';
import { SiteMember } from './user';
import { Page } from './page';
import { BuilderElementNode, BuilderComponent } from './element';
import { GlobalClass, DesignToken, DesignTokenCategory } from './styles';
import { DragOverState } from './dragAndDrop'; // Corrected import

export type Action =
  | { type: 'SET_INITIAL_STATE'; payload: EditorState }
  | { type: 'SET_SITE'; payload: SiteName }
  | { type: 'UPDATE_SITE'; payload: Site }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'UPDATE_PAGE_CONTENT'; payload: { pageId: string; content: BuilderElementNode[] } }
  | { type: 'UPDATE_ELEMENT_ATTRIBUTE'; payload: { elementId: string; attribute: string; value: string } }
  | { type: 'UPDATE_ELEMENT_STYLE'; payload: { elementId: string; property: string; value: string; viewMode: ViewMode } }
  | { type: 'UPDATE_ELEMENT_TEXT'; payload: { elementId: string; text: string } }
  | { type: 'UPDATE_ELEMENT_innerHTML'; payload: { elementId: string; html: string } }
  | { type: 'UPDATE_ELEMENT_CLASSES'; payload: { elementId: string; classNames: string[] } }
  | { type: 'ADD_ELEMENT'; payload: { targetId: string | null; mode: 'inside' | 'after' | 'before'; element: BuilderElementNode } }
  | { type: 'MOVE_ELEMENT'; payload: { elementId: string; targetId: string; position: 'before' | 'after' | 'inside' } }
  | { type: 'ADD_HISTORY' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: string | null }
  | { type: 'CLOSE_SIDEBAR_PANEL' }
  | { type: 'SET_SELECTED_ELEMENT'; payload: string | null }
  | { type: 'SET_HOVERED_ELEMENT'; payload: string | null }
  | { type: 'SET_INLINE_EDITING_ELEMENT'; payload: string | null }
  | { type: 'SET_INSERTION_TARGET'; payload: { elementId: string; mode: 'inside' | 'after' } | null }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_DOWN' }
  | { type: 'SELECT_PARENT' }
  | { type: 'DELETE_ELEMENT' }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'RENAME_PAGE'; payload: { id: string, name: string } }
  | { type: 'DUPLICATE_PAGE'; payload: string }
  | { type: 'ADD_COMPONENT'; payload: BuilderComponent }
  | { type: 'TOGGLE_AI_MODAL'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'TOGGLE_ADD_COMPONENT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_CODE_EDITOR_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SAVE_COMPONENT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SETTINGS_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SITE_SETTINGS_MODAL'; payload: boolean }
  | { type: 'SHOW_CONTEXT_MENU'; payload: { x: number; y: number; elementId: string } }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'DUPLICATE_ELEMENT'; payload: string }
  | { type: 'COPY_STYLES'; payload: string }
  | { type: 'PASTE_STYLES'; payload: string }
  | { type: 'SET_IS_DRAGGING'; payload: boolean }
  | { type: 'SET_DRAG_OVER_STATE'; payload: DragOverState | null }
  | { type: 'CLEAR_DRAG_STATE' }
  | { type: 'ADD_GLOBAL_CLASS', payload: GlobalClass }
  | { type: 'UPDATE_GLOBAL_CLASS', payload: GlobalClass }
  | { type: 'DELETE_GLOBAL_CLASS', payload: string }
  | { type: 'ADD_DESIGN_TOKEN', payload: DesignToken }
  | { type: 'UPDATE_DESIGN_TOKEN', payload: DesignToken }
  | { type: 'DELETE_DESIGN_TOKEN', payload: { id: string; category: DesignTokenCategory } }
  | { type: 'SET_SITE_MEMBERS', payload: SiteMember[] }
  | { type: 'TOGGLE_BOTTOM_PANEL'; payload: boolean }
  | { type: 'SET_BOTTOM_TAB'; payload: 'code' | 'logs' | null }
  | { type: 'TOGGLE_COMMAND_PALETTE'; payload: boolean }
  | { type: 'SET_GRID_LAYOUT'; payload: { elementId: string; layout: 'grid' | 'flex'; columns?: number; gap?: string } }
  | { type: 'UPDATE_COLUMN_SPAN'; payload: { elementId: string; span: number } };