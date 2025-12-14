import { Site } from '../../types';
import { _update } from './ops';

export const updateSite = async (site: Site) => { await _update(`site:${site.id}`, site); };
