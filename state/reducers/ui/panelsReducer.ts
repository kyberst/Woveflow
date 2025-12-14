import { EditorState, Action } from '../../../types';

export const panelsReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'CLOSE_SIDEBAR_PANEL':
            return { ...state, activeTab: null };
        case 'TOGGLE_BOTTOM_PANEL':
            return { ...state, showBottomPanel: action.payload };
        case 'SET_BOTTOM_TAB':
            return { ...state, activeBottomTab: action.payload };
        default:
            return state;
    }
};