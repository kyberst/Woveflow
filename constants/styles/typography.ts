import { FONT_FAMILIES } from '../fontFamilies';

export const TYPOGRAPHY_PROPERTIES = [
    { label: 'Color', prop: 'color', type: 'color' },
    { label: 'Font Size', prop: 'fontSize', type: 'text' },
    { label: 'Font Weight', prop: 'fontWeight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { label: 'Font Family', prop: 'fontFamily', type: 'select', options: FONT_FAMILIES },
    { label: 'Text Align', prop: 'textAlign', type: 'select', options: ['left', 'center', 'right', 'justify'] },
    { label: 'Line Height', prop: 'lineHeight', type: 'text' },
    { label: 'Letter Spacing', prop: 'letterSpacing', type: 'text' },
    { label: 'Text Decoration', prop: 'textDecoration', type: 'select', options: ['none', 'underline', 'overline', 'line-through'] },
    { label: 'Text Transform', prop: 'textTransform', type: 'select', options: ['none', 'capitalize', 'uppercase', 'lowercase'] },
];