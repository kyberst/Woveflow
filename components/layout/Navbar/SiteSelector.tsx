import React from 'react';
import { Layout } from 'lucide-react';
import { SiteName } from '../../../types';
import { useEditor } from '../../../hooks/useEditor';
import { useNavigate } from 'react-router-dom';

export default function SiteSelector() {
    const { state, dispatch } = useEditor();
    const navigate = useNavigate();

    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSite = e.target.value as SiteName;
        dispatch({ type: 'SET_SITE', payload: newSite });
        // Navigate to the first page of the new site
        const firstPage = state.pages.find(p => p.id.startsWith(newSite === SiteName.MiTienda ? 'p' : 'w'));
        if (firstPage) {
            navigate(`/editor/${newSite}/${firstPage.id}`);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-builder-primary font-bold text-xl">
                <Layout className="w-6 h-6" />
                <span>Woveflow</span>
            </div>
            <select
                value={state.currentSite}
                onChange={handleSiteChange}
                className="bg-gray-100 dark:bg-slate-700 text-sm rounded px-2 py-1 border-none focus:ring-2 focus:ring-builder-primary"
            >
                <option value={SiteName.MiTienda}>mitienda</option>
                <option value={SiteName.MiWeb}>miweb</option>
            </select>
        </div>
    );
}