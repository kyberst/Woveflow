import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { ViewMode } from '../../../types';
import SelectionOverlay from '../SelectionOverlay';
import AIModal from '../modals/AIModal';
import { useIframeBridge } from './useIframeBridge';
import EmptyCanvasPlaceholder from '../EmptyCanvasPlaceholder';
import AddComponentModal from '../modals/AddComponentModal';
import HoverOverlay from '../HoverOverlay';
import SettingsModal from '../modals/SettingsModal';
import CodeEditorModal from '../modals/CodeEditorModal';
import SaveComponentModal from '../modals/SaveComponentModal';
import InlineTextToolbar from '../InlineTextToolbar';

const getCanvasWidth = (viewMode: ViewMode) => {
  switch (viewMode) {
    case ViewMode.Mobile: return '375px';
    case ViewMode.Tablet: return '768px';
    default: return '100%';
  }
};

export default function EditorCanvas() {
  const { state } = useEditor();
  const iframeRef = useIframeBridge();
  const { isPreviewing } = state;

  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  const isCanvasEmpty = !currentPage?.content?.trim();

  return (
    <div className={`relative flex-grow bg-gray-200 dark:bg-slate-900 flex justify-center overflow-auto builder-canvas-wrapper ${isPreviewing ? '' : 'pt-8 pb-32'}`}>
       <div 
         style={{ 
            width: isPreviewing ? '100%' : getCanvasWidth(state.viewMode), 
            transform: `scale(${(isPreviewing ? 100 : state.zoom) / 100})`, 
            transformOrigin: 'top center',
            transition: 'width 0.3s ease, transform 0.3s ease' 
         }}
         className="relative bg-white shadow-2xl min-h-full"
       >
         <iframe 
            ref={iframeRef}
            title="Editor"
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts"
            srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${currentPage?.content || ''}</body></html>`}
         />
         {isCanvasEmpty && !isPreviewing && <EmptyCanvasPlaceholder />}
         {!isPreviewing && <HoverOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <SelectionOverlay iframeRef={iframeRef} />}
         {!isPreviewing && <InlineTextToolbar iframeRef={iframeRef} />}
       </div>
       {!isPreviewing && state.showAIModal && <AIModal />}
       {state.showAddComponentModal && <AddComponentModal />}
       {state.showSettingsModal && <SettingsModal iframeRef={iframeRef} />}
       {state.showCodeEditorModal && <CodeEditorModal iframeRef={iframeRef} />}
       {state.showSaveComponentModal && <SaveComponentModal iframeRef={iframeRef} />}
    </div>
  );
}