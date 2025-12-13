import React, { useMemo } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { STYLE_PROPERTIES } from '../../../../constants';
import StyleInput from './StyleInput';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function StylesPanel({ iframeRef }: Props) {
  const { state } = useEditor();
  const { t } = useTranslation();

  const computedStyles = useMemo(() => {
    if (state.selectedElementId && iframeRef.current?.contentWindow) {
      const el = iframeRef.current.contentDocument?.querySelector(`[data-builder-id="${state.selectedElementId}"]`);
      if (el) {
        return iframeRef.current.contentWindow.getComputedStyle(el);
      }
    }
    return null;
  }, [state.selectedElementId, iframeRef, state.pages]); // Re-compute when page content changes

  if (!state.selectedElementId) {
    return <div className="p-4 text-sm text-slate-500">Select an element to edit styles.</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      {STYLE_PROPERTIES.map(group => (
        <div key={group.group} className="border-b dark:border-slate-700">
          <h4 className="p-2 text-sm font-bold bg-gray-50 dark:bg-slate-900/50">{t(group.group)}</h4>
          <div className="p-2 space-y-2">
            {group.properties.map(prop => (
              <StyleInput
                key={prop.prop}
                label={prop.label}
                prop={prop.prop}
                type={prop.type}
                options={prop.options}
                value={computedStyles?.[prop.prop as any] || ''}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}