import React from 'react';
import { Layers, Settings } from 'lucide-react';
import { SiteName } from '../../../types';
import { useEditor } from '../../../hooks/useEditor';
import { useNavigate } from 'react-router-dom';

export default function SiteSelector() {
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

    return (
        <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-builder-primary text-white shadow-lg shadow-builder-primary/30">
                <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-0.5">Project</span>
                <div className="flex items-center">
                    <div className="relative group mr-2">
                        <select
                            value={state.currentSite}
                            onChange={handleSiteChange}
                            className="appearance-none bg-transparent font-semibold text-sm text-slate-700 dark:text-slate-200 pr-4 cursor-pointer focus:outline-none"
                        >
                            {state.sites.map(site => (
                                <option key={site.id} value={site.name}>{site.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={() => dispatch({ type: 'TOGGLE_SITE_SETTINGS_MODAL', payload: true })}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Site Settings"
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}