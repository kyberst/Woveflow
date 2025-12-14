import { LAYOUT_PROPERTIES } from './styles/layout';
import { FLEX_GRID_PARENT_PROPERTIES } from './styles/flexAndGridParent';
import { FLEX_GRID_CHILD_PROPERTIES } from './styles/flexAndGridChild';
import { SPACING_PROPERTIES } from './styles/spacing';
import { TYPOGRAPHY_PROPERTIES } from './styles/typography';
import { APPEARANCE_PROPERTIES } from './styles/appearance';

export const STYLE_PROPERTIES = [
    { group: 'Layout', properties: LAYOUT_PROPERTIES },
    { group: 'Flex & Grid Parent', properties: FLEX_GRID_PARENT_PROPERTIES },
    { group: 'Flex & Grid Child', properties: FLEX_GRID_CHILD_PROPERTIES },
    { group: 'Spacing', properties: SPACING_PROPERTIES },
    { group: 'Typography', properties: TYPOGRAPHY_PROPERTIES },
    { group: 'Appearance', properties: APPEARANCE_PROPERTIES }
] as const;