import React from 'react';
import EditorActionsView from './EditorActions.view';
import { useEditorActions } from './useEditorActions.hook';

export default function EditorActions() {
    const {
        isPreviewing,
        handleUndo,
        handleRedo,
        handleTogglePreview,
    } = useEditorActions();

    return (
        <EditorActionsView
            isPreviewing={isPreviewing}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            handleTogglePreview={handleTogglePreview}
        />
    );
}