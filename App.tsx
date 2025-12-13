import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import { SiteName } from './types';
import { INITIAL_PAGES } from './constants';

export default function App() {
  // Redirect to the default site and page for a seamless start
  const defaultSite = SiteName.MiTienda;
  const defaultPageId = INITIAL_PAGES[defaultSite][0].id;

  return (
    <HashRouter>
      <Routes>
        <Route path="/editor/:site/:pageId" element={<EditorPage />} />
        <Route 
          path="*" 
          element={<Navigate to={`/editor/${defaultSite}/${defaultPageId}`} replace />} 
        />
      </Routes>
    </HashRouter>
  );
}