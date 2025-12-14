import React from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import CodeEditorPanel from './CodeEditorPanel';

export default function BottomPanel() {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [height, setHeight] = React.useState(300);

  if (!state.showBottomPanel) return null;

  return (
    <div 
        className="border-t border-builder-border dark:border-builder-darkBorder bg-white dark:bg-builder-dark shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 flex flex-col transition-all duration-200"
        style={{ height: `${height}px`, minHeight: '100px', maxHeight: '80vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border-b border-builder-border dark:border-builder-darkBorder">
        <div className="flex space-x-4">
            <button 
                className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 ${state.activeBottomTab === 'code' ? 'border-builder-primary text-builder-primary' : 'border-transparent text-slate-500'}`}
                onClick={() => dispatch({ type: 'SET_BOTTOM_TAB', payload: 'code' })}
            >
                {t('code')}
            </button>
            <button 
                className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 ${state.activeBottomTab === 'logs' ? 'border-builder-primary text-builder-primary' : 'border-transparent text-slate-500'}`}
                onClick={() => dispatch({ type: 'SET_BOTTOM_TAB', payload: 'logs' })}
            >
                Console
            </button>
        </div>
        <div className="flex items-center space-x-2">
             <button 
                onClick={() => setHeight(height === 300 ? 600 : 300)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                {height === 300 ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_BOTTOM_PANEL', payload: false })} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                <X size={16} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-hidden relative">
          {state.activeBottomTab === 'code' && <CodeEditorPanel />}
          {state.activeBottomTab === 'logs' && (
              <div className="p-4 font-mono text-sm text-slate-500">
                  System logs will appear here...
              </div>
          )}
      </div>
    </div>
  );
}