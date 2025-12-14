import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useEditor } from '../../../../../hooks/useEditor';
import PageList from './PageList';
import AddPageForm from './AddPageForm';
import { useTranslation } from 'react-i18next';

export default function PagesPanel() {
  const { state } = useEditor();
  const [expanded, setExpanded] = useState({ system: true, user: true });
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  const toggle = (group: 'system' | 'user') => {
    setExpanded(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const { systemPages, userPages } = useMemo(() => {
    const currentSiteRecord = state.sites.find(s => s.name === state.currentSite);
    if (!currentSiteRecord) return { systemPages: [], userPages: [] };

    const filtered = state.pages.filter(p => p.site === currentSiteRecord.id);
    return {
        systemPages: filtered.filter(p => p.type === 'system'),
        userPages: filtered.filter(p => p.type === 'user'),
    };
  }, [state.pages, state.currentSite, state.sites]);


  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <div>
        <button onClick={() => toggle('system')} className="flex items-center w-full text-sm font-medium text-slate-500 mb-2">
          {expanded.system ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="ml-1">{t('systemPages')}</span>
        </button>
        {expanded.system && <PageList pages={systemPages} title="System" />}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => toggle('user')} className="flex items-center text-sm font-medium text-slate-500">
            {expanded.user ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="ml-1">{t('myPages')}</span>
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"><Plus size={14} /></button>
        </div>
        {isAdding && <AddPageForm onClose={() => setIsAdding(false)} />}
        {expanded.user && <PageList pages={userPages} title="User" />}
      </div>
    </div>
  );
}