import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { processImage } from '../../../../services/imageOptimizer';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function ContentPanel({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [element, setElement] = useState<HTMLElement | null>(null);
  
  // Local state to avoid re-dispatching on every keystroke
  const [textValue, setTextValue] = useState('');
  const [srcValue, setSrcValue] = useState('');
  const [altValue, setAltValue] = useState('');
  const [hrefValue, setHrefValue] = useState('');
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current?.contentDocument) {
      const el = iframeRef.current.contentDocument.querySelector<HTMLElement>(`[data-builder-id="${state.selectedElementId}"]`);
      setElement(el);
      if (el) {
        setTextValue(el.innerText);
        setSrcValue(el.getAttribute('src') || '');
        setAltValue(el.getAttribute('alt') || '');
        setHrefValue(el.getAttribute('href') || '');
      }
    }
  }, [state.selectedElementId, iframeRef, state.pages]);

  const handleBlur = (type: 'text' | 'attribute', attrName?: string) => {
    if (!state.selectedElementId) return;

    if (type === 'text') {
        dispatch({ type: 'UPDATE_ELEMENT_TEXT', payload: { elementId: state.selectedElementId, text: textValue }});
    } else if (attrName) {
        const value = attrName === 'src' ? srcValue : attrName === 'alt' ? altValue : hrefValue;
        dispatch({ type: 'UPDATE_ELEMENT_ATTRIBUTE', payload: { elementId: state.selectedElementId, attribute: attrName, value } });
    }
    dispatch({ type: 'ADD_HISTORY' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !state.selectedElementId) return;

      setIsOptimizing(true);
      try {
          const variants = await processImage(file);
          
          // 1. Update main src (Default to desktop)
          dispatch({ 
              type: 'UPDATE_ELEMENT_ATTRIBUTE', 
              payload: { elementId: state.selectedElementId, attribute: 'src', value: variants.desktop } 
          });
          setSrcValue(variants.desktop);

          // 2. Store variants in data attribute
          dispatch({ 
              type: 'UPDATE_ELEMENT_ATTRIBUTE', 
              payload: { elementId: state.selectedElementId, attribute: 'data-variants', value: JSON.stringify(variants) } 
          });

          dispatch({ type: 'ADD_HISTORY' });
      } catch (err) {
          console.error("Optimization failed", err);
          alert(t('optimizationFailed') || "Image optimization failed.");
      } finally {
          setIsOptimizing(false);
      }
  };

  const renderFields = useMemo(() => {
    if (!element) return <div className="p-4 text-sm text-slate-500">Select an element to edit its content.</div>;

    const tag = element.tagName.toLowerCase();
    let fields = [];

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button', 'div'].includes(tag)) {
        fields.push(
            <div key="text">
                <label className="text-xs font-semibold">{t('text')}</label>
                <textarea
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onBlur={() => handleBlur('text')}
                    className="w-full p-1 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
            </div>
        );
    }
    if (tag === 'img') {
        fields.push(
            <div key="src-group" className="space-y-3">
                <div key="src">
                    <label className="text-xs font-semibold">{t('imageSrc')}</label>
                    <input
                        type="text"
                        value={srcValue}
                        onChange={(e) => setSrcValue(e.target.value)}
                        onBlur={() => handleBlur('attribute', 'src')}
                        className="w-full p-1 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 text-xs text-slate-500"
                        placeholder="https://..."
                    />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center">
                            <ImageIcon size={12} className="mr-1"/> {t('optimizeImage') || "Smart Optimization"}
                        </label>
                        {isOptimizing && <Loader2 size={12} className="animate-spin text-blue-500" />}
                    </div>
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isOptimizing}
                        className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 py-2 rounded text-xs transition-colors shadow-sm"
                    >
                        <Upload size={14} />
                        <span>{isOptimizing ? t('optimizing') : t('uploadAndOptimize') || "Upload & Optimize"}</span>
                    </button>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-2 leading-tight">
                        {t('optimizeDescription') || "Automatically generates WebP variants for Mobile, Tablet, and Desktop."}
                    </p>
                </div>
            </div>,
            <div key="alt">
                <label className="text-xs font-semibold">{t('altText')}</label>
                <input
                    type="text"
                    value={altValue}
                    onChange={(e) => setAltValue(e.target.value)}
                    onBlur={() => handleBlur('attribute', 'alt')}
                    className="w-full p-1 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
            </div>
        );
    }
     if (tag === 'a') {
        fields.push(
             <div key="href">
                <label className="text-xs font-semibold">{t('linkHref')}</label>
                <input
                    type="text"
                    value={hrefValue}
                    onChange={(e) => setHrefValue(e.target.value)}
                    onBlur={() => handleBlur('attribute', 'href')}
                    className="w-full p-1 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
            </div>
        );
    }
    return fields.length > 0 ? fields : <div className="text-sm text-slate-500">No content options for this element.</div>;
  }, [element, textValue, srcValue, altValue, hrefValue, isOptimizing]);

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto text-sm">
        {renderFields}
    </div>
  );
}