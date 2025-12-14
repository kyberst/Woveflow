import React from 'react';
import { Loader2, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PublishButtonViewProps {
  isPublishing: boolean;
  handlePublish: () => void;
}

export default function PublishButtonView({
  isPublishing,
  handlePublish,
}: PublishButtonViewProps) {
  const { t } = useTranslation();

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