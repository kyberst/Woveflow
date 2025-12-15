import React from 'react';
import ViewportControlsView from './ViewportControls/ViewportControls.view';
import { useViewportControls } from './ViewportControls/useViewportControls.hook';

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