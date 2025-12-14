import { EditorState, Action, Page } from '../../types';
import * as db from '../../services/surrealdbService';

export const pageReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'UPDATE_PAGE_CONTENT': {
      const { pageId, content } = action.payload;
      db.updatePageContent(pageId, content).catch(console.error);
      return {
        ...state,
        pages: state.pages.map(p => p.id === pageId ? { ...p, content } : p),
      };
    }

    case 'ADD_PAGE': {
      db.createPage(action.payload).catch(console.error);
      return { ...state, pages: [...state.pages, action.payload] };
    }

    case 'DELETE_PAGE': {
      db.deletePage(action.payload).catch(console.error);
      const newPages = state.pages.filter(p => p.id !== action.payload);
      return { 
        ...state, 
        pages: newPages, 
        currentPageId: state.currentPageId === action.payload ? newPages[0]?.id || '' : state.currentPageId 
      };
    }
      
    case 'RENAME_PAGE': {
        const newPages = state.pages.map(p => p.id === action.payload.id ? { ...p, name: action.payload.name } : p);
        const updatedPage = newPages.find(p => p.id === action.payload.id);
        if (updatedPage) db.updatePage(updatedPage).catch(console.error);
        return { ...state, pages: newPages };
    }
        
    case 'DUPLICATE_PAGE': {
        const pageToCopy = state.pages.find(p => p.id === action.payload);
        const currentSiteRecord = state.sites.find(s => s.name === state.currentSite);
        if (!pageToCopy || !state.currentUser || !currentSiteRecord) return state;
        
        const newPage: Page = { 
          ...pageToCopy, 
          id: `user-${Date.now()}`, 
          name: `${pageToCopy.name}-copy`,
          owner: state.currentUser.id,
          site: currentSiteRecord.id,
        };
        db.createPage(newPage).catch(console.error);
        return { ...state, pages: [...state.pages, newPage] };
    }

    default:
      return state;
  }
};