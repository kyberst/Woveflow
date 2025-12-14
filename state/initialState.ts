import { EditorState, SiteName, ViewMode } from '../types';

export const getInitialState = (): EditorState => {
  // This is now a temporary, empty state.
  // The real state will be hydrated asynchronously from SurrealDB.
  return {
    currentUser: null,
    currentSite: SiteName.MiTienda,
    currentPageId: '',
    pages: [],
    sites: [],
    siteMembers: [],
    components: [],
    globalClasses: [],
    designTokens: { colors: [], fonts: [], spacing: [] },
    viewMode: ViewMode.Desktop,
    zoom: 100,
    theme: 'light',
    history: [], // Will be populated by DB or service
    historyIndex: -1,
    selectedElementId: null,
    hoveredElementId: null,
    activeTab: null,
    showAIModal: false,
    isPreviewing: false,
    showAddComponentModal: false,
    insertionTarget: null,
    showCodeEditorModal: false,
    showSaveComponentModal: false,
    showSettingsModal: false,
    showSiteSettingsModal: false,
    inlineEditingElementId: null,
    contextMenu: null,
    clipboard: null,
    isDragging: false,
    dragOverState: null,
    showBottomPanel: false,
    activeBottomTab: 'code',
    showCommandPalette: false,
  };
};