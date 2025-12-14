import { useEditor } from '../hooks/useEditor';
import { SiteName } from '../types';

export function useAppRoutes() {
  const { state, isLoading } = useEditor();

  // Calculate default route dynamically from loaded state
  let defaultRedirect = '/';
  if (!isLoading && state.sites.length > 0) {
    const firstSite = state.sites[0];
    const firstPage = state.pages.find(p => p.site === firstSite.id);
    
    if (firstSite && firstPage) {
        defaultRedirect = `/editor/${firstSite.name}/${firstPage.id}`;
    }
  }

  // Handle case where initialization failed or no data exists
  if (!isLoading && state.sites.length === 0) {
    return {
      isLoading: false,
      defaultRedirect: '/', // Fallback to root or an error page
      noSitesAvailable: true,
    };
  }

  return {
    isLoading,
    defaultRedirect,
    noSitesAvailable: false,
  };
}
