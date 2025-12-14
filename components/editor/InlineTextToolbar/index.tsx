import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Strikethrough, Link, List, ListOrdered, Palette, Type, RemoveFormatting } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function InlineTextToolbar({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, opacity: 0 });
  
  // State to track active formatting (e.g. is Bold active?)
  const [activeFormats, setActiveFormats] = useState({
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      justifyLeft: false,
      justifyCenter: false,
      justifyRight: false,
      justifyFull: false,
      insertUnorderedList: false,
      insertOrderedList: false,
  });

  const checkActiveFormats = useCallback(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      
      try {
          setActiveFormats({
              bold: doc.queryCommandState('bold'),
              italic: doc.queryCommandState('italic'),
              underline: doc.queryCommandState('underline'),
              strikethrough: doc.queryCommandState('strikethrough'),
              justifyLeft: doc.queryCommandState('justifyLeft'),
              justifyCenter: doc.queryCommandState('justifyCenter'),
              justifyRight: doc.queryCommandState('justifyRight'),
              justifyFull: doc.queryCommandState('justifyFull'),
              insertUnorderedList: doc.queryCommandState('insertUnorderedList'),
              insertOrderedList: doc.queryCommandState('insertOrderedList'),
          });
      } catch (e) {
          // Ignore errors if selection is invalid
      }
  }, [iframeRef]);

  const updateToolbar = useCallback(() => {
    if (state.inlineEditingElementId && iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const el = doc.querySelector<HTMLElement>(`[data-builder-id="${state.inlineEditingElementId}"]`);
      
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollX = doc.defaultView?.scrollX || 0;
        const scrollY = doc.defaultView?.scrollY || 0;
        
        // Position: Top Right relative to the element
        // We set Left to the right edge, and CSS transform will pull it back 100% to align the right edge
        setToolbarPos({
          top: rect.top + scrollY - 50, // 50px above element
          left: rect.right + scrollX, 
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

            // Check formats immediately after selection
            checkActiveFormats();

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
                doc.removeEventListener('selectionchange', checkActiveFormats);
            };
            el.addEventListener('blur', onBlur);
            doc.addEventListener('selectionchange', checkActiveFormats);
        }
      }
    } else {
      setToolbarPos(prev => ({ ...prev, opacity: 0 }));
    }
  }, [state.inlineEditingElementId, iframeRef, dispatch, checkActiveFormats]);

  useEffect(() => {
    updateToolbar();
    const interval = setInterval(updateToolbar, 100);
    return () => clearInterval(interval);
  }, [updateToolbar]);

  const handleCommand = (command: string, value?: string) => {
    iframeRef.current?.contentDocument?.execCommand(command, false, value);
    // Keep focus on element
    const el = iframeRef.current?.contentDocument?.querySelector(`[data-builder-id="${state.inlineEditingElementId}"]`) as HTMLElement;
    el?.focus();
    checkActiveFormats();
  };

  const handleLink = () => {
    const url = prompt(t('link') || 'Enter URL', 'https://');
    if (url) {
      handleCommand('createLink', url);
    }
  };

  if (toolbarPos.opacity === 0) return null;

  // Button Component for consistency
  const ToolbarBtn = ({ cmd, icon: Icon, active, title, value }: any) => (
      <button 
        title={title} 
        onMouseDown={(e) => { e.preventDefault(); handleCommand(cmd, value); }} // Use onMouseDown to prevent focus loss
        className={`p-1.5 rounded transition-all ${
            active 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' 
            : 'hover:bg-gray-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
          <Icon size={16} strokeWidth={active ? 2.5 : 2} />
      </button>
  );

  return (
    <div
      className="absolute bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 flex items-center p-1.5 z-[60] transition-opacity duration-150 gap-1"
      style={{ 
        top: toolbarPos.top, 
        left: toolbarPos.left, 
        opacity: toolbarPos.opacity,
        transform: 'translateX(-100%)', // Align right edge
        pointerEvents: 'auto'
      }}
      onMouseDown={e => e.preventDefault()} // Prevent blur when clicking toolbar bg
    >
      {/* Font Styles */}
      <div className="flex gap-0.5">
        <ToolbarBtn cmd="bold" icon={Bold} active={activeFormats.bold} title={t('bold')} />
        <ToolbarBtn cmd="italic" icon={Italic} active={activeFormats.italic} title={t('italic')} />
        <ToolbarBtn cmd="underline" icon={Underline} active={activeFormats.underline} title={t('underline')} />
        <ToolbarBtn cmd="strikeThrough" icon={Strikethrough} active={activeFormats.strikethrough} title={t('strikethrough')} />
      </div>
      
      <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1"></div>

      {/* Alignment */}
      <div className="flex gap-0.5">
        <ToolbarBtn cmd="justifyLeft" icon={AlignLeft} active={activeFormats.justifyLeft} title={t('alignLeft')} />
        <ToolbarBtn cmd="justifyCenter" icon={AlignCenter} active={activeFormats.justifyCenter} title={t('alignCenter')} />
        <ToolbarBtn cmd="justifyRight" icon={AlignRight} active={activeFormats.justifyRight} title={t('alignRight')} />
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1"></div>

      {/* Size & Color */}
      <div className="flex gap-1 items-center">
          {/* Font Size Selector */}
          <div className="relative group p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Text Size">
              <Type size={16} className="text-slate-600 dark:text-slate-300" />
              <select 
                onChange={(e) => handleCommand('fontSize', e.target.value)} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                defaultValue="3"
                onMouseDown={(e) => e.stopPropagation()} // Allow click to open select
              >
                <option value="1">Tiny (10px)</option>
                <option value="2">Small (13px)</option>
                <option value="3">Normal (16px)</option>
                <option value="4">Large (18px)</option>
                <option value="5">XL (24px)</option>
                <option value="6">2XL (32px)</option>
                <option value="7">3XL (48px)</option>
              </select>
          </div>

          {/* Color Picker */}
          <div className="relative group p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Text Color">
              <Palette size={16} className="text-slate-600 dark:text-slate-300" />
              <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gradient-to-tr from-red-500 to-blue-500" />
              <input 
                type="color" 
                onChange={(e) => handleCommand('foreColor', e.target.value)} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onMouseDown={(e) => e.stopPropagation()}
              />
          </div>
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1"></div>
      
      {/* Lists & Link */}
      <div className="flex gap-0.5">
        <button onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300" title={t('link')}>
            <Link size={16} />
        </button>
        <ToolbarBtn cmd="insertUnorderedList" icon={List} active={activeFormats.insertUnorderedList} title={t('unorderedList')} />
        <ToolbarBtn cmd="insertOrderedList" icon={ListOrdered} active={activeFormats.insertOrderedList} title={t('orderedList')} />
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1"></div>

      <button onMouseDown={(e) => { e.preventDefault(); handleCommand('removeFormat'); }} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded text-slate-400 transition-colors" title="Clear Formatting">
          <RemoveFormatting size={16} />
      </button>

    </div>
  );
}