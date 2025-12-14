import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEditor } from '../../../hooks/useEditor';
import { ViewMode } from '../../../types';
import SelectionOverlay from '../SelectionOverlay';
import AIModal from '../modals/AIModal';
import { useIframeBridge } from './useIframeBridge';
import EmptyCanvasPlaceholder from '../EmptyCanvasPlaceholder';
import AddComponentModal from '../modals/AddComponentModal';
import HoverOverlay from '../HoverOverlay';
import CodeEditorModal from '../modals/CodeEditorModal';
import SaveComponentModal from '../modals/SaveComponentModal';
import InlineTextToolbar from '../InlineTextToolbar';
import { generateGlobalStyles, generateDesignTokensCSS } from '../../../utils/jsonToHtml';
import ContextMenu from '../ContextMenu';
import SmartGuidesOverlay from '../SmartGuidesOverlay';
import SettingsModal from '../modals/SettingsModal';
import SiteSettingsModal from '../modals/SiteSettingsModal';
import { DEFAULT_BREAKPOINTS } from '../../../constants';
import { JSONRenderer } from './JSONRenderer';

export default function EditorCanvas() {
  const { state } = useEditor();
  const iframeRef = useIframeBridge(); // Bridge attaches event listeners
  const { isPreviewing, viewMode, isDragging } = state;
  const [isIframeMounted, setIsIframeMounted] = useState(false);

  const currentSiteConfig = state.sites.find(s => s.name === state.currentSite);
  const breakpoints = currentSiteConfig?.breakpoints || DEFAULT_BREAKPOINTS;

  const getCanvasWidth = (mode: ViewMode) => {
    switch (mode) {
      case ViewMode.Mobile: return `${breakpoints.mobile}px`;
      case ViewMode.Tablet: return `${breakpoints.tablet}px`;
      default: return '100%';
    }
  };

  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  const isCanvasEmpty = !currentPage?.content || currentPage.content.length === 0;

  // Generate CSS strings for dynamic injection
  const dynamicCss = useMemo(() => {
    const globalClassStyles = generateGlobalStyles(state.globalClasses);
    const designTokenStyles = generateDesignTokensCSS(state.designTokens);
    return `${designTokenStyles}\n\n${globalClassStyles}`;
  }, [state.globalClasses, state.designTokens]);

  const handleIframeLoad = () => {
      setIsIframeMounted(true);
  };

  // Static skeleton for the iframe to load once
  const initialSrcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style id="base-styles">
        body { margin: 0; min-height: 100vh; }
        /* Disable selection highlight during drag to prevent visual clutter */
        body.is-dragging { user-select: none; }
        
        /* Modern Light Blue Selection Highlight */
        ::selection {
            background-color: #38bdf8; /* Tailwind Sky 400 */
            color: #ffffff;
        }
    </style>
</head>
<body class="bg-white">
    <div id="root"></div>
</body>
</html>`;

  // Helper to get mounting points inside iframe
  const mountNode = iframeRef.current?.contentDocument?.getElementById('root');
  const headNode = iframeRef.current?.contentDocument?.head;

  return (
    <div className={`relative flex-grow bg-dots bg-gray-100 dark:bg-[#020617] flex justify-center overflow-auto builder-canvas-wrapper ${isPreviewing ? '' : 'py-12 px-12'}`}>
       <div 
         style={{ 
            width: isPreviewing ? '100%' : getCanvasWidth(viewMode), 
            transform: `scale(${(isPreviewing ? 100 : state.zoom) / 100})`, 
            transformOrigin: 'top center',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease' 
         }}
         className={`relative bg-white shadow-2xl min-h-[800px] transition-all ${isPreviewing ? '' : 'ring-1 ring-black/5 dark:ring-white/10'}`}
       >
         <iframe 
            ref={iframeRef}
            title="Editor"
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups"
            srcDoc={initialSrcDoc}
            onLoad={handleIframeLoad}
         />
         
         {/* REACT PORTALS: Render Content INSIDE the iframe */}
         {isIframeMounted && mountNode && currentPage && createPortal(
            <React.StrictMode>
                <JSONRenderer 
                    content={currentPage.content} 
                    components={state.components} 
                    viewMode={viewMode} 
                />
            </React.StrictMode>,
            mountNode
         )}

         {/* REACT PORTALS: Render Dynamic Styles INSIDE the iframe head */}
         {isIframeMounted && headNode && createPortal(
            <style id="dynamic-editor-styles">{dynamicCss}</style>,
            headNode
         )}

         {isCanvasEmpty && !isPreviewing && <EmptyCanvasPlaceholder />}
         {!isPreviewing && !isDragging && <HoverOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <SelectionOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <InlineTextToolbar iframeRef={iframeRef} />}
         {!isPreviewing && <SmartGuidesOverlay iframeRef={iframeRef} />}
       </div>
       {!isPreviewing && state.contextMenu && <ContextMenu />}
       {!isPreviewing && state.showAIModal && <AIModal />}
       {state.showAddComponentModal && <AddComponentModal />}
       {state.showCodeEditorModal && <CodeEditorModal iframeRef={iframeRef} />}
       {state.showSaveComponentModal && <SaveComponentModal iframeRef={iframeRef} />}
       {state.showSettingsModal && <SettingsModal iframeRef={iframeRef} />}
       {state.showSiteSettingsModal && <SiteSettingsModal />}
    </div>
  );
}