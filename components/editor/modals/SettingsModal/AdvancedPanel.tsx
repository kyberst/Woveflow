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
  
  // States for animation inputs
  const [animType, setAnimType] = useState('none');
  const [duration, setDuration] = useState('1');
  const [delay, setDelay] = useState('0');

  useEffect(() => {
    if (state.selectedElementId && iframeRef.current?.contentDocument) {
      const el = iframeRef.current.contentDocument.querySelector<HTMLElement>(`[data-builder-id="${state.selectedElementId}"]`);
      setElement(el);
      
      // Basic detection of existing inline styles for initial state (simplified)
      if (el) {
          setDuration(el.style.animationDuration?.replace('s', '') || '1');
          setDelay(el.style.animationDelay?.replace('s', '') || '0');
      }
    }
  }, [state.selectedElementId, iframeRef]);

  // Helper to toggle a tailwind class in the classList
  const toggleClass = (className: string, add: boolean) => {
      if (!element || !state.selectedElementId) return;
      
      const currentClasses = Array.from(element.classList);
      let newClasses = [...currentClasses];
      
      if (add) {
          if (!newClasses.includes(className)) newClasses.push(className);
      } else {
          newClasses = newClasses.filter(c => c !== className);
      }
      
      dispatch({ 
          type: 'UPDATE_ELEMENT_CLASSES', 
          payload: { elementId: state.selectedElementId, classNames: newClasses } 
      });
      dispatch({ type: 'ADD_HISTORY' });
  };

  // 8.5.3.1 - 8.5.3.3 Visibility Logic
  // Mobile (Base): "hidden" class hides it.
  // Tablet (md): "md:hidden" hides it.
  // Desktop (lg): "lg:hidden" hides it.
  // Note: This logic assumes a starting state of "visible" (block/flex). 
  // If "Show on Mobile" is OFF, we add 'hidden'. If ON, we remove 'hidden'.
  
  const isHiddenMobile = element?.classList.contains('hidden');
  const isHiddenTablet = element?.classList.contains('md:hidden');
  const isHiddenDesktop = element?.classList.contains('lg:hidden');

  const handleVisibilityChange = (device: 'mobile' | 'tablet' | 'desktop', show: boolean) => {
      if (device === 'mobile') toggleClass('hidden', !show);
      if (device === 'tablet') toggleClass('md:hidden', !show);
      if (device === 'desktop') toggleClass('lg:hidden', !show);
  };

  const handleAnimationChange = () => {
      if (!state.selectedElementId) return;
      
      // Update inline styles for animation
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'animationName', value: animType, viewMode: state.viewMode } });
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'animationDuration', value: `${duration}s`, viewMode: state.viewMode } });
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'animationDelay', value: `${delay}s`, viewMode: state.viewMode } });
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: 'animationFillMode', value: 'both', viewMode: state.viewMode } });
      
      dispatch({ type: 'ADD_HISTORY' });
  };
  
  const handlePlayAnimation = () => {
      if (!element) return;
      // Reset animation to replay it
      element.style.animationName = 'none';
      void element.offsetWidth; // trigger reflow
      element.style.animationName = animType;
      element.style.animationDuration = `${duration}s`;
      element.style.animationDelay = `${delay}s`;
      element.style.animationFillMode = 'both';
  };
  
  if (!element) {
    return <div className="p-4 text-sm text-slate-500">Select an element.</div>;
  }

  return (
    <div className="p-4 space-y-6 text-sm h-full overflow-y-auto">
      <div>
        <h4 className="font-bold mb-3 text-slate-700 dark:text-slate-200">{t('visibility')}</h4>
        <div className="space-y-3 bg-gray-50 dark:bg-slate-900/50 p-3 rounded border dark:border-slate-700">
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="desktop" 
                    checked={!isHiddenDesktop} 
                    onChange={e => handleVisibilityChange('desktop', e.target.checked)} 
                    className="mr-2"
                /> 
                <label htmlFor="desktop">{t('showOnDesktop')}</label>
            </div>
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="tablet" 
                    checked={!isHiddenTablet} 
                    onChange={e => handleVisibilityChange('tablet', e.target.checked)}
                    className="mr-2"
                /> 
                <label htmlFor="tablet">{t('showOnTablet')}</label>
            </div>
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="mobile" 
                    checked={!isHiddenMobile} 
                    onChange={e => handleVisibilityChange('mobile', e.target.checked)}
                    className="mr-2"
                /> 
                <label htmlFor="mobile">{t('showOnMobile')}</label>
            </div>
        </div>
      </div>

       <div>
        <h4 className="font-bold mb-3 text-slate-700 dark:text-slate-200">{t('animation')}</h4>
        <div className="space-y-3">
           <div>
              <label className="text-xs font-semibold block mb-1">{t('type')}</label>
              <select 
                value={animType}
                onChange={(e) => { setAnimType(e.target.value); handleAnimationChange(); }}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
              >
                {ANIMATION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex space-x-2">
                <div className="flex-1">
                    <label className="text-xs font-semibold block mb-1">{t('duration')}</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        value={duration} 
                        onChange={(e) => { setDuration(e.target.value); handleAnimationChange(); }}
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-semibold block mb-1">{t('delay')}</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        value={delay}
                        onChange={(e) => { setDelay(e.target.value); handleAnimationChange(); }}
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    />
                </div>
            </div>
            
            <button 
                onClick={handlePlayAnimation} 
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
                <Play size={14}/> <span>{t('play')}</span>
            </button>
        </div>
      </div>
    </div>
  );
}