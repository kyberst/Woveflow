import React from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import GlobalStylesView from './GlobalStylesView';
import ElementStyles from './ElementStyles';

export default function StylesPanel() {
  const { state } = useEditor();

  // If an element is selected, show the detailed ElementStyles editor.
  // Otherwise, show the global style managers (colors, fonts, tokens).
  if (state.selectedElementId) {
      return <ElementStyles />;
  }

  return <GlobalStylesView />;
}