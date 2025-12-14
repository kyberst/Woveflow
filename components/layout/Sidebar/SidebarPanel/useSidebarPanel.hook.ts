import { useEditor } from '../../../../hooks/useEditor';

export function useSidebarPanel() {
    const { state, dispatch } = useEditor();

    const handleCloseSidebarPanel = () => {
        dispatch({ type: 'CLOSE_SIDEBAR_PANEL' });
    };

    return {
        activeTab: state.activeTab,
        handleCloseSidebarPanel,
    };
}