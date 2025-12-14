import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BottomPanel from '../../components/layout/BottomPanel';
import EditorCanvas from '../../components/editor/EditorCanvas';
import CommandPalette from '../../components/common/CommandPalette';
import { Layout } from 'lucide-react';

interface EditorPageProps {
  isLoading: boolean;
  error: string | null;
  isSidebarPanelOpen: boolean;
  isPreviewing: boolean;
  dispatch: React.Dispatch<any>;
}

export default function EditorPage({ 
  isLoading, 
  error, 
  isSidebarPanelOpen, 
  isPreviewing,
  dispatch
}: EditorPageProps) {
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 font-sans">
        <div className="flex items-center space-x-3 text-builder-primary font-bold text-2xl mb-4">
            <Layout className="w-10 h-10 animate-bounce" />
            <span className="tracking-tight">Woveflow</span>
        </div>
        <p className="text-slate-500 font-medium">Initializing Design Environment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-red-50 text-red-700">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden builder-editor-layout font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      <div className="flex-grow flex pt-14 relative overflow-hidden">
        {!isPreviewing && (
          <>
            <Sidebar isOpen={true} />
          </>
        )}
        
        <main
          className={`builder-main-content flex-grow flex flex-col transition-all duration-300 h-full ${
            !isPreviewing 
              ? (isSidebarPanelOpen ? 'md:ml-96 ml-16' : 'ml-16') 
              : 'ml-0'
          }`}
        >
          <div className="flex-grow overflow-auto flex flex-col">
            <EditorCanvas />
          </div>
          <BottomPanel />
        </main>
        
        <CommandPalette />

        {/* Mobile Backdrop for Sidebar Panel */}
        {!isPreviewing && isSidebarPanelOpen && (
            <div 
                className="md:hidden fixed inset-0 bg-black/50 z-30"
                style={{ zIndex: 30 }}
                onClick={() => dispatch({ type: 'CLOSE_SIDEBAR_PANEL' })}
            />
        )}
      </div>
    </div>
  );
}