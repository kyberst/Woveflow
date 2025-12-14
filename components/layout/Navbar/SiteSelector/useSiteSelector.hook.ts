import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../../../hooks/useEditor';
import { SiteName } from '../../../../types';

export function useSiteSelector() {
    const { state, dispatch } = useEditor();
    const navigate = useNavigate();

    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSiteName = e.target.value as SiteName;
        dispatch({ type: 'SET_SITE', payload: newSiteName });
        
        const newSite = state.sites.find(s => s.name === newSiteName);
        if (!newSite) return;

        // Navigate to the first page of the new site
        const firstPage = state.pages.find(p => p.site === newSite.id);
        if (firstPage) {
            navigate(`/editor/${newSiteName}/${firstPage.id}`);
        }
    };

    const handleToggleSiteSettingsModal = () => dispatch({ type: 'TOGGLE_SITE_SETTINGS_MODAL', payload: true });

    return {
        currentSite: state.currentSite,
        sites: state.sites,
        handleSiteChange,
        handleToggleSiteSettingsModal,
    };
}