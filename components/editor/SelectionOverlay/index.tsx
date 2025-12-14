import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import ElementToolbar from './ElementToolbar';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ResizeHandles from './ResizeHandles';
import GridVisualizer from './GridVisualizer';

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

  if (!overlayPos || !state.selectedElementId) return null;

  return (
    <div 
      className="absolute border-2 border-blue-600 pointer-events-none z-50 transition-all duration-75"
      style={{
        top: overlayPos.top + (iframeRef.current?.contentWindow?.scrollY || 0),
        left: overlayPos.left + (iframeRef.current?.contentWindow?.scrollX || 0),
        width: overlayPos.width,
        height: overlayPos.height
      }}
    >
      <GridVisualizer iframeRef={iframeRef} overlayPos={overlayPos} />
      <ElementToolbar />
      <ResizeHandles overlayPos={overlayPos} />
      
      {/* Round Blue Plus Button at Bottom Center */}
      <button
        onClick={handleAddClick}
        title={t('addComponent') || 'Add Component'}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform z-50"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}