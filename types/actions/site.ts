import { SiteName } from '../enums';
import { Site } from '../site';
import { SiteMember } from '../user';

export type SiteAction =
  | { type: 'SET_SITE'; payload: SiteName }
  | { type: 'UPDATE_SITE'; payload: Site }
  | { type: 'SET_SITE_MEMBERS'; payload: SiteMember[] };
