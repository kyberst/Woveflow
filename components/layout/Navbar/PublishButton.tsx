import React, { useState } from 'react';
import { Save, Loader2, Share } from 'lucide-react';
import { useEditor } from '../../../hooks/useEditor';
import { useTranslation } from 'react-i18next';
import { exportStaticSite } from '../../../services/exportService';

export default function PublishButton() {
    const { state } = useEditor();
    const { t } = useTranslation();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await exportStaticSite(state);
        } catch (error) {
            console.error("Failed to export site:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            alert(`Failed to export site: ${message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center justify-center space-x-2 bg-builder-primary hover:bg-builder-primaryHover text-white px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-builder-primary/20 hover:shadow-lg hover:shadow-builder-primary/30 disabled:opacity-75 disabled:cursor-wait disabled:shadow-none"
        >
            {isPublishing ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="hidden md:inline">{t('publishing')}</span>
                </>
            ) : (
                <>
                    <Share size={16} />
                    <span className="hidden md:inline">{t('publish')}</span>
                </>
            )}
        </button>
    );
}