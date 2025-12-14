import { EditorState, Page, BuilderComponent, GlobalClass, DesignToken, Site, SiteMember, ViewMode, BuilderElementNode, SiteName } from '../types';
import { _select, _create, _update, _merge, _delete } from './db/ops';
import { connect, db, useLocalStorage } from './db/client';
import { login, getCurrentUser } from './db/auth';
import { seedInitialData } from './db/seed';

// Re-export core functions
export { login, getCurrentUser };

interface SurrealResult<T> {
  result?: T;
  status: string;
}

// Helper to access LocalStorage directly if needed (though ops abstract this)
const STORAGE_PREFIX = 'woveflow_';
const getStore = (table: string) => {
    try { return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${table}`) || '[]'); } catch { return []; }
};

export async function getInitialData(): Promise<EditorState> {
    await connect();
    const { user } = await login('designer1', 'password123', 'designer');
    await seedInitialData();

    const [sites, pages, components, globalClasses, designTokens, siteMembers] = await Promise.all([
        _select<Site>('site'),
        _select<Page>('page'),
        _select<BuilderComponent>('component'),
        _select<GlobalClass>('global_class'),
        _select<DesignToken>('design_token'),
        getSiteMembers(),
    ]);

    const groupedTokens: EditorState['designTokens'] = {
        colors: designTokens.filter(t => t.category === 'colors'),
        fonts: designTokens.filter(t => t.category === 'fonts'),
        spacing: designTokens.filter(t => t.category === 'spacing'),
    };
    
    const initialSite = sites[0]?.name || SiteName.MiTienda;
    const initialPagesForSite = pages.filter(p => p.site === sites[0]?.id);
    const initialPageId = initialPagesForSite[0]?.id || '';

    // Initialize history with the starting state of all pages
    const initialHistory = [{ pages: pages, pageId: initialPageId }];

    return {
        currentUser: user,
        currentSite: initialSite,
        currentPageId: initialPageId,
        pages: pages,
        sites: sites,
        siteMembers: siteMembers,
        components: components,
        globalClasses: globalClasses,
        designTokens: groupedTokens,
        viewMode: ViewMode.Desktop,
        zoom: 100,
        theme: 'light',
        history: initialHistory,
        historyIndex: 0,
        selectedElementId: null,
        hoveredElementId: null,
        activeTab: null,
        showAIModal: false,
        isPreviewing: false,
        showAddComponentModal: false,
        insertionTarget: null,
        showCodeEditorModal: false,
        showSaveComponentModal: false,
        showSettingsModal: false,
        showSiteSettingsModal: false,
        inlineEditingElementId: null,
        contextMenu: null,
        clipboard: null,
        isDragging: false,
        dragOverState: null,
        showBottomPanel: false,
        activeBottomTab: 'code',
        showCommandPalette: false,
    };
}

// Public API
export const updatePageContent = async (pageId: string, content: BuilderElementNode[]) => { await _merge(`page:${pageId}`, { content }); };
export const createPage = async (page: Page) => { await _create(`page:${page.id}`, page); };
export const deletePage = async (pageId: string) => { await _delete(`page:${pageId}`); };
export const updatePage = async (page: Page) => { await _update(`page:${page.id}`, page); };
export const updateSite = async (site: Site) => { await _update(`site:${site.id}`, site); };
export const createComponent = async (component: BuilderComponent) => { await _create(`component:${component.id}`, component); };
export const createGlobalClass = async (cls: GlobalClass) => { await _create('global_class', cls); };
export const updateGlobalClass = async (cls: GlobalClass) => { await _update(`global_class:${cls.id}`, cls); };
export const deleteGlobalClass = async (id: string) => { await _delete(`global_class:${id}`); };
export const createDesignToken = async (token: DesignToken) => { await _create('design_token', token); };
export const updateDesignToken = async (token: DesignToken) => { await _update(`design_token:${token.id}`, token); };
export const deleteDesignToken = async (id: string) => { await _delete(`design_token:${id}`); };

export const getSiteMembers = async (): Promise<SiteMember[]> => {
    if (useLocalStorage) return getStore('site_member');
    try {
        const query = 'SELECT id, role, site, user, user.username as username FROM site_member';
        const result = await db.query<[SurrealResult<SiteMember[]>]>(query);
        return result[0]?.result || [];
    } catch (e) {
        console.error('Failed to get site members', e);
        return [];
    }
};