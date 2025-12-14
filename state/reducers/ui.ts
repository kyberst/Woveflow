import { EditorState, Action, ViewMode } from '../../types';

export const uiReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
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
        if (state.selectedElementId && state.selectedElementId === action.payload || state.isDragging) {
            return { ...state, hoveredElementId: null };
        }
        return { ...state, hoveredElementId: action.payload };
        
    case 'SET_INLINE_EDITING_ELEMENT':
        return { ...state, inlineEditingElementId: action.payload, selectedElementId: null, hoveredElementId: null };
    
    case 'SET_INSERTION_TARGET':
        return { ...state, insertionTarget: action.payload };
    
    case 'TOGGLE_AI_MODAL':
      return { ...state, showAIModal: action.payload };
      
    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewing: !state.isPreviewing };

    case 'TOGGLE_ADD_COMPONENT_MODAL':
      return { ...state, showAddComponentModal: action.payload };

    case 'TOGGLE_CODE_EDITOR_MODAL':
      return { ...state, showCodeEditorModal: action.payload };

    case 'TOGGLE_SAVE_COMPONENT_MODAL':
      return { ...state, showSaveComponentModal: action.payload };

    case 'TOGGLE_SETTINGS_MODAL':
      return { ...state, showSettingsModal: action.payload };

    case 'TOGGLE_SITE_SETTINGS_MODAL':
      return { ...state, showSiteSettingsModal: action.payload };

    case 'SET_IS_DRAGGING':
      return { ...state, isDragging: action.payload };
      
    case 'SET_DRAG_OVER_STATE':
      return { ...state, dragOverState: action.payload };

    case 'CLEAR_DRAG_STATE':
      return { ...state, isDragging: false, dragOverState: null };
    
    case 'TOGGLE_BOTTOM_PANEL':
      return { ...state, showBottomPanel: action.payload };

    case 'SET_BOTTOM_TAB':
      return { ...state, activeBottomTab: action.payload };

    case 'TOGGLE_COMMAND_PALETTE':
      return { ...state, showCommandPalette: action.payload };
      
    default:
      return state;
  }
};