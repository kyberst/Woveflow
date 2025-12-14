import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from '../pages/EditorPage';
import { Loader2 } from 'lucide-react';

interface AppRoutesViewProps {
  isLoading: boolean;
  defaultRedirect: string;
}

export default function AppRoutesView({ isLoading, defaultRedirect }: AppRoutesViewProps) {
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