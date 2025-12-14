import { EditorState, SiteName, ViewMode, BuilderElementNode } from '../types';
import { _select } from './db/ops';
import { connect, useLocalStorage } from './db/client';
import { login } from './db/auth';
import { seedInitialData } from './db/seed';

// Re-export core functions
export { login };

// Import modular DB operations
import { updatePageContent, createPage, deletePage, updatePage } from './db/pageOps';
import { updateSite } from './db/siteOps';
import { createComponent } from './db/componentOps';
import { createGlobalClass, updateGlobalClass, deleteGlobalClass } from './db/classOps';
import { createDesignToken, updateDesignToken, deleteDesignToken } from './db/designTokenOps';
import { getSiteMembers } from './db/siteMemberOps';
import { Site, BuilderComponent, GlobalClass, DesignToken, Page } from '../types';


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

// Public API exports
export {
  updatePageContent,
  createPage,
  deletePage,
  updatePage,
  updateSite,
  createComponent,
  createGlobalClass,
  updateGlobalClass,
  deleteGlobalClass,
  createDesignToken,
  updateDesignToken,
  deleteDesignToken,
  getSiteMembers,
};