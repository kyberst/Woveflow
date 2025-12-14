import React from 'react';
import SelectionOverlayView from './SelectionOverlay.view';
import { useSelectionOverlay } from './useSelectionOverlay.hook';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function SelectionOverlay({ iframeRef }: Props) {
  const {
    overlayPos,
    handleAddClick,
  } = useSelectionOverlay(iframeRef);

  // If there's no selected element or overlay position, don't render anything from the view.
  // The hook handles `state.selectedElementId` itself.
  if (!overlayPos) return null;

  return (
    <SelectionOverlayView
      overlayPos={overlayPos}
      iframeRef={iframeRef}
      handleAddClick={handleAddClick}
    />
  );
}