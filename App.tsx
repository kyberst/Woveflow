import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import { useEditor } from './hooks/useEditor';
import { Loader2 } from 'lucide-react';
import './plugins'; // Initialize plugins on startup

function AppRoutes() {
  const { state, isLoading } = useEditor();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 font-sans">
        <div className="flex items-center space-x-3 text-builder-primary font-bold text-2xl mb-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="tracking-tight">Woveflow</span>
        </div>
        <p className="text-slate-500 font-medium">Loading application data...</p>
      </div>
    );
  }

  // Handle case where initialization failed or no data exists
  if (state.sites.length === 0) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-slate-950 text-slate-500">
          <p>No sites available. System initialization failed.</p>
       </div>
    );
  }

  // Calculate default route dynamically from loaded state
  let defaultRedirect = '/';
  const firstSite = state.sites[0];
  const firstPage = state.pages.find(p => p.site === firstSite.id);
  
  if (firstSite && firstPage) {
      defaultRedirect = `/editor/${firstSite.name}/${firstPage.id}`;
  }

  return (
      <Routes>
        <Route path="/editor/:site/:pageId" element={<EditorPage />} />
        <Route 
          path="*" 
          element={<Navigate to={defaultRedirect} replace />} 
        />
      </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}