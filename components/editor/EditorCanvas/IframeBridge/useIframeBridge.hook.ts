import { useRef, useEffect } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useIframeDrop } from './useIframeDrop.hook';
import { useIframeDragOver } from './useIframeDragOver.hook';

export const useIframeBridge = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { state, dispatch } = useEditor();
  const onDrop = useIframeDrop();
  const throttledDragOver = useIframeDragOver(iframeRef);

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current?.contentDocument) {
        const el = iframeRef.current.contentDocument.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [state.selectedElementId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleDragLeave = () => {}; 
    const onClick = (e: MouseEvent) => {
      dispatch({ type: 'HIDE_CONTEXT_MENU' });
      e.stopPropagation();
      const id = (e.target as HTMLElement).closest('[data-builder-id]')?.getAttribute('data-builder-id');
      dispatch({ type: 'SET_SELECTED_ELEMENT', payload: id || null });
    };

    const handleLoad = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      doc.body.addEventListener('dragover', throttledDragOver as any); // Cast to any because throttled function type
      doc.body.addEventListener('dragleave', handleDragLeave);
      doc.body.addEventListener('drop', onDrop as any); // Cast to any because onDrop function type
      doc.body.addEventListener('click', onClick);
    };

    iframe.addEventListener('load', handleLoad);
    if(iframe.contentDocument?.readyState === 'complete') handleLoad();

    return () => {
       iframe.removeEventListener('load', handleLoad);
       const doc = iframe.contentDocument;
       if (doc) {
         doc.body.removeEventListener('dragover', throttledDragOver as any);
         doc.body.removeEventListener('drop', onDrop as any);
         doc.body.removeEventListener('click', onClick);
       }
    };
  }, [state.currentPageId, dispatch, state.components, state.isDragging, onDrop, throttledDragOver]);

  return iframeRef;
};