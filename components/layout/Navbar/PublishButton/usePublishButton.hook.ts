import { useState } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { exportStaticSite } from '../../../../services/exportService';

export function usePublishButton() {
    const { state } = useEditor();
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

    return {
        isPublishing,
        handlePublish,
    };
}