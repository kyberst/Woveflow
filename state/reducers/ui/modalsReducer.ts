import { EditorState, Action } from '../../../types';

export const modalsReducer = (state: EditorState, action: Action): EditorState => {
    switch (action.type) {
        case 'TOGGLE_AI_MODAL':
            return { ...state, showAIModal: action.payload };
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
        default:
            return state;
    }
};