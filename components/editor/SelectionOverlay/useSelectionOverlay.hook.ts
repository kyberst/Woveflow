import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor } from '../../../hooks/useEditor';

export function useSelectionOverlay(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const { state, dispatch } = useEditor();
  const [overlayPos, setOverlayPos] = useState<DOMRect | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  const scheduleUpdate = useCallback(() => {
      if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateOverlay);
  }, [updateOverlay]);

  useEffect(() => {
    // Initial update
    scheduleUpdate();

    // Attach listeners
    window.addEventListener('resize', scheduleUpdate);
    const doc = iframeRef.current?.contentDocument;
    doc?.addEventListener('scroll', scheduleUpdate);

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', scheduleUpdate);
      doc?.removeEventListener('scroll', scheduleUpdate);
    };
  }, [scheduleUpdate, iframeRef]);
  
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