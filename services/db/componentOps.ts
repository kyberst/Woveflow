import { BuilderComponent } from '../../types';
import { _create } from './ops';

export const createComponent = async (component: BuilderComponent) => { await _create(`component:${component.id}`, component); };
