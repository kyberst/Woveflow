import { BuilderComponent } from '../element';

export type ComponentAction =
  | { type: 'ADD_COMPONENT'; payload: BuilderComponent };
