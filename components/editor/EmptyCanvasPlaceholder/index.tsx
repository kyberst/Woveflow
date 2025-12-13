import React from 'react';
import { Plus } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';

export default function EmptyCanvasPlaceholder() {
  const { dispatch } = useEditor();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <button
        onClick={() => dispatch({ type: 'TOGGLE_ADD_COMPONENT_MODAL', payload: true })}
        className="pointer-events-auto w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
        aria-label="Add component"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}