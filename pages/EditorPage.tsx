import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import EditorCanvas from '../components/editor/EditorCanvas';
import { useEditor } from '../hooks/useEditor';
import { SiteName } from '../types';
import FloatingActionButton from '../components/layout/FloatingActionButton';

export default function EditorPage() {
  const { state, dispatch } = useEditor();
  const { site, pageId } = useParams();
  const navigate = useNavigate();
  
  const isSidebarPanelOpen = !!state.activeTab;

  useEffect(() => {
    if (site && Object.values(SiteName).includes(site as SiteName) && site !== state.currentSite) {
      dispatch({ type: 'SET_SITE', payload: site as SiteName });
    }
    if (pageId && pageId !== state.currentPageId) {
        if (state.pages.some(p => p.id === pageId)) {
            dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
        } else {
            navigate(`/editor/${state.currentSite}/${state.pages[0].id}`);
        }
    }
  }, [site, pageId, dispatch, state.currentSite, state.currentPageId, state.pages, navigate]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const handleFabClick = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'pages' });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden builder-editor-layout">
      <Navbar />
      <div className="flex-grow flex pt-16 relative">
        {!state.isPreviewing && (
          <>
            <Sidebar isOpen={isSidebarPanelOpen} />
            {!isSidebarPanelOpen && <FloatingActionButton onClick={handleFabClick} />}
          </>
        )}
        <main
          className={`builder-main-content flex-grow flex flex-col transition-all duration-300 ${
            !state.isPreviewing && isSidebarPanelOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <EditorCanvas />
        </main>
      </div>
    </div>
  );
}