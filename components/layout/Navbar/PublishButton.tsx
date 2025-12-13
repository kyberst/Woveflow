import React from 'react';
import { Save } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';

export default function PublishButton() {
    const { state } = useEditor();
    const { t } = useTranslation();

    const handlePublish = () => {
        const page = state.pages.find(p => p.id === state.currentPageId);
        console.log("Publishing...", page?.content);
        alert(`Site "${state.currentSite}" published! Check console for HTML.`);
    };

    return (
        <button
            onClick={handlePublish}
            className="flex items-center space-x-2 bg-builder-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
        >
            <Save size={18} />
            <span>{t('publish')}</span>
        </button>
    );
}