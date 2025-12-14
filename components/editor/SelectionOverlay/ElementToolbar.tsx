import React from 'react';
import { ArrowUp, ArrowDown, Layers, Sparkles, Trash2, Code, PackagePlus, Move, Settings } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

export default function ElementToolbar() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();

  const handleAction = (type: any) => {
    dispatch({ type });
    dispatch({ type: 'ADD_HISTORY' });
  };

  // Drag start handler for "Move" operation (Reordering)
  const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ id: state.selectedElementId }));
      e.dataTransfer.effectAllowed = 'move';
      dispatch({ type: 'SET_IS_DRAGGING', payload: true });
  };
  
  const handleDragEnd = () => {
      dispatch({ type: 'CLEAR_DRAG_STATE' });
  };

  return (
    <div className="absolute -top-10 right-0 bg-blue-600 text-white rounded-lg shadow-lg flex items-center pointer-events-auto scale-100 origin-bottom-right space-x-0.5 p-1">
      {/* 8.1 Move (Drag Handle) */}
      <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="p-1.5 hover:bg-blue-700 rounded cursor-move" 
        title={t('move') || "Move"}
      >
          <Move size={14} />
      </div>

      {/* 8.2 Select Parent */}
      <button onClick={() => dispatch({ type: 'SELECT_PARENT'})} className="p-1.5 hover:bg-blue-700 rounded" title={t('selectParent') || "Parent"}>
          <Layers size={14} />
      </button>

      {/* 8.3 Move Up */}
      <button onClick={() => handleAction('MOVE_UP')} className="p-1.5 hover:bg-blue-700 rounded" title={t('moveUp') || "Up"}>
          <ArrowUp size={14} />
      </button>
      
      {/* 8.4 Move Down */}
      <button onClick={() => handleAction('MOVE_DOWN')} className="p-1.5 hover:bg-blue-700 rounded" title={t('moveDown') || "Down"}>
          <ArrowDown size={14} />
      </button>

      <div className="w-px h-4 bg-blue-400 mx-1"></div>

      {/* 8.5 Settings (Configurar) */}
      <button onClick={() => dispatch({ type: 'TOGGLE_SETTINGS_MODAL', payload: true })} className="p-1.5 hover:bg-blue-700 rounded" title={t('properties') || "Settings"}>
          <Settings size={14} />
      </button>

      {/* 8.6 Code */}
      <button onClick={() => dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: true })} className="p-1.5 hover:bg-blue-700 rounded" title={t('editCode') || "Code"}>
          <Code size={14} />
      </button>
      
      {/* 8.7 AI Generation */}
      <button onClick={() => dispatch({ type: 'TOGGLE_AI_MODAL', payload: true })} className="p-1.5 hover:bg-blue-700 rounded" title={t('generateContent') || "AI"}>
          <Sparkles size={14} />
      </button>

      {/* 8.8 Save as Reusable */}
      <button onClick={() => dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: true })} className="p-1.5 hover:bg-blue-700 rounded" title={t('saveComponent') || "Save"}>
          <PackagePlus size={14} />
      </button>

      <div className="w-px h-4 bg-blue-400 mx-1"></div>

      {/* 8.9 Delete */}
      <button onClick={() => handleAction('DELETE_ELEMENT')} className="p-1.5 hover:bg-red-600 bg-red-500 rounded" title={t('delete')}>
          <Trash2 size={14} />
      </button>
    </div>
  );
}