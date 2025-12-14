import { useEditor } from '../../../../hooks/useEditor';
import { ViewMode } from '../../../../types';

export function useViewportControls() {
    const { state, dispatch } = useEditor();

    const setViewMode = (mode: ViewMode) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    };

    const setZoom = (zoom: number) => {
        const clampedZoom = Math.min(150, Math.max(25, zoom || 25));
        dispatch({ type: 'SET_ZOOM', payload: clampedZoom });
    };

    const zoomPresets = [100, 75, 50, 25];

    return {
        viewMode: state.viewMode,
        zoom: state.zoom,
        setViewMode,
        setZoom,
        zoomPresets,
    };
}