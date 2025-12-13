import React, { useState, useEffect } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { ANIMATION_TYPES } from '../../../../constants';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function AdvancedPanel({ iframeRef }: Props) {
  const { state, dispatch } = useEditor();
  const { t } = useTranslation();
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current?.contentDocument) {
      const el = iframeRef.current.contentDocument.querySelector<HTMLElement>(`[data-builder-id="${state.selectedElementId}"]`);
      setElement(el);
    }
  }, [state.selectedElementId, iframeRef]);
  
  // Note: A full implementation would require more robust class management
  const handleVisibilityChange = (device: 'mobile' | 'tablet' | 'desktop', checked: boolean) => {
      // This is a simplified example. A real app would manage Tailwind classes more carefully.
  };

  const handlePlayAnimation = () => {
    // This would require adding CSS animations and dynamically applying classes.
  };
  
  if (!element) {
    return <div className="p-4 text-sm text-slate-500">Select an element.</div>;
  }

  return (
    <div className="p-4 space-y-6 text-sm h-full overflow-y-auto">
      <div>
        <h4 className="font-bold mb-2">{t('visibility')}</h4>
        <div className="space-y-2">
            <div><input type="checkbox" id="desktop" defaultChecked /> <label htmlFor="desktop">{t('showOnDesktop')}</label></div>
            <div><input type="checkbox" id="tablet" defaultChecked /> <label htmlFor="tablet">{t('showOnTablet')}</label></div>
            <div><input type="checkbox" id="mobile" defaultChecked /> <label htmlFor="mobile">{t('showOnMobile')}</label></div>
        </div>
      </div>

       <div>
        <h4 className="font-bold mb-2">{t('animation')}</h4>
        <div className="space-y-2">
           <div>
              <label className="text-xs font-semibold block mb-1">{t('type')}</label>
              <select className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600">
                {ANIMATION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
             <div>
              <label className="text-xs font-semibold block mb-1">{t('duration')}</label>
              <input type="number" step="0.1" defaultValue="1" className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600"/>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">{t('delay')}</label>
              <input type="number" step="0.1" defaultValue="0" className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600"/>
            </div>
            <button onClick={handlePlayAnimation} className="flex items-center space-x-1 px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded">
                <Play size={14}/> <span>{t('play')}</span>
            </button>
        </div>
      </div>
    </div>
  );
}