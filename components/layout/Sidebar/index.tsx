import React from 'react';
import SidebarView from './Sidebar.view';

interface Props {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
  return <SidebarView isOpen={isOpen} />;
}