import React from 'react';
import { Page } from '../../../../../types';
import PageItem from './PageItem';

interface Props {
  pages: Page[];
  title: string;
}

export default function PageList({ pages, title }: Props) {
  if (pages.length === 0) return null;

  return (
    <div className="pl-4 space-y-1">
      {pages.map(page => <PageItem key={page.id} page={page} />)}
    </div>
  );
}