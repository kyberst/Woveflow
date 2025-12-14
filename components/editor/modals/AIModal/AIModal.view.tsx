import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AIModalViewProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isGenerating: boolean;
  handleAIEdit: () => void;
  handleCancel: () => void;
}

export default function AIModalView({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  handleAIEdit,
  handleCancel,
}: AIModalViewProps) {
  const { t } = useTranslation();

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
          <button onClick={handleCancel} className="px-4 py-2 text-gray-600">{t('cancel')}</button>
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