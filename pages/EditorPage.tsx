import React from 'react';
import EditorPageView from './EditorPage/EditorPage.view';
import { useEditorPage } from './EditorPage/useEditorPage.hook';

export default function EditorPage() {
  const {
    isLoading,
    error,
    isSidebarPanelOpen,
    isPreviewing,
    dispatch,
  } = useEditorPage();

  return (
    <EditorPageView
      isLoading={isLoading}
      error={error}
      isSidebarPanelOpen={isSidebarPanelOpen}
      isPreviewing={isPreviewing}
      dispatch={dispatch}
    />
  );
}