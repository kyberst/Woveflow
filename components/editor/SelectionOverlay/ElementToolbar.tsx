import React from 'react';
import { ArrowUp, ArrowDown, Layers, Settings, Sparkles, Trash2, Code, PackagePlus, Move } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';

export default function ElementToolbar() {
  const { state, dispatch } = useEditor();

  const handleContentAction = (type: 'MOVE_UP' | 'MOVE_DOWN' | 'DELETE_ELEMENT') => {
    dispatch({ type });
    dispatch({ type: 'ADD_HISTORY' });
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!state.selectedElementId) return;

    const startX = e.clientX;
    const startY = e.clientY;
    
    const tempContainer = document.createElement('div');
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (!currentPage) return;
    
    tempContainer.innerHTML = currentPage.content;
    const el = tempContainer.querySelector(`[data-builder-id="${state.selectedElementId}"]`) as HTMLElement;
    if (!el) return;

    // Ensure position is relative or absolute to be movable
    const initialPosition = el.style.position;
    if (initialPosition !== 'absolute' && initialPosition !== 'relative') {
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'position', value: 'relative' } });
    }
    
    const initialLeft = parseInt(el.style.left, 10) || 0;
    const initialTop = parseInt(el.style.top, 10) || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'left', value: `${initialLeft + dx}px` } });
        dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'top', value: `${initialTop + dy}px` } });
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        dispatch({ type: 'ADD_HISTORY' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div className="absolute -top-10 right-0 bg-builder-primary text-white rounded-lg shadow-lg flex items-center pointer-events-auto scale-100 origin-bottom-right">
      <button onMouseDown={handleDragStart} className="p-2 hover:bg-blue-600 cursor-move" title="Move"><Move size={16} /></button>
      <button onClick={() => handleContentAction('MOVE_UP')} className="p-2 hover:bg-blue-600" title="Move Up"><ArrowUp size={16} /></button>
      <button onClick={() => handleContentAction('MOVE_DOWN')} className="p-2 hover:bg-blue-600" title="Move Down"><ArrowDown size={16} /></button>
      <button onClick={() => dispatch({ type: 'SELECT_PARENT'})} className="p-2 hover:bg-blue-600 rounded-l-lg" title="Select Parent"><Layers size={16} /></button>
      <div className="w-px h-4 bg-blue-400"></div>
      <button onClick={() => dispatch({ type: 'TOGGLE_SETTINGS_MODAL', payload: true })} className="p-2 hover:bg-blue-600" title="Settings"><Settings size={16} /></button>
      <button onClick={() => dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: true })} className="p-2 hover:bg-blue-600" title="Edit Code"><Code size={16} /></button>
      <button onClick={() => dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: true })} className="p-2 hover:bg-blue-600" title="Save as Component"><PackagePlus size={16} /></button>
      <button onClick={() => dispatch({ type: 'TOGGLE_AI_MODAL', payload: true })} className="p-2 hover:bg-blue-600" title="AI Generation"><Sparkles size={16} /></button>
      <div className="w-px h-4 bg-blue-400"></div>
      <button onClick={() => handleContentAction('DELETE_ELEMENT')} className="p-2 hover:bg-red-600 bg-red-500 rounded-r-lg" title="Delete"><Trash2 size={16} /></button>
    </div>
  );
}