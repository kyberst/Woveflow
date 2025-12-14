import { useMemo, useState } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { ViewMode } from '../../../types';
import { generateGlobalStyles, generateDesignTokensCSS } from '../../../utils/jsonToHtml';
import { DEFAULT_BREAKPOINTS } from '../../../constants';

export function useEditorCanvas() {
  const { state } = useEditor();
  const { isPreviewing, viewMode, isDragging } = state;
  const [isIframeMounted, setIsIframeMounted] = useState(false);

  const breakpoints = state.sites.find(s => s.name === state.currentSite)?.breakpoints || DEFAULT_BREAKPOINTS;
  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  const isCanvasEmpty = !currentPage?.content || currentPage.content.length === 0;

  const getCanvasWidth = (mode: ViewMode) => {
    if (mode === ViewMode.Mobile) return `${breakpoints.mobile}px`;
    if (mode === ViewMode.Tablet) return `${breakpoints.tablet}px`;
    return '100%';
  };

  const dynamicCss = useMemo(() => {
    return `${generateDesignTokensCSS(state.designTokens)}\n\n${generateGlobalStyles(state.globalClasses)}`;
  }, [state.globalClasses, state.designTokens]);

  const initialSrcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style id="base-styles">
        body { margin: 0; min-height: 100vh; }
        body.is-dragging { user-select: none; }
        /* Celeste moderno selection style */
        ::selection { background-color: #0ea5e9; color: #ffffff; } 
    </style>
</head>
<body class="bg-white"><div id="root"></div></body>
</html>`;

  return {
    isPreviewing,
    viewMode,
    isDragging,
    isCanvasEmpty,
    isIframeMounted,
    setIsIframeMounted,
    getCanvasWidth,
    dynamicCss,
    initialSrcDoc,
    currentPageContent: currentPage?.content,
    components: state.components,
    zoom: state.zoom,
  };
}