import React from 'react';
import { ArrowUp, ArrowDown, Layers, Sparkles, Trash2, Code, PackagePlus, Move, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ElementToolbarViewProps {
  handleAction: (type: any) => void;
  handleDragStart: (e: React.DragEvent) => void;
  handleDragEnd: () => void;
  handleSelectParent: () => void;
  handleToggleSettingsModal: () => void;
  handleToggleCodeEditorModal: () => void;
  handleToggleAIModal: () => void;
  handleToggleSaveComponentModal: () => void;
}

export default function ElementToolbarView({
  handleAction,
  handleDragStart,
  handleDragEnd,
  handleSelectParent,
  handleToggleSettingsModal,
  handleToggleCodeEditorModal,
  handleToggleAIModal,
  handleToggleSaveComponentModal,
}: ElementToolbarViewProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute -top-10 right-0 bg-blue-600 text-white rounded-lg shadow-lg flex items-center pointer-events-auto scale-100 origin-bottom-right space-x-0.5 p-1">
      <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="p-1.5 hover:bg-blue-700 rounded cursor-move" 
        title={t('move') || "Move"}
      >
          <Move size={14} />
      </div>

      <button onClick={handleSelectParent} className="p-1.5 hover:bg-blue-700 rounded" title={t('selectParent') || "Parent"}>
          <Layers size={14} />
      </button>

      <button onClick={() => handleAction('MOVE_UP')} className="p-1.5 hover:bg-blue-700 rounded" title={t('moveUp') || "Up"}>
          <ArrowUp size={14} />
      </button>
      
      <button onClick={() => handleAction('MOVE_DOWN')} className="p-1.5 hover:bg-blue-700 rounded" title={t('moveDown') || "Down"}>
          <ArrowDown size={14} />
      </button>

      <div className="w-px h-4 bg-blue-400 mx-1"></div>

      <button onClick={handleToggleSettingsModal} className="p-1.5 hover:bg-blue-700 rounded" title={t('properties') || "Settings"}>
          <Settings size={14} />
      </button>

      <button onClick={handleToggleCodeEditorModal} className="p-1.5 hover:bg-blue-700 rounded" title={t('editCode') || "Code"}>
          <Code size={14} />
      </button>
      
      <button onClick={handleToggleAIModal} className="p-1.5 hover:bg-blue-700 rounded" title={t('generateContent') || "AI"}>
          <Sparkles size={14} />
      </button>

      <button onClick={handleToggleSaveComponentModal} className="p-1.5 hover:bg-blue-700 rounded" title={t('saveComponent') || "Save"}>
          <PackagePlus size={14} />
      </button>

      <div className="w-px h-4 bg-blue-400 mx-1"></div>

      <button onClick={() => handleAction('DELETE_ELEMENT')} className="p-1.5 hover:bg-red-600 bg-red-500 rounded" title={t('delete')}>
          <Trash2 size={14} />
      </button>
    </div>
  );
}