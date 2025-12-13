import React, { useState, useEffect, useMemo } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

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
            <div key="src">
                <label className="text-xs font-semibold">{t('imageSrc')}</label>
                <input
                    type="text"
                    value={srcValue}
                    onChange={(e) => setSrcValue(e.target.value)}
                    onBlur={() => handleBlur('attribute', 'src')}
                    className="w-full p-1 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600"
                />
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
  }, [element, textValue, srcValue, altValue, hrefValue]);

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto text-sm">
        {renderFields}
    </div>
  );
}