import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutesView from './App/AppRoutes.view';
import { useAppRoutes } from './App/useAppRoutes.hook';
import { useEditor } from './hooks/useEditor'; // To access global state for error handling

export default function App() {
  const { isLoading: editorLoading, error } = useEditor();
  const { isLoading, defaultRedirect, noSitesAvailable } = useAppRoutes();

  if (noSitesAvailable && !editorLoading) { // Check editorLoading to ensure the check happens after initialization
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-slate-950 text-slate-500">
          <p>No sites available. System initialization failed or no data.</p>
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
    <HashRouter>
      <AppRoutesView isLoading={isLoading} defaultRedirect={defaultRedirect} />
    </HashRouter>
  );
}