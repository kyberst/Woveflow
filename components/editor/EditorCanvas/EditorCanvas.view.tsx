import React from 'react';
import { createPortal } from 'react-dom'; // Corrected import
import { ViewMode } from '../../../types';
import EmptyCanvasPlaceholder from '../EmptyCanvasPlaceholder';
import SelectionOverlay from '../SelectionOverlay';
import HoverOverlay from '../HoverOverlay';
import InlineTextToolbar from '../InlineTextToolbar';
import SmartGuidesOverlay from '../SmartGuidesOverlay';
import EditorModals from './EditorModals';
import { JSONRenderer } from './JSONRenderer';

interface EditorCanvasViewProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isPreviewing: boolean;
  viewMode: ViewMode;
  isDragging: boolean;
  isCanvasEmpty: boolean;
  isIframeMounted: boolean;
  setIsIframeMounted: (mounted: boolean) => void;
  getCanvasWidth: (mode: ViewMode) => string;
  dynamicCss: string;
  initialSrcDoc: string;
  currentPageContent: any; // BuilderElementNode[]
  components: any; // BuilderComponent[]
  zoom: number;
}

export default function EditorCanvasView({
  iframeRef,
  isPreviewing,
  viewMode,
  isDragging,
  isCanvasEmpty,
  isIframeMounted,
  setIsIframeMounted,
  getCanvasWidth,
  dynamicCss,
  initialSrcDoc,
  currentPageContent,
  components,
  zoom,
}: EditorCanvasViewProps) {
  return (
    <div className={`relative flex-grow bg-dots bg-gray-100 dark:bg-[#020617] flex justify-center overflow-auto ${isPreviewing ? '' : 'py-12 px-12'}`}>
       <div 
         style={{ 
            width: isPreviewing ? '100%' : getCanvasWidth(viewMode), 
            transform: `scale(${(isPreviewing ? 100 : zoom) / 100})`, 
            transformOrigin: 'top center',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease' 
         }}
         className={`relative bg-white shadow-2xl min-h-[800px] transition-all ${isPreviewing ? '' : 'ring-1 ring-black/5 dark:ring-white/10'}`}
       >
         <iframe 
            ref={iframeRef} title="Editor" className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups" srcDoc={initialSrcDoc}
            onLoad={() => setIsIframeMounted(true)}
         />
         {isIframeMounted && iframeRef.current?.contentDocument?.getElementById('root') && currentPageContent && createPortal(
            <React.StrictMode>
                <JSONRenderer content={currentPageContent} components={components} viewMode={viewMode} />
            </React.StrictMode>,
            iframeRef.current.contentDocument.getElementById('root')!
         )}
         {isIframeMounted && iframeRef.current?.contentDocument?.head && createPortal(
            <style id="dynamic-editor-styles">{dynamicCss}</style>,
            iframeRef.current.contentDocument.head
         )}
         {isCanvasEmpty && !isPreviewing && <EmptyCanvasPlaceholder />}
         {!isPreviewing && !isDragging && <HoverOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <SelectionOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <InlineTextToolbar iframeRef={iframeRef} />}
         {!isPreviewing && <SmartGuidesOverlay iframeRef={iframeRef} />}
       </div>
       <EditorModals iframeRef={iframeRef} />
    </div>
  );
}