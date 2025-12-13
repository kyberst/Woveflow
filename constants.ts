import { BuilderComponent, Page, SiteName } from './types';

export const INITIAL_PAGES: Record<SiteName, Page[]> = {
  [SiteName.MiTienda]: [
    { id: 'p1', name: 'index', type: 'system', content: '<div class="p-4"><h1>Welcome to Store</h1><p>Start editing...</p></div>' },
    { id: 'p2', name: 'precio', type: 'system', content: '<div class="p-4"><h1>Pricing</h1></div>' },
    { id: 'p3', name: 'producto', type: 'system', content: '<div class="p-4"><h1>Product Details</h1></div>' },
    { id: 'p4', name: 'acerca de', type: 'user', content: '<div class="p-4"><h1>About Us</h1></div>' },
    { id: 'p5', name: 'reclamos', type: 'user', content: '<div class="p-4"><h1>Claims</h1></div>' },
  ],
  [SiteName.MiWeb]: [
    { id: 'w1', name: 'index', type: 'system', content: '<div class="p-4"><h1>Welcome to Web</h1></div>' },
    { id: 'w2', name: 'contacto', type: 'user', content: '<div class="p-4"><h1>Contact</h1></div>' },
  ]
};

export const AVAILABLE_COMPONENTS: BuilderComponent[] = [
  // Structure
  { id: 'col-1', name: '1 Column', category: 'structure', icon: 'square', html: '<div class="builder-col grid grid-cols-1 gap-4 p-2 min-h-[50px] border border-dashed border-gray-300"></div>' },
  { id: 'col-2', name: '2 Columns', category: 'structure', icon: 'columns', html: '<div class="builder-col grid grid-cols-1 md:grid-cols-2 gap-4 p-2 min-h-[50px] border border-dashed border-gray-300"><div></div><div></div></div>' },
  { id: 'col-3', name: '3 Columns', category: 'structure', icon: 'layout', html: '<div class="builder-col grid grid-cols-1 md:grid-cols-3 gap-4 p-2 min-h-[50px] border border-dashed border-gray-300"><div></div><div></div><div></div></div>' },
  // Basic
  { id: 'heading', name: 'Heading', category: 'basic', icon: 'type', html: '<h2 class="text-2xl font-bold mb-2">New Heading</h2>' },
  { id: 'paragraph', name: 'Paragraph', category: 'basic', icon: 'align-left', html: '<p class="mb-4 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' },
  { id: 'button', name: 'Button', category: 'basic', icon: 'mouse-pointer', html: '<button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Click Me</button>' },
  { id: 'image', name: 'Image', category: 'basic', icon: 'image', html: '<img src="https://picsum.photos/400/300" alt="Placeholder" class="max-w-full h-auto rounded" />' },
  // Widgets
  { id: 'map', name: 'Google Map', category: 'widget', icon: 'map-pin', html: '<div class="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">Google Map Placeholder</div>' },
  { id: 'video', name: 'Embed Video', category: 'widget', icon: 'video', html: '<div class="aspect-w-16 aspect-h-9 bg-black text-white flex items-center justify-center">Video Embed</div>' },
  // Sections
  { id: 'product-single', name: 'Product', category: 'section', icon: 'shopping-bag', html: '<div class="border p-4 rounded shadow-sm"><img src="https://picsum.photos/200" class="mb-2" /><h3>Product Name</h3><p>$99.99</p></div>' }
];

export const FONT_FAMILIES = [ 'Arial, sans-serif', 'Georgia, serif', 'Courier New, monospace', 'Times New Roman, serif', 'Verdana, sans-serif' ];

export const STYLE_PROPERTIES = [
    { group: 'Layout', 
      properties: [
        { label: 'Display', prop: 'display', type: 'select', options: ['block', 'inline-block', 'flex', 'grid', 'none'] },
        { label: 'Position', prop: 'position', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
        { label: 'Top', prop: 'top', type: 'text' }, { label: 'Right', prop: 'right', type: 'text' },
        { label: 'Bottom', prop: 'bottom', type: 'text' }, { label: 'Left', prop: 'left', type: 'text' },
        { label: 'Width', prop: 'width', type: 'text' }, { label: 'Height', prop: 'height', type: 'text' },
        { label: 'Min Width', prop: 'minWidth', type: 'text' }, { label: 'Min Height', prop: 'minHeight', type: 'text' },
        { label: 'Opacity', prop: 'opacity', type: 'range', min: 0, max: 1, step: 0.1 },
      ]
    },
    { group: 'Typography',
      properties: [
        { label: 'Color', prop: 'color', type: 'color' },
        { label: 'Font Size', prop: 'fontSize', type: 'text' },
        { label: 'Font Weight', prop: 'fontWeight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
        { label: 'Font Family', prop: 'fontFamily', type: 'select', options: FONT_FAMILIES },
        { label: 'Text Align', prop: 'textAlign', type: 'select', options: ['left', 'center', 'right', 'justify'] },
        { label: 'Line Height', prop: 'lineHeight', type: 'text' },
        { label: 'Letter Spacing', prop: 'letterSpacing', type: 'text' },
        { label: 'Text Decoration', prop: 'textDecoration', type: 'select', options: ['none', 'underline', 'overline', 'line-through'] },
      ]
    },
    { group: 'Spacing',
      properties: [
        { label: 'Margin Top', prop: 'marginTop', type: 'text' }, { label: 'Margin Right', prop: 'marginRight', type: 'text' },
        { label: 'Margin Bottom', prop: 'marginBottom', type: 'text' }, { label: 'Margin Left', prop: 'marginLeft', type: 'text' },
        { label: 'Padding Top', prop: 'paddingTop', type: 'text' }, { label: 'Padding Right', prop: 'paddingRight', type: 'text' },
        { label: 'Padding Bottom', prop: 'paddingBottom', type: 'text' }, { label: 'Padding Left', prop: 'paddingLeft', type: 'text' },
      ]
    },
    { group: 'Background',
      properties: [
        { label: 'Background Color', prop: 'backgroundColor', type: 'color' },
        { label: 'Background Image', prop: 'backgroundImage', type: 'text' },
        // Future: Add more background props like size, repeat, position
      ]
    },
    { group: 'Border',
      properties: [
        { label: 'Border Style', prop: 'borderStyle', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double'] },
        { label: 'Border Width', prop: 'borderWidth', type: 'text' },
        { label: 'Border Color', prop: 'borderColor', type: 'color' },
        { label: 'Border Radius', prop: 'borderRadius', type: 'text' },
      ]
    }
] as const;

export const ANIMATION_TYPES = ['none', 'fadeIn', 'fadeOut', 'slideInUp', 'slideInDown', 'bounce', 'flash', 'pulse', 'shake'];