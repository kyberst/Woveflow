import React, { useMemo } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { STYLE_PROPERTIES } from '../../../../constants';
import StyleInput from './StyleInput';
// Corrected import path for `findNode`
import { findNode } from '../../../../utils/tree/index';
import BoxModelControl from '../../../../components/layout/Sidebar/panels/StylesPanel/BoxModelControl'; // Import BoxModelControl

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function StylesPanel({ iframeRef }: Props) {
  const { state } = useEditor();
  const { t } = useTranslation();

  const selectedNode = useMemo(() => {
    if (!state.selectedElementId) return null;
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return null;
    return findNode(currentPage.content, state.selectedElementId);
  }, [state.selectedElementId, state.pages, state.currentPageId]);

  const getCascadedStyle = (propName: keyof React.CSSProperties) => {
    if (!selectedNode) return '';

    const mobileStyle = selectedNode.styles.mobile?.[propName];
    const tabletStyle = selectedNode.styles.tablet?.[propName];
    const desktopStyle = selectedNode.styles.desktop?.[propName];

    if (state.viewMode === 'mobile' && mobileStyle !== undefined) return mobileStyle;
    if ((state.viewMode === 'mobile' || state.viewMode === 'tablet') && tabletStyle !== undefined) return tabletStyle;
    
    return desktopStyle ?? '';
  };
  
  if (!state.selectedElementId) {
    return <div className="p-4 text-sm text-slate-500">Select an element to edit styles.</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <BoxModelControl /> {/* Render BoxModelControl here */}

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
                options={(prop as any).options}
                value={getCascadedStyle(prop.prop as any) as string}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}