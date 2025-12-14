import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Strikethrough, Link, List, ListOrdered, Palette, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function InlineTextToolbar({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, opacity: 0 });

  const updateToolbar = useCallback(() => {
    if (state.inlineEditingElementId && iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const el = doc.querySelector<HTMLElement>(`[data-builder-id="${state.inlineEditingElementId}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        
        // Position: Top Right relative to the element
        // We set Left to the right edge, and CSS transform will pull it back 100% to align the right edge
        setToolbarPos({
          top: rect.top - 45, 
          left: rect.right, 
          opacity: 1
        });

        if (!el.isContentEditable) {
            el.contentEditable = 'true';
            el.focus();
            
            // Select All Text on Start
            const range = doc.createRange();
            range.selectNodeContents(el);
            const selection = doc.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);

            const onBlur = () => {
                el.contentEditable = 'false';
                if (state.inlineEditingElementId) {
                    dispatch({ 
                        type: 'UPDATE_ELEMENT_innerHTML', 
                        payload: { elementId: state.inlineEditingElementId, html: el.innerHTML }
                    });
                }
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
  }, [state.inlineEditingElementId, iframeRef, dispatch]);

  useEffect(() => {
    updateToolbar();
    const interval = setInterval(updateToolbar, 200);
    return () => clearInterval(interval);
  }, [updateToolbar]);

  const handleCommand = (command: string, value?: string) => {
    iframeRef.current?.contentDocument?.execCommand(command, false, value);
    // Keep focus on element to ensure command applies and toolbar stays if needed
    const el = iframeRef.current?.contentDocument?.querySelector(`[data-builder-id="${state.inlineEditingElementId}"]`) as HTMLElement;
    el?.focus();
  };

  const handleLink = () => {
    const url = prompt(t('link') || 'Enter URL');
    if (url) {
      handleCommand('createLink', url);
    }
  };

  if (toolbarPos.opacity === 0) return null;

  return (
    <div
      className="absolute bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 flex items-center p-1 z-50 transition-opacity duration-150 gap-0.5"
      style={{ 
        top: toolbarPos.top, 
        left: toolbarPos.left, 
        opacity: toolbarPos.opacity,
        transform: 'translateX(-100%)' // Align right edge of toolbar with right edge of element
      }}
      onMouseDown={e => e.preventDefault()} // Prevent blur when clicking toolbar
    >
      <button title={t('bold')} onClick={() => handleCommand('bold')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Bold size={14} /></button>
      <button title={t('italic')} onClick={() => handleCommand('italic')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Italic size={14} /></button>
      <button title={t('underline')} onClick={() => handleCommand('underline')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Underline size={14} /></button>
      <button title={t('strikethrough')} onClick={() => handleCommand('strikeThrough')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Strikethrough size={14} /></button>
      
      <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>

      {/* Font Size Selector */}
      <div className="relative group p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Font Size">
          <Type size={14} />
          <select 
            onChange={(e) => handleCommand('fontSize', e.target.value)} 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            defaultValue="3"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="1">Tiny</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">XL</option>
            <option value="6">2XL</option>
            <option value="7">3XL</option>
          </select>
      </div>

      {/* Color Picker */}
      <div className="relative group p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Text Color">
          <Palette size={14} />
           <input 
            type="color" 
            onChange={(e) => handleCommand('foreColor', e.target.value)} 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onClick={(e) => e.stopPropagation()}
           />
      </div>
      
      <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
      
      <button title={t('link')} onClick={handleLink} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Link size={14} /></button>
      <button title={t('unorderedList')} onClick={() => handleCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><List size={14} /></button>
      <button title={t('orderedList')} onClick={() => handleCommand('insertOrderedList')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><ListOrdered size={14} /></button>
      
      <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
      
      <button title={t('alignLeft')} onClick={() => handleCommand('justifyLeft')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><AlignLeft size={14} /></button>
      <button title={t('alignCenter')} onClick={() => handleCommand('justifyCenter')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><AlignCenter size={14} /></button>
      <button title={t('alignRight')} onClick={() => handleCommand('justifyRight')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><AlignRight size={14} /></button>
      <button title={t('alignJustify')} onClick={() => handleCommand('justifyFull')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><AlignJustify size={14} /></button>
    </div>
  );
}