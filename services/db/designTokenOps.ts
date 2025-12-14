import { DesignToken } from '../../types';
import { _create, _delete, _update } from './ops';

export const createDesignToken = async (token: DesignToken) => { await _create('design_token', token); };
export const updateDesignToken = async (token: DesignToken) => { await _update(`design_token:${token.id}`, token); };
export const deleteDesignToken = async (id: string) => { await _delete(`design_token:${id}`); };
