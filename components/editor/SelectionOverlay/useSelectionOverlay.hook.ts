import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';

export function useSelectionOverlay(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const { state, dispatch } = useEditor();
  const [overlayPos, setOverlayPos] = useState<DOMRect | null>(null);

  const updateOverlay = useCallback(() => {
    if (state.selectedElementId && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const el = doc?.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
      if (el) {
        setOverlayPos(el.getBoundingClientRect());
      } else {
        setOverlayPos(null);
      }
    } else {
      setOverlayPos(null);
    }
  }, [state.selectedElementId, iframeRef, state.zoom, state.viewMode, state.pages]);

  useEffect(() => {
    const interval = setInterval(updateOverlay, 50); // Fast check for smoother feel
    window.addEventListener('resize', updateOverlay);
    const doc = iframeRef.current?.contentDocument;
    doc?.addEventListener('scroll', updateOverlay);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateOverlay);
      doc?.removeEventListener('scroll', updateOverlay);
    };
  }, [updateOverlay, iframeRef]);
  
  const handleAddClick = () => {
    if (!state.selectedElementId) return;
    dispatch({ type: 'SET_INSERTION_TARGET', payload: { elementId: state.selectedElementId, mode: 'after' } });
    dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: true });
  };

  return {
    overlayPos,
    handleAddClick,
  };
}
