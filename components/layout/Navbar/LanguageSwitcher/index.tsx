import React from 'react';
import LanguageSwitcherView from './LanguageSwitcher/LanguageSwitcher.view';
import { useLanguageSwitcher } from './LanguageSwitcher/useLanguageSwitcher.hook';

export default function LanguageSwitcher() {
  const {
    currentLanguage,
    changeLanguage,
    isOpen,
    toggleOpen,
    wrapperRef,
  } = useLanguageSwitcher();

  return (
    <LanguageSwitcherView
      currentLanguage={currentLanguage}
      changeLanguage={changeLanguage}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      wrapperRef={wrapperRef}
    />
  );
}