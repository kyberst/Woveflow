import { SiteName } from './enums';

export interface SiteBreakpoints {
  mobile: number;
  tablet: number;
}

export interface Site {
  id: string;
  name: SiteName;
  owner: string;
  breakpoints?: SiteBreakpoints;
}