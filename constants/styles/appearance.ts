export const APPEARANCE_PROPERTIES = [
    { label: 'Opacity', prop: 'opacity', type: 'range', min: 0, max: 1, step: 0.1 },
    { label: 'Background Color', prop: 'backgroundColor', type: 'color' },
    { label: 'Background Image', prop: 'backgroundImage', type: 'text' },
    { label: 'Object Fit', prop: 'objectFit', type: 'select', options: ['fill', 'contain', 'cover', 'none', 'scale-down'] },
    { label: 'Border Style', prop: 'borderStyle', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double'] },
    { label: 'Border Width', prop: 'borderWidth', type: 'text' },
    { label: 'Border Color', prop: 'borderColor', type: 'color' },
    { label: 'Radius Top', prop: 'borderTopLeftRadius', type: 'text' },
    { label: 'Radius Bottom', prop: 'borderBottomRightRadius', type: 'text' },
    { label: 'Border Radius', prop: 'borderRadius', type: 'text' },
    { label: 'Box Shadow', prop: 'boxShadow', type: 'text' },
];