import { EditorState, Action, SiteName, Page, ViewMode } from '../types';
import { INITIAL_PAGES } from '../constants';
import { sanitizeHTML } from '../services/securityService';

// Helper function for safe DOM manipulation
const manipulateDOM = (content: string, selectedId: string, operation: (el: Element) => void): string => {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    const el = tempContainer.querySelector(`[data-builder-id="${selectedId}"]`);
    if (el) {
        operation(el);
    }
    return tempContainer.innerHTML;
};

export const getInitialState = (): EditorState => {
  const allPages = [...INITIAL_PAGES[SiteName.MiTienda], ...INITIAL_PAGES[SiteName.MiWeb]];
  const initialContent = allPages[0].content;

  return {
    currentSite: SiteName.MiTienda,
    currentPageId: allPages[0].id,
    pages: allPages,
    viewMode: ViewMode.Desktop,
    zoom: 100,
    theme: 'light',
    history: [{ content: initialContent, pageId: allPages[0].id }],
    historyIndex: 0,
    selectedElementId: null,
    hoveredElementId: null,
    activeTab: null,
    showAIModal: false,
    isPreviewing: false,
    showAddComponentModal: false,
    insertionTarget: null,
    showSettingsModal: false,
    showCodeEditorModal: false,
    showSaveComponentModal: false,
    inlineEditingElementId: null,
  };
};

export const editorReducer = (state: EditorState, action: Action): EditorState => {
  const currentPage = state.pages.find(p => p.id === state.currentPageId);

  switch (action.type) {
    case 'SET_SITE':
      const firstPageOfSite = state.pages.find(p => p.id.startsWith(action.payload === SiteName.MiTienda ? 'p' : 'w'));
      return { ...state, currentSite: action.payload, currentPageId: firstPageOfSite?.id || state.currentPageId };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageId: action.payload, selectedElementId: null };

    case 'UPDATE_PAGE_CONTENT': {
      const { pageId, content } = action.payload;
      const sanitizedContent = sanitizeHTML(content);
      return {
        ...state,
        pages: state.pages.map(p => p.id === pageId ? { ...p, content: sanitizedContent } : p),
      };
    }
    
    case 'UPDATE_ELEMENT_ATTRIBUTE': {
        if (!currentPage) return state;
        const { elementId, attribute, value } = action.payload;
        const newContent = manipulateDOM(currentPage.content, elementId, el => el.setAttribute(attribute, value));
        return { ...state, pages: state.pages.map(p => p.id === currentPage.id ? { ...p, content: newContent } : p) };
    }

    case 'UPDATE_ELEMENT_STYLE': {
        if (!currentPage) return state;
        const { elementId, property, value } = action.payload;
        const newContent = manipulateDOM(currentPage.content, elementId, el => {
            (el as HTMLElement).style[property as any] = value;
        });
        return { ...state, pages: state.pages.map(p => p.id === currentPage.id ? { ...p, content: newContent } : p) };
    }

    case 'UPDATE_ELEMENT_TEXT': {
        if (!currentPage) return state;
        const { elementId, text } = action.payload;
        const newContent = manipulateDOM(currentPage.content, elementId, el => {
            (el as HTMLElement).innerText = text;
        });
        return { ...state, pages: state.pages.map(p => p.id === currentPage.id ? { ...p, content: newContent } : p) };
    }
    
    case 'UPDATE_ELEMENT_innerHTML': {
        if (!currentPage) return state;
        const { elementId, html } = action.payload;
        const newContent = manipulateDOM(currentPage.content, elementId, el => {
            el.innerHTML = html;
        });
        return { ...state, pages: state.pages.map(p => p.id === currentPage.id ? { ...p, content: newContent } : p) };
    }

    case 'ADD_HISTORY': {
        if (!currentPage) return state;
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        if (newHistory[newHistory.length - 1]?.content !== currentPage.content) {
            newHistory.push({ content: currentPage.content, pageId: state.currentPageId });
            return { ...state, history: newHistory, historyIndex: newHistory.length - 1 };
        }
        return state;
    }

    case 'UNDO': {
        if (state.historyIndex <= 0) return state;
        const newIndex = state.historyIndex - 1;
        const historyState = state.history[newIndex];
        return { ...state, historyIndex: newIndex, currentPageId: historyState.pageId, pages: state.pages.map(p => p.id === historyState.pageId ? { ...p, content: historyState.content } : p) };
    }

    case 'REDO': {
        if (state.historyIndex >= state.history.length - 1) return state;
        const newIndex = state.historyIndex + 1;
        const historyState = state.history[newIndex];
        return { ...state, historyIndex: newIndex, currentPageId: historyState.pageId, pages: state.pages.map(p => p.id === historyState.pageId ? { ...p, content: historyState.content } : p) };
    }

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
      
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'CLOSE_SIDEBAR_PANEL':
        return { ...state, activeTab: null };

    case 'SET_SELECTED_ELEMENT':
      if (action.payload === state.inlineEditingElementId) return state;
      return { ...state, selectedElementId: action.payload, hoveredElementId: null };

    case 'SET_HOVERED_ELEMENT':
        if (state.selectedElementId && state.selectedElementId === action.payload) {
            return { ...state, hoveredElementId: null };
        }
        return { ...state, hoveredElementId: action.payload };
        
    case 'SET_INLINE_EDITING_ELEMENT':
        return { ...state, inlineEditingElementId: action.payload, selectedElementId: null, hoveredElementId: null };
    
    case 'SET_INSERTION_TARGET':
        return { ...state, insertionTarget: action.payload };
    
    case 'MOVE_UP': {
        if (!state.selectedElementId || !currentPage) return state;
        const newContent = manipulateDOM(currentPage.content, state.selectedElementId, (el) => { if (el.previousElementSibling) { el.parentElement?.insertBefore(el, el.previousElementSibling); } });
        return { ...state, pages: state.pages.map(p => p.id === state.currentPageId ? { ...p, content: newContent } : p) };
    }

    case 'MOVE_DOWN': {
        if (!state.selectedElementId || !currentPage) return state;
        const newContent = manipulateDOM(currentPage.content, state.selectedElementId, (el) => { if (el.nextElementSibling) { el.parentElement?.insertBefore(el.nextElementSibling, el); } });
        return { ...state, pages: state.pages.map(p => p.id === state.currentPageId ? { ...p, content: newContent } : p) };
    }

    case 'SELECT_PARENT': {
        if (!state.selectedElementId || !currentPage) return state;
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = currentPage.content;
        const el = tempContainer.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
        const parent = el?.parentElement;
        if (parent && parent !== tempContainer) {
            const parentId = parent.getAttribute('data-builder-id');
            if (parentId) { return { ...state, selectedElementId: parentId }; }
        }
        return state;
    }

    case 'DELETE_ELEMENT': {
        if (!state.selectedElementId || !currentPage) return state;
        const newContent = manipulateDOM(currentPage.content, state.selectedElementId, (el) => el.remove());
        return { ...state, pages: state.pages.map(p => p.id === state.currentPageId ? { ...p, content: newContent } : p), selectedElementId: null };
    }

    case 'ADD_PAGE':
      return { ...state, pages: [...state.pages, action.payload] };

    case 'DELETE_PAGE':
      const newPages = state.pages.filter(p => p.id !== action.payload);
      return { ...state, pages: newPages, currentPageId: state.currentPageId === action.payload ? newPages[0].id : state.currentPageId };
      
    case 'RENAME_PAGE':
        return { ...state, pages: state.pages.map(p => p.id === action.payload.id ? { ...p, name: action.payload.name } : p) };
        
    case 'DUPLICATE_PAGE': {
        const pageToCopy = state.pages.find(p => p.id === action.payload);
        if (!pageToCopy) return state;
        const newPage: Page = { ...pageToCopy, id: `user-${Date.now()}`, name: `${pageToCopy.name}-copy`};
        return { ...state, pages: [...state.pages, newPage] };
    }

    case 'TOGGLE_AI_MODAL':
      return { ...state, showAIModal: action.payload };
      
    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewing: !state.isPreviewing };

    case 'TOGGLE_ADD_COMPONENT_MODAL':
      return { ...state, showAddComponentModal: action.payload };

    case 'TOGGLE_SETTINGS_MODAL':
      return { ...state, showSettingsModal: action.payload };

    case 'TOGGLE_CODE_EDITOR_MODAL':
      return { ...state, showCodeEditorModal: action.payload };

    case 'TOGGLE_SAVE_COMPONENT_MODAL':
      return { ...state, showSaveComponentModal: action.payload };

    default:
      return state;
  }
};