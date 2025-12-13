import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function InlineTextToolbar({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, opacity: 0 });

  const updateToolbar = useCallback(() => {
    if (state.inlineEditingElementId && iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const el = doc.querySelector<HTMLElement>(`[data-builder-id="${state.inlineEditingElementId}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setToolbarPos({
          top: rect.top - 40 + (iframeRef.current.contentWindow?.scrollY || 0),
          left: rect.left + (iframeRef.current.contentWindow?.scrollX || 0),
          opacity: 1
        });

        if (!el.isContentEditable) {
            el.contentEditable = 'true';
            el.focus();
            doc.execCommand('selectAll', false);

            const onBlur = () => {
                el.contentEditable = 'false';
                dispatch({ type: 'UPDATE_PAGE_CONTENT', payload: { pageId: state.currentPageId, content: doc.body.innerHTML } });
                dispatch({ type: 'ADD_HISTORY' });
                dispatch({ type: 'SET_INLINE_EDITING_ELEMENT', payload: null });
                el.removeEventListener('blur', onBlur);
            };
            el.addEventListener('blur', onBlur);
        }
      }
    } else {
      setToolbarPos(prev => ({ ...prev, opacity: 0 }));
    }
  }, [state.inlineEditingElementId, iframeRef, state.currentPageId, dispatch]);

  useEffect(() => {
    updateToolbar();
    const interval = setInterval(updateToolbar, 200);
    return () => clearInterval(interval);
  }, [updateToolbar]);

  const handleCommand = (command: string) => {
    iframeRef.current?.contentDocument?.execCommand(command, false);
  };

  if (toolbarPos.opacity === 0) return null;

  return (
    <div
      className="absolute bg-slate-800 text-white rounded-lg shadow-lg flex items-center p-1 z-50 transition-opacity duration-150"
      style={{ top: toolbarPos.top, left: toolbarPos.left, opacity: toolbarPos.opacity }}
      onMouseDown={e => e.preventDefault()} // Prevent blur when clicking toolbar
    >
      <button onClick={() => handleCommand('bold')} className="p-2 hover:bg-slate-600 rounded"><Bold size={16} /></button>
      <button onClick={() => handleCommand('italic')} className="p-2 hover:bg-slate-600 rounded"><Italic size={16} /></button>
      <button onClick={() => handleCommand('underline')} className="p-2 hover:bg-slate-600 rounded"><Underline size={16} /></button>
      <div className="w-px h-4 bg-slate-600 mx-1"></div>
      <button onClick={() => handleCommand('justifyLeft')} className="p-2 hover:bg-slate-600 rounded"><AlignLeft size={16} /></button>
      <button onClick={() => handleCommand('justifyCenter')} className="p-2 hover:bg-slate-600 rounded"><AlignCenter size={16} /></button>
      <button onClick={() => handleCommand('justifyRight')} className="p-2 hover:bg-slate-600 rounded"><AlignRight size={16} /></button>
      <button onClick={() => handleCommand('justifyFull')} className="p-2 hover:bg-slate-600 rounded"><AlignJustify size={16} /></button>
    </div>
  );
}