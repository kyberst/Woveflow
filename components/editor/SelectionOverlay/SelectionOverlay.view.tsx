import React from 'react';
import ElementToolbar from './ElementToolbar';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ResizeHandles from './ResizeHandles';
import GridVisualizer from './GridVisualizer';

interface SelectionOverlayViewProps {
  overlayPos: DOMRect | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  handleAddClick: () => void;
}

export default function SelectionOverlayView({
  overlayPos,
  iframeRef,
  handleAddClick,
}: SelectionOverlayViewProps) {
  const { t } = useTranslation();

  if (!overlayPos) return null;

  return (
    <div 
      className="absolute border-2 border-blue-600 pointer-events-none z-50 transition-all duration-75"
      style={{
        top: overlayPos.top + (iframeRef.current?.contentWindow?.scrollY || 0),
        left: overlayPos.left + (iframeRef.current?.contentWindow?.scrollX || 0),
        width: overlayPos.width,
        height: overlayPos.height
      }}
    >
      {/* Visualizers (rendered behind toolbar/handles) */}
      <GridVisualizer iframeRef={iframeRef} overlayPos={overlayPos} />
      
      <ElementToolbar />
      <ResizeHandles overlayPos={overlayPos} iframeRef={iframeRef} />
      
      <button
        onClick={handleAddClick}
        title={t('addComponent') || 'Add Component'}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform z-50"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}