import { SiteName, Site, GlobalClass, DesignToken } from '../../types';
import { INITIAL_PAGES as INITIAL_PAGES_RAW, DEFAULT_BREAKPOINTS } from '../../constants';
import { htmlToJson } from '../../utils/htmlToJson';
import { getCurrentUser } from './auth';
import { _select, _create } from './ops';
import { getSystemComponents } from '../componentRegistry';

export async function seedInitialData() {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("Cannot seed data without a logged-in user.");
    
    const sites = await _select<Site>('site');
    if (sites.length > 0) return;

    const site1 = (await _create('site', { name: SiteName.MiTienda, owner: currentUser.id, breakpoints: DEFAULT_BREAKPOINTS }))[0];
    const site2 = (await _create('site', { name: SiteName.MiWeb, owner: currentUser.id, breakpoints: DEFAULT_BREAKPOINTS }))[0];

    await _create('site_member', { user: currentUser.id, site: site1.id, role: 'admin' });
    await _create('site_member', { user: currentUser.id, site: site2.id, role: 'admin' });

    const pagesToSeed = [
        ...INITIAL_PAGES_RAW[SiteName.MiTienda].map(p => ({ ...p, site: site1.id })),
        ...INITIAL_PAGES_RAW[SiteName.MiWeb].map(p => ({ ...p, site: site2.id }))
    ];
    for (const page of pagesToSeed) {
        const pageData = { ...page, content: htmlToJson(page.content), owner: currentUser.id };
        await _create(`page:${page.id}`, pageData);
    }
    
    // Seed system components from Registry
    const systemComponents = getSystemComponents();
    for (const comp of systemComponents) {
        const componentData = { ...comp, owner: currentUser.id };
        await _create(`component:${comp.id}`, componentData);
    }

    const initialClasses: Omit<GlobalClass, 'id' | 'owner'>[] = [
      { name: 'btn-primary', styles: { backgroundColor: 'var(--primary)', color: 'white', padding: 'var(--sm) var(--md)', borderRadius: '4px' } },
    ];
    for (const cls of initialClasses) await _create('global_class', cls);
    
    const defaultTokens: Omit<DesignToken, 'id' | 'owner'>[] = [
      { name: 'primary', value: '#3b82f6', category: 'colors' },
      { name: 'secondary', value: '#10b981', category: 'colors' },
      { name: 'text-main', value: '#1e293b', category: 'colors' },
    ];
    for (const token of defaultTokens) await _create('design_token', token);
}