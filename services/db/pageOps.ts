import { BuilderElementNode, Page } from '../../types';
import { _create, _delete, _merge, _update } from './ops';

export const updatePageContent = async (pageId: string, content: BuilderElementNode[]) => { await _merge(`page:${pageId}`, { content }); };
export const createPage = async (page: Page) => { await _create(`page:${page.id}`, page); };
export const deletePage = async (pageId: string) => { await _delete(`page:${pageId}`); };
export const updatePage = async (page: Page) => { await _update(`page:${page.id}`, page); };
