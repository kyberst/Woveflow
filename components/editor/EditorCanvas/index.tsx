import React from 'react';
import EditorCanvasView from './EditorCanvas.view';
import { useEditorCanvas } from './useEditorCanvas.hook';
import { useIframeBridge } from './IframeBridge/useIframeBridge.hook';

export default function EditorCanvas() {
  const iframeRef = useIframeBridge();
  const {
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
  } = useEditorCanvas();

  return (
    <EditorCanvasView
      iframeRef={iframeRef}
      isPreviewing={isPreviewing}
      viewMode={viewMode}
      isDragging={isDragging}
      isCanvasEmpty={isCanvasEmpty}
      isIframeMounted={isIframeMounted}
      setIsIframeMounted={setIsIframeMounted}
      getCanvasWidth={getCanvasWidth}
      dynamicCss={dynamicCss}
      initialSrcDoc={initialSrcDoc}
      currentPageContent={currentPageContent}
      components={components}
      zoom={zoom}
    />
  );
}