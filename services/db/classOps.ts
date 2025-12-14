import { GlobalClass } from '../../types';
import { _create, _delete, _update } from './ops';

export const createGlobalClass = async (cls: GlobalClass) => { await _create('global_class', cls); };
export const updateGlobalClass = async (cls: GlobalClass) => { await _update(`global_class:${cls.id}`, cls); };
export const deleteGlobalClass = async (id: string) => { await _delete(`global_class:${id}`); };
