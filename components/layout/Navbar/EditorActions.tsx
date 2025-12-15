import React from 'react';
import EditorActionsView from './EditorActions/EditorActions.view';
import { useEditorActions } from './EditorActions/useEditorActions.hook';

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