import { EditorState, Action, SiteName } from '../../types';
import * as db from '../../services/surrealdbService';

export const siteReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'SET_SITE': {
      const firstPageOfSite = state.pages.find(p => p.id.startsWith(action.payload === SiteName.MiTienda ? 'p' : 'w'));
      return { 
        ...state, 
        currentSite: action.payload, 
        currentPageId: firstPageOfSite?.id || state.currentPageId 
      };
    }
    
    case 'UPDATE_SITE': {
        const updatedSite = action.payload;
        db.updateSite(updatedSite).catch(console.error);
        const newSites = state.sites.map(s => s.id === updatedSite.id ? updatedSite : s);
        return { ...state, sites: newSites };
    }
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageId: action.payload, selectedElementId: null };

    default:
      return state;
  }
};