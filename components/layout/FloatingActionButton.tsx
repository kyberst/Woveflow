import React from 'react';
import { Menu } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="builder-fab group fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center bg-builder-primary/80 hover:bg-builder-primary text-white rounded-full shadow-lg transition-all duration-300 w-12 h-12 hover:w-14 hover:h-14"
      aria-label="Open sidebar"
    >
      <Menu size={24} className="transition-transform duration-300 group-hover:scale-110" />
    </button>
  );
}