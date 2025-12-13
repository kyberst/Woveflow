import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { generateAIContent } from '../../../../services/geminiService';
import { useTranslation } from 'react-i18next';

export default function AIModal() {
  const { state, dispatch } = useEditor();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useTranslation();

  const handleAIEdit = async () => {
    if (!state.selectedElementId) return;
    setIsGenerating(true);
    try {
      const currentPage = state.pages.find(p => p.id === state.currentPageId);
      if (!currentPage) return;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentPage.content;
      const el = tempDiv.querySelector(`[data-builder-id="${state.selectedElementId}"]`);

      if (el) {
        const newHTML = await generateAIContent(aiPrompt, el.innerHTML);
        el.innerHTML = newHTML;
        dispatch({
          type: 'UPDATE_PAGE_CONTENT',
          payload: { pageId: state.currentPageId, content: tempDiv.innerHTML }
        });
        dispatch({ type: 'ADD_HISTORY' });
      }
    } catch (e) {
      alert(e);
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'TOGGLE_AI_MODAL', payload: false });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-96 shadow-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Sparkles className="mr-2 text-yellow-500" /> {t('generateContent')}
        </h3>
        <textarea 
          className="w-full p-2 border rounded mb-4 h-32 dark:bg-slate-700 dark:border-slate-600"
          placeholder={t('aiPlaceholder')}
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_AI_MODAL', payload: false })} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
          <button 
            onClick={handleAIEdit} 
            disabled={isGenerating}
            className="px-4 py-2 bg-builder-primary text-white rounded flex items-center disabled:opacity-50"
          >
            {isGenerating ? t('generating') : t('generate')}
          </button>
        </div>
      </div>
    </div>
  );
}