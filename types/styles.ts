import { CSSProperties } from 'react';

export interface GlobalClass {
  id: string;
  name: string;
  styles: CSSProperties;
  owner: string;
}

export type DesignTokenCategory = 'colors' | 'fonts' | 'spacing';

export interface DesignToken {
  id: string;
  name: string;
  value: string;
  category: DesignTokenCategory;
  owner: string;
}