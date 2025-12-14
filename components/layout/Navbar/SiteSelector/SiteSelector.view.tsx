import React from 'react';
import { Layers, Settings } from 'lucide-react';
import { SiteName } from '../../../../types';

interface SiteSelectorViewProps {
    currentSite: SiteName;
    sites: { id: string; name: SiteName }[];
    handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleToggleSiteSettingsModal: () => void;
}

export default function SiteSelectorView({
    currentSite,
    sites,
    handleSiteChange,
    handleToggleSiteSettingsModal,
}: SiteSelectorViewProps) {
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
                            value={currentSite}
                            onChange={handleSiteChange}
                            className="appearance-none bg-transparent font-semibold text-sm text-slate-700 dark:text-slate-200 pr-4 cursor-pointer focus:outline-none"
                        >
                            {sites.map(site => (
                                <option key={site.id} value={site.name}>{site.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handleToggleSiteSettingsModal}
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