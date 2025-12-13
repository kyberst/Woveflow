import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export default function HoverOverlay({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const [overlayPos, setOverlayPos] = useState<DOMRect | null>(null);
  const [isElementEmpty, setIsElementEmpty] = useState(false);
  const { t } = useTranslation();

  const updateOverlay = useCallback(() => {
    if (state.hoveredElementId && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const el = doc?.querySelector(`[data-builder-id="${state.hoveredElementId}"]`);
      if (el) {
        setOverlayPos(el.getBoundingClientRect());
        const isEmpty = el.innerHTML.trim() === '' && !VOID_ELEMENTS.includes(el.tagName.toLowerCase());
        setIsElementEmpty(isEmpty);
      } else {
        setOverlayPos(null);
      }
    } else {
      setOverlayPos(null);
    }
  }, [state.hoveredElementId, iframeRef, state.zoom, state.viewMode]);

  useEffect(() => {
    // Continuous update for moving/scrolling canvas
    const interval = setInterval(updateOverlay, 50);
    return () => clearInterval(interval);
  }, [updateOverlay]);

  const handleAddClick = (mode: 'inside' | 'after') => {
    if (!state.hoveredElementId) return;
    dispatch({ type: 'SET_INSERTION_TARGET', payload: { elementId: state.hoveredElementId, mode } });
    dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: true });
  };

  if (!overlayPos || !state.hoveredElementId) return null;

  return (
    <div 
      className="absolute border-2 border-builder-primary/70 pointer-events-none z-40"
      style={{
        top: overlayPos.top + (iframeRef.current?.contentWindow?.scrollY || 0),
        left: overlayPos.left + (iframeRef.current?.contentWindow?.scrollX || 0),
        width: overlayPos.width,
        height: overlayPos.height
      }}
    >
      {isElementEmpty ? (
        <button
          onClick={() => handleAddClick('inside')}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-green-500/10 pointer-events-auto"
        >
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
            <Plus size={20} />
          </div>
        </button>
      ) : (
        <button
          onClick={() => handleAddClick('after')}
          title={t('addComponent') || ''}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-builder-primary text-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}