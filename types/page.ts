import { BuilderElementNode } from './element';

export interface Page {
  id: string;
  name: string;
  type: 'system' | 'user';
  content: BuilderElementNode[];
  owner: string;
  site: string;
}

export interface HistoryEntry {
  pageId: string;
  pages: Page[];
}