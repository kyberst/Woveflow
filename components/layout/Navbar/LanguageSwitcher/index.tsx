import React from 'react';
import LanguageSwitcherView from './LanguageSwitcher.view';
import { useLanguageSwitcher } from './useLanguageSwitcher.hook';

export default function LanguageSwitcher() {
  const {
    currentLanguage,
    changeLanguage,
  } = useLanguageSwitcher();

  return (
    <LanguageSwitcherView
      currentLanguage={currentLanguage}
      changeLanguage={changeLanguage}
    />
  );
}