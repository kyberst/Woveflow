import { BuilderElementNode } from '../element';
import { Page } from '../page';

export type PageAction =
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'UPDATE_PAGE_CONTENT'; payload: { pageId: string; content: BuilderElementNode[] } }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'RENAME_PAGE'; payload: { id: string, name: string } }
  | { type: 'DUPLICATE_PAGE'; payload: string };
