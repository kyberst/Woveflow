export enum SiteName {
  MiTienda = 'mitienda',
  MiWeb = 'miweb'
}

export enum ViewMode {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile'
}

export interface Page {
  id: string;
  name: string;
  type: 'system' | 'user';
  content: string; // HTML content
}

export interface BuilderComponent {
  id: string;
  name: string;
  category: 'structure' | 'basic' | 'widget' | 'section' | 'custom';
  html: string;
  icon: string;
}

export interface HistoryEntry {
  pageId: string;
  content: string;
}

export interface EditorState {
  currentSite: SiteName;
  currentPageId: string;
  pages: Page[];
  viewMode: ViewMode;
  zoom: number;
  theme: 'light' | 'dark';
  history: HistoryEntry[];
  historyIndex: number;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  activeTab: string | null;
  showAIModal: boolean;
  isPreviewing: boolean;
  showAddComponentModal: boolean;
  insertionTarget: { elementId: string; mode: 'inside' | 'after' } | null;
  showSettingsModal: boolean;
  showCodeEditorModal: boolean;
  showSaveComponentModal: boolean;
  inlineEditingElementId: string | null;
}

export type Action =
  | { type: 'SET_SITE'; payload: SiteName }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'UPDATE_PAGE_CONTENT'; payload: { pageId: string; content: string } }
  | { type: 'UPDATE_ELEMENT_ATTRIBUTE'; payload: { elementId: string; attribute: string; value: string } }
  | { type: 'UPDATE_ELEMENT_STYLE'; payload: { elementId: string; property: string; value: string } }
  | { type: 'UPDATE_ELEMENT_TEXT'; payload: { elementId: string; text: string } }
  | { type: 'UPDATE_ELEMENT_innerHTML'; payload: { elementId: string; html: string } }
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
  | { type: 'TOGGLE_AI_MODAL'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'TOGGLE_ADD_COMPONENT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SETTINGS_MODAL'; payload: boolean }
  | { type: 'TOGGLE_CODE_EDITOR_MODAL'; payload: boolean }
  | { type: 'TOGGLE_SAVE_COMPONENT_MODAL'; payload: boolean };