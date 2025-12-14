export interface User {
  id: string;
  username: string;
  role: 'admin' | 'designer' | 'viewer';
}

export type SiteRole = 'admin' | 'designer' | 'editor' | 'viewer';

export interface SiteMember {
  id: string;
  user: string;
  site: string;
  role: SiteRole;
  username?: string;
}