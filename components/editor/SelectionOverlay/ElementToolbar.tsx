import React from 'react';
import ElementToolbarView from './ElementToolbar/ElementToolbar.view';
import { useElementToolbar } from './ElementToolbar/useElementToolbar.hook';

export default function ElementToolbar() {
  const {
    handleAction,
    handleDragStart,
    handleDragEnd,
    handleSelectParent,
    handleToggleSettingsModal,
    handleToggleCodeEditorModal,
    handleToggleAIModal,
    handleToggleSaveComponentModal,
  } = useElementToolbar();

  return (
    <ElementToolbarView
      handleAction={handleAction}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      handleSelectParent={handleSelectParent}
      handleToggleSettingsModal={handleToggleSettingsModal}
      handleToggleCodeEditorModal={handleToggleCodeEditorModal}
      handleToggleAIModal={handleToggleAIModal}
      handleToggleSaveComponentModal={handleToggleSaveComponentModal}
    />
  );
}