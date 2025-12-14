export const FONT_FAMILIES = [ 'Arial, sans-serif', 'Georgia, serif', 'Courier New, monospace', 'Times New Roman, serif', 'Verdana, sans-serif', 'Inter, sans-serif' ];

export const STYLE_PROPERTIES = [
    { 
      group: 'Layout', 
      properties: [
        { label: 'Display', prop: 'display', type: 'select', options: ['block', 'inline-block', 'flex', 'grid', 'none', 'inline'] },
        { label: 'Position', prop: 'position', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
        { label: 'Top', prop: 'top', type: 'text' },
        { label: 'Bottom', prop: 'bottom', type: 'text' },
        { label: 'Left', prop: 'left', type: 'text' },
        { label: 'Right', prop: 'right', type: 'text' },
        { label: 'Z-Index', prop: 'zIndex', type: 'text' },
        { label: 'Float', prop: 'float', type: 'select', options: ['none', 'left', 'right'] },
        { label: 'Width', prop: 'width', type: 'text' },
        { label: 'Height', prop: 'height', type: 'text' },
        { label: 'Min Width', prop: 'minWidth', type: 'text' },
        { label: 'Min Height', prop: 'minHeight', type: 'text' },
        { label: 'Max Width', prop: 'maxWidth', type: 'text' },
        { label: 'Overflow', prop: 'overflow', type: 'select', options: ['visible', 'hidden', 'scroll', 'auto'] },
      ]
    },
    {
      group: 'Flex & Grid Parent',
      properties: [
        { label: 'Columns (Grid)', prop: 'gridTemplateColumns', type: 'text' },
        { label: 'Rows (Grid)', prop: 'gridTemplateRows', type: 'text' },
        { label: 'Gap', prop: 'gap', type: 'text' },
        { label: 'Direction', prop: 'flexDirection', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
        { label: 'Wrap', prop: 'flexWrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
        { label: 'Justify Content', prop: 'justifyContent', type: 'select', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
        { label: 'Align Items', prop: 'alignItems', type: 'select', options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'] },
      ]
    },
    {
      group: 'Flex & Grid Child',
      properties: [
        { label: 'Col Span (Grid)', prop: 'gridColumn', type: 'text' },
        { label: 'Row Span (Grid)', prop: 'gridRow', type: 'text' },
        { label: 'Grow (Flex)', prop: 'flexGrow', type: 'text' },
        { label: 'Shrink (Flex)', prop: 'flexShrink', type: 'text' },
        { label: 'Basis (Flex)', prop: 'flexBasis', type: 'text' },
        { label: 'Align Self', prop: 'alignSelf', type: 'select', options: ['auto', 'flex-start', 'flex-end', 'center', 'stretch'] },
        { label: 'Order', prop: 'order', type: 'text' },
      ]
    },
    { 
      group: 'Spacing', 
      properties: [
        { label: 'Margin Top', prop: 'marginTop', type: 'text' },
        { label: 'Margin Bottom', prop: 'marginBottom', type: 'text' },
        { label: 'Margin Left', prop: 'marginLeft', type: 'text' },
        { label: 'Margin Right', prop: 'marginRight', type: 'text' },
        { label: 'Padding Top', prop: 'paddingTop', type: 'text' },
        { label: 'Padding Bottom', prop: 'paddingBottom', type: 'text' },
        { label: 'Padding Left', prop: 'paddingLeft', type: 'text' },
        { label: 'Padding Right', prop: 'paddingRight', type: 'text' },
      ]
    },
    { 
      group: 'Typography',
      properties: [
        { label: 'Color', prop: 'color', type: 'color' },
        { label: 'Font Size', prop: 'fontSize', type: 'text' },
        { label: 'Font Weight', prop: 'fontWeight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
        { label: 'Font Family', prop: 'fontFamily', type: 'select', options: FONT_FAMILIES },
        { label: 'Text Align', prop: 'textAlign', type: 'select', options: ['left', 'center', 'right', 'justify'] },
        { label: 'Line Height', prop: 'lineHeight', type: 'text' },
        { label: 'Letter Spacing', prop: 'letterSpacing', type: 'text' },
        { label: 'Text Decoration', prop: 'textDecoration', type: 'select', options: ['none', 'underline', 'overline', 'line-through'] },
        { label: 'Text Transform', prop: 'textTransform', type: 'select', options: ['none', 'capitalize', 'uppercase', 'lowercase'] },
      ]
    },
    { 
      group: 'Appearance',
      properties: [
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
      ]
    }
] as const;

export const ANIMATION_TYPES = ['none', 'fadeIn', 'fadeOut', 'slideInUp', 'slideInDown', 'zoomIn', 'bounce'];