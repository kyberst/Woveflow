import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useEditor } from '../../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import ContentPanel from './ContentPanel';
import StylesPanel from './StylesPanel';
import AdvancedPanel from './AdvancedPanel';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

type Tab = 'content' | 'styles' | 'advanced';

export default function SettingsModal({ iframeRef }: Props) {
  const { dispatch } = useEditor();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('styles');

  const TABS: { id: Tab, label: string }[] = [
    { id: 'content', label: t('content') },
    { id: 'styles', label: t('styles') },
    { id: 'advanced', label: t('advanced') },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center pointer-events-none">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-[24rem] h-[80vh] shadow-2xl flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-bold flex items-center"><Settings size={18} className="mr-2" />{t('properties')}</h3>
          <button onClick={() => dispatch({ type: 'TOGGLE_SETTINGS_MODAL', payload: false })} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="border-b dark:border-slate-700 px-2">
            <div className="flex space-x-2">
                {TABS.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-builder-primary text-builder-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex-grow overflow-hidden">
            {activeTab === 'content' && <ContentPanel iframeRef={iframeRef} />}
            {activeTab === 'styles' && <StylesPanel iframeRef={iframeRef} />}
            {activeTab === 'advanced' && <AdvancedPanel iframeRef={iframeRef} />}
        </div>
      </div>
    </div>
  );
}