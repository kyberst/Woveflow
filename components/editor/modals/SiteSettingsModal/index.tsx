import React, { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { DEFAULT_BREAKPOINTS } from '../../../../constants';

export default function SiteSettingsModal() {
  const { state, dispatch } = useEditor();
  const currentSite = state.sites.find(s => s.name === state.currentSite);
  
  const [breakpoints, setBreakpoints] = useState(currentSite?.breakpoints || DEFAULT_BREAKPOINTS);

  useEffect(() => {
    if (currentSite?.breakpoints) {
        setBreakpoints(currentSite.breakpoints);
    }
  }, [currentSite]);

  const handleSave = () => {
    if (!currentSite) return;
    
    const updatedSite = {
        ...currentSite,
        breakpoints: {
            mobile: Number(breakpoints.mobile),
            tablet: Number(breakpoints.tablet)
        }
    };
    
    dispatch({ type: 'UPDATE_SITE', payload: updatedSite });
    dispatch({ type: 'TOGGLE_SITE_SETTINGS_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-96 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-bold flex items-center"><Globe size={18} className="mr-2" />Site Settings</h3>
          <button onClick={() => dispatch({ type: 'TOGGLE_SITE_SETTINGS_MODAL', payload: false })} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-blue-700 dark:text-blue-300">
                Configure global settings for <strong>{state.currentSite}</strong>. These settings affect the editor preview and the exported code.
            </div>

            <div>
                <h4 className="font-bold text-sm mb-2 text-slate-700 dark:text-slate-300">Custom Breakpoints</h4>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold block mb-1">Mobile Max Width (px)</label>
                        <input 
                            type="number" 
                            value={breakpoints.mobile}
                            onChange={(e) => setBreakpoints({...breakpoints, mobile: parseInt(e.target.value)})}
                            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Default: {DEFAULT_BREAKPOINTS.mobile}px. Affects styles_sm.</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold block mb-1">Tablet Max Width (px)</label>
                         <input 
                            type="number" 
                            value={breakpoints.tablet}
                            onChange={(e) => setBreakpoints({...breakpoints, tablet: parseInt(e.target.value)})}
                            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Default: {DEFAULT_BREAKPOINTS.tablet}px. Affects styles_md.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end p-4 border-t dark:border-slate-700 space-x-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_SITE_SETTINGS_MODAL', payload: false })} className="px-4 py-2 text-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-builder-primary text-white rounded">Save Configuration</button>
        </div>
      </div>
    </div>
  );
}