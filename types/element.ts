import { CSSProperties } from 'react';

export interface BuilderElementNode {
  id: string;
  tag: string;
  componentId?: string;
  attributes: Record<string, string | number | boolean>;
  styles: {
    desktop: CSSProperties;
    tablet?: CSSProperties;
    mobile?: CSSProperties;
  };
  children: (BuilderElementNode | string)[];
  classNames?: string[];
}

export interface BuilderComponent {
  id: string;
  name: string;
  category: 'structure' | 'basic' | 'widget' | 'section' | 'custom';
  content: BuilderElementNode;
  icon: string;
  owner: string;
}

export interface ComponentTemplate extends Omit<BuilderComponent, 'content' | 'owner'> {
  content: string; // HTML string template
}