import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomPanel from '../components/layout/BottomPanel';
import EditorCanvas from '../components/editor/EditorCanvas';
import CommandPalette from '../components/common/CommandPalette';
import { useEditor } from '../hooks/useEditor';
import { SiteName } from '../types';
import { Layout } from 'lucide-react';

export default function EditorPage() {
  const { state, dispatch, isLoading, error } = useEditor();
  const { site, pageId } = useParams();
  const navigate = useNavigate();
  
  const isSidebarPanelOpen = !!state.activeTab;

  useEffect(() => {
    if (isLoading || !state.pages.length || !state.sites.length) return;

    const currentSiteName = site as SiteName;
    const siteExists = state.sites.some(s => s.name === currentSiteName);

    if (!siteExists) {
        const firstSite = state.sites[0];
        const firstPageOfFirstSite = state.pages.find(p => p.site === firstSite.id);
        if (firstSite && firstPageOfFirstSite) {
            navigate(`/editor/${firstSite.name}/${firstPageOfFirstSite.id}`, { replace: true });
        }
        return;
    }

    if (currentSiteName !== state.currentSite) {
        dispatch({ type: 'SET_SITE', payload: currentSiteName });
    }

    const currentSiteRecord = state.sites.find(s => s.name === currentSiteName);
    const pageExists = state.pages.some(p => p.id === pageId && p.site === currentSiteRecord?.id);

    if (!pageExists) {
        const firstPageOfCurrentSite = state.pages.find(p => p.site === currentSiteRecord?.id);
        if (firstPageOfCurrentSite) {
            navigate(`/editor/${currentSiteName}/${firstPageOfCurrentSite.id}`, { replace: true });
        }
        return;
    }
    
    if (pageId && pageId !== state.currentPageId) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
    }

  }, [site, pageId, dispatch, state.currentSite, state.currentPageId, state.pages, state.sites, navigate, isLoading]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

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
        {!state.isPreviewing && (
          <>
            <Sidebar isOpen={true} />
          </>
        )}
        
        <main
          className={`builder-main-content flex-grow flex flex-col transition-all duration-300 h-full ${
            !state.isPreviewing 
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
        {!state.isPreviewing && isSidebarPanelOpen && (
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