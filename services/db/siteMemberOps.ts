import { SiteMember } from '../../types';
import { db, useLocalStorage, getStore } from './client';

// Define SurrealResult locally since it is not exported from the package
interface SurrealResult<T> {
  result?: T;
  status: string;
}

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
