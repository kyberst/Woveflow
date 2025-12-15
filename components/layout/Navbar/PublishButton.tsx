import React from 'react';
import PublishButtonView from './PublishButton/PublishButton.view';
import { usePublishButton } from './PublishButton/usePublishButton.hook';

export default function PublishButton() {
  const {
    isPublishing,
    handlePublish,
  } = usePublishButton();

  return (
    <PublishButtonView
      isPublishing={isPublishing}
      handlePublish={handlePublish}
    />
  );
}