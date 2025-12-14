import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { SiteName } from '../../types';

export function useEditorPage() {
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

  return {
    isLoading,
    error,
    isSidebarPanelOpen,
    isPreviewing: state.isPreviewing,
    dispatch,
  };
}
