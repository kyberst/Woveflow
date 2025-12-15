import React from 'react';
import SiteSelectorView from './SiteSelector/SiteSelector.view';
import { useSiteSelector } from './SiteSelector/useSiteSelector.hook';

export default function SiteSelector() {
  const {
    currentSite,
    sites,
    handleSiteChange,
    handleToggleSiteSettingsModal,
  } = useSiteSelector();

  return (
    <SiteSelectorView
      currentSite={currentSite}
      sites={sites}
      handleSiteChange={handleSiteChange}
      handleToggleSiteSettingsModal={handleToggleSiteSettingsModal}
    />
  );
}