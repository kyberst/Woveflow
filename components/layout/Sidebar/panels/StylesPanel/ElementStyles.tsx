import React from 'react';
import InlineStylesEditorView from './ElementStyles/InlineStylesEditor.view';

// This component is the main entry point for editing a selected element's styles.
export default function ElementStyles() {
    // The view itself contains the hook, adhering to the atomic pattern for this specific sub-view.
    return <InlineStylesEditorView />;
}