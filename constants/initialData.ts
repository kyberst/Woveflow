import { SiteName } from '../types';

export const INITIAL_PAGES: Record<SiteName, any[]> = {
  [SiteName.MiTienda]: [
    { id: 'p1', name: 'index', type: 'system', content: '<div class="p-4"><h1 data-builder-id="el-1">Welcome to Store</h1><p data-builder-id="el-2">Start editing...</p></div>' },
  ],
  [SiteName.MiWeb]: [
    { id: 'w1', name: 'index', type: 'system', content: '<div class="p-4"><h1 data-builder-id="el-7">Welcome to Web</h1></div>' },
  ]
};