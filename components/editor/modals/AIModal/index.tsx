import React from 'react';
import AIModalView from './AIModal.view';
import { useAIModal } from './useAIModal.hook';

export default function AIModal() {
  const {
    aiPrompt,
    setAiPrompt,
    isGenerating,
    handleAIEdit,
    handleCancel,
  } = useAIModal();

  return (
    <AIModalView
      aiPrompt={aiPrompt}
      setAiPrompt={setAiPrompt}
      isGenerating={isGenerating}
      handleAIEdit={handleAIEdit}
      handleCancel={handleCancel}
    />
  );
}