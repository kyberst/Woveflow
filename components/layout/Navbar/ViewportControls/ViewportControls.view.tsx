import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { ViewMode } from '../../../../types';

interface ViewportControlsViewProps {
    viewMode: ViewMode;
    zoom: number;
    setViewMode: (mode: ViewMode) => void;
    setZoom: (zoom: number) => void;
    zoomPresets: number[];
}

export default function ViewportControlsView({
    viewMode,
    zoom,
    setViewMode,
    setZoom,
    zoomPresets,
}: ViewportControlsViewProps) {
    return (
        <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setViewMode(ViewMode.Mobile)} className={`p-2 rounded ${viewMode === ViewMode.Mobile ? 'bg-white dark:bg-slate-600 shadow text-builder-primary' : 'text-slate-500'}`}>
                    <Smartphone size={18} />
                </button>
                <button onClick={() => setViewMode(ViewMode.Tablet)} className={`p-2 rounded ${viewMode === ViewMode.Tablet ? 'bg-white dark:bg-slate-600 shadow text-builder-primary' : 'text-slate-500'}`}>
                    <Tablet size={18} />
                </button>
                <button onClick={() => setViewMode(ViewMode.Desktop)} className={`p-2 rounded ${viewMode === ViewMode.Desktop ? 'bg-white dark:bg-slate-600 shadow text-builder-primary' : 'text-slate-500'}`}>
                    <Monitor size={18} />
                </button>
            </div>
            <div className="flex items-center space-x-1">
                 <select
                    value={zoomPresets.includes(zoom) ? zoom : 'custom'}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val !== 'custom') {
                            setZoom(parseInt(val));
                        }
                    }}
                    className="h-[30px] text-sm bg-gray-100 dark:bg-slate-700 rounded-l-md px-2 py-1 border-none focus:ring-0"
                >
                    {zoomPresets.map(p => <option key={p} value={p}>{p}%</option>)}
                    {!zoomPresets.includes(zoom) && <option value="custom">Custom</option>}
                 </select>
                <div className="relative">
                    <input
                        type="number"
                        value={zoom}
                        onChange={(e) => setZoom(parseInt(e.target.value))}
                        className="w-20 h-[30px] text-right pr-5 text-sm bg-gray-100 dark:bg-slate-700 rounded-r-md px-1 py-1 border-l border-gray-300 dark:border-slate-600 focus:ring-0"
                    />
                     <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">%</span>
                </div>
            </div>
        </div>
    );
}