import { useRef, useEffect } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { BuilderComponent } from '../../../types';

const EDITABLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'];

// This hook acts as a bridge between the React app and the iframe content
export const useIframeBridge = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { state, dispatch } = useEditor();
  const { currentPageId, pages } = state;
  let currentEditableEl: HTMLElement | null = null;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer?.getData('application/json');
      if (!data) return;

      const component = JSON.parse(data) as BuilderComponent;
      const dropTarget = e.target as HTMLElement;
      
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      const tempDiv = doc.createElement('div');
      tempDiv.innerHTML = component.html;
      const newEl = tempDiv.firstElementChild as HTMLElement;
      
      if (newEl) {
        newEl.setAttribute('data-builder-id', `el-${Date.now()}`);
        if (dropTarget.appendChild) {
            dropTarget.appendChild(newEl);
        }
        dispatch({ type: 'UPDATE_PAGE_CONTENT', payload: { pageId: currentPageId, content: doc.body.innerHTML } });
        dispatch({ type: 'ADD_HISTORY' });
      }
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      
      // If we are in inline editing, a click should not change selection
      if (target.isContentEditable) return;
      
      const id = target.getAttribute('data-builder-id');
      dispatch({ type: 'SET_SELECTED_ELEMENT', payload: id || null });
    };

    const onDblClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (EDITABLE_TAGS.includes(target.tagName.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
            const id = target.getAttribute('data-builder-id');
            dispatch({ type: 'SET_INLINE_EDITING_ELEMENT', payload: id });
        }
    };

    let lastHoveredId: string | null = null;
    const onMouseMove = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'BODY' || target.tagName === 'HTML' || target.isContentEditable) {
            if (lastHoveredId !== null) {
                dispatch({ type: 'SET_HOVERED_ELEMENT', payload: null });
                lastHoveredId = null;
            }
            return;
        }
        const id = target.getAttribute('data-builder-id');
        if (id && id !== lastHoveredId) {
            dispatch({ type: 'SET_HOVERED_ELEMENT', payload: id });
            lastHoveredId = id;
        }
    };

    const onMouseLeave = () => {
        if (lastHoveredId !== null) {
            dispatch({ type: 'SET_HOVERED_ELEMENT', payload: null });
            lastHoveredId = null;
        }
    };

    const setupListeners = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      doc.querySelectorAll('body *').forEach(el => {
        if (!el.getAttribute('data-builder-id')) {
          el.setAttribute('data-builder-id', `el-${Math.random().toString(36).substr(2, 9)}`);
        }
      });
      
      doc.body.addEventListener('dragover', e => e.preventDefault());
      doc.body.addEventListener('drop', onDrop);
      doc.body.addEventListener('click', onClick);
      doc.body.addEventListener('dblclick', onDblClick);
      doc.body.addEventListener('mousemove', onMouseMove);
      doc.body.addEventListener('mouseleave', onMouseLeave);
    };

    const handleLoad = () => {
        const page = pages.find(p => p.id === currentPageId);
        if (iframeRef.current?.contentDocument && page) {
            iframeRef.current.contentDocument.body.innerHTML = page.content;
            setupListeners();
        }
    };
    
    iframe.addEventListener('load', handleLoad);
    
    if(iframe.contentDocument?.readyState === 'complete') handleLoad();

    return () => {
      iframe.removeEventListener('load', handleLoad);
      const doc = iframe.contentDocument;
      if (doc) {
        doc.body.removeEventListener('drop', onDrop);
        doc.body.removeEventListener('click', onClick);
        doc.body.removeEventListener('dblclick', onDblClick);
        doc.body.removeEventListener('mousemove', onMouseMove);
        doc.body.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [currentPageId, dispatch, pages]);

  return iframeRef;
};