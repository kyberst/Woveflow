import { useEditor } from '../../../../hooks/useEditor';

export function useSidebarTabs() {
    const { state, dispatch } = useEditor();

    const handleTabClick = (tabId: string) => {
        if (tabId === 'code') {
            dispatch({ type: 'TOGGLE_BOTTOM_PANEL', payload: !state.showBottomPanel });
            dispatch({ type: 'SET_BOTTOM_TAB', payload: 'code' });
        } else {
            const isActive = state.activeTab === tabId;
            dispatch({ type: 'SET_ACTIVE_TAB', payload: isActive ? null : tabId });
        }
    };

    return {
        activeTab: state.activeTab,
        showBottomPanel: state.showBottomPanel,
        handleTabClick,
    };
}