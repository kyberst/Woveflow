import React from 'react';
import SidebarTabs from './SidebarTabs';
import SidebarPanel from './SidebarPanel';

interface Props {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-40 flex builder-sidebar shadow-2xl">
      <SidebarTabs />
      <SidebarPanel />
    </aside>
  );
}