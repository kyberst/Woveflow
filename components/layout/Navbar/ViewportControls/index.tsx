import React from 'react';
import ViewportControlsView from './ViewportControls.view';
import { useViewportControls } from './useViewportControls.hook';

export default function ViewportControls() {
  const {
    viewMode,
    zoom,
    setViewMode,
    setZoom,
    zoomPresets,
  } = useViewportControls();

  return (
    <ViewportControlsView
      viewMode={viewMode}
      zoom={zoom}
      setViewMode={setViewMode}
      setZoom={setZoom}
      zoomPresets={zoomPresets}
    />
  );
}