import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import ElementToolbar from './ElementToolbar';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ResizeHandles from './ResizeHandles';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function SelectionOverlay({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const [overlayPos, setOverlayPos] = useState<DOMRect | null>(null);
  const { t } = useTranslation();

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
    const interval = setInterval(updateOverlay, 100); // Periodically check for position changes
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

  if (!overlayPos || !state.selectedElementId) return null;

  return (
    <div 
      className="absolute border-2 border-builder-primary pointer-events-none z-50 transition-all duration-75"
      style={{
        top: overlayPos.top + (iframeRef.current?.contentWindow?.scrollY || 0),
        left: overlayPos.left + (iframeRef.current?.contentWindow?.scrollX || 0),
        width: overlayPos.width,
        height: overlayPos.height
      }}
    >
      <ElementToolbar />
      <ResizeHandles overlayPos={overlayPos} />
      <button
        onClick={handleAddClick}
        title={t('addComponent') || ''}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-builder-primary text-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}