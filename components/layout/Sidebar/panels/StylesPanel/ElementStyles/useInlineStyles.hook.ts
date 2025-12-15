import { useMemo } from 'react';
import { useEditor } from '../../../../../../hooks/useEditor';
import { ViewMode } from '../../../../../../types';
import { CSSProperties } from 'react';
// Corrected import path for `findNode`
import { findNode } from '../../../../../../utils/tree/index';

export const useInlineStyles = () => {
  const { state, dispatch } = useEditor();

  const selectedNode = useMemo(() => {
    if (!state.selectedElementId) return null;
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    return currentPage ? findNode(currentPage.content, state.selectedElementId) : null;
  }, [state.selectedElementId, state.pages, state.currentPageId]);

  const isOverridden = (prop: keyof CSSProperties) => {
      if (!selectedNode) return false;
      const styles = state.viewMode === ViewMode.Mobile ? selectedNode.styles.mobile 
                   : state.viewMode === ViewMode.Tablet ? selectedNode.styles.tablet 
                   : selectedNode.styles.desktop;
      return styles && (styles as any)[prop] !== undefined;
  };

  const getEffectiveStyle = (prop: keyof CSSProperties) => {
    if (!selectedNode) return '';
    const { mobile, tablet, desktop } = selectedNode.styles;
    
    if (state.viewMode === ViewMode.Mobile) {
        if (mobile && (mobile as any)[prop] !== undefined) return (mobile as any)[prop];
        if (tablet && (tablet as any)[prop] !== undefined) return (tablet as any)[prop];
        return (desktop as any)[prop] ?? '';
    }
    if (state.viewMode === ViewMode.Tablet) {
        if (tablet && (tablet as any)[prop] !== undefined) return (tablet as any)[prop];
        return (desktop as any)[prop] ?? '';
    }
    return (desktop as any)[prop] ?? '';
  };

  const handleStyleChange = (prop: string, value: string) => {
    if (state.selectedElementId) {
        dispatch({ 
            type: 'UPDATE_ELEMENT_STYLE', 
            payload: { 
                elementId: state.selectedElementId, 
                property: prop, 
                value, 
                viewMode: state.viewMode 
            } 
        });
        dispatch({ type: 'ADD_HISTORY' });
    }
  };

  return { selectedNode, viewMode: state.viewMode, isOverridden, getEffectiveStyle, handleStyleChange, dispatch };
};