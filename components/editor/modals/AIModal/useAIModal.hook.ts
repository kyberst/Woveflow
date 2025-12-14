import { useState } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { generateAIContent } from '../../../../services/geminiService';
import { jsonToHtml } from '../../../../utils/jsonToHtml';
import { findNode } from '../../../../utils/tree'; // Corrected import to use findNode
import { ViewMode } from '../../../../types';

export function useAIModal() {
  const { state, dispatch } = useEditor();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIEdit = async () => {
    if (!state.selectedElementId) return;
    setIsGenerating(true);
    try {
      const currentPage = state.pages.find(p => p.id === state.currentPageId);
      if (!currentPage) return;
      
      // Use findNode instead of findNodeById
      const elementNode = findNode(currentPage.content, state.selectedElementId);
      
      if (elementNode) {
        const currentHtmlContent = jsonToHtml(elementNode.children, state.components, true, ViewMode.Desktop);
        const newHTML = await generateAIContent(aiPrompt, currentHtmlContent);
        
        dispatch({
          type: 'UPDATE_ELEMENT_innerHTML',
          payload: { elementId: state.selectedElementId, html: newHTML }
        });
        dispatch({ type: 'ADD_HISTORY' });
      }
    } catch (e: any) {
      alert(e.message || 'Failed to generate AI content.');
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'TOGGLE_AI_MODAL', payload: false });
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'TOGGLE_AI_MODAL', payload: false });
  };

  return {
    aiPrompt,
    setAiPrompt,
    isGenerating,
    handleAIEdit,
    handleCancel,
  };
}