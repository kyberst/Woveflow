import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

export function useLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Close dropdown after selection
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isOpen,
    toggleOpen,
    wrapperRef,
  };
}