import { ComponentTemplate } from '../types';

const COMMON_STYLE = 'padding: 10px; border: 1px dashed #ccc; min-height: 50px;';

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // --- STRUCTURE (COLUMNS) ---
  { 
    id: 'col-1', name: '1 Column', category: 'structure', icon: 'square', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: 1fr; gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">Column 1</div>
              </div>` 
  },
  { 
    id: 'col-2', name: '2 Columns', category: 'structure', icon: 'columns', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">Column 1</div>
                <div style="${COMMON_STYLE}">Column 2</div>
              </div>` 
  },
  { 
    id: 'col-3', name: '3 Columns', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">Col 1</div><div style="${COMMON_STYLE}">Col 2</div><div style="${COMMON_STYLE}">Col 3</div>
              </div>` 
  },
  { 
    id: 'col-4', name: '4 Columns', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">1</div><div style="${COMMON_STYLE}">2</div><div style="${COMMON_STYLE}">3</div><div style="${COMMON_STYLE}">4</div>
              </div>` 
  },
  { 
    id: 'col-5', name: '5 Columns', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; width: 100%;">
                <div style="${COMMON_STYLE}">1</div><div style="${COMMON_STYLE}">2</div><div style="${COMMON_STYLE}">3</div><div style="${COMMON_STYLE}">4</div><div style="${COMMON_STYLE}">5</div>
              </div>` 
  },
  { 
    id: 'col-6', name: '6 Columns', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; width: 100%;">
                <div style="${COMMON_STYLE}">1</div><div style="${COMMON_STYLE}">2</div><div style="${COMMON_STYLE}">3</div><div style="${COMMON_STYLE}">4</div><div style="${COMMON_STYLE}">5</div><div style="${COMMON_STYLE}">6</div>
              </div>` 
  },
  { 
    id: 'col-2-1', name: '2/3 + 1/3', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">Wide</div><div style="${COMMON_STYLE}">Narrow</div>
              </div>` 
  },
  { 
    id: 'col-1-2', name: '1/3 + 2/3', category: 'structure', icon: 'layout', 
    content: `<div class="builder-component-row" style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; width: 100%;">
                <div style="${COMMON_STYLE}">Narrow</div><div style="${COMMON_STYLE}">Wide</div>
              </div>` 
  },

  // --- BASIC COMPONENTS ---
  { id: 'heading', name: 'Heading', category: 'basic', icon: 'type', content: '<h2 class="builder-component-heading text-2xl font-bold mb-2">New Heading</h2>' },
  { id: 'paragraph', name: 'Paragraph', category: 'basic', icon: 'align-left', content: '<p class="builder-component-text mb-4 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' },
  { id: 'image', name: 'Image', category: 'basic', icon: 'image', content: '<img loading="lazy" src="https://picsum.photos/400/300" alt="Placeholder" class="builder-component-img w-full h-auto rounded" />' },
  { id: 'hr', name: 'Horizontal Rule', category: 'basic', icon: 'minus', content: '<hr class="builder-component-hr my-4 border-gray-300" />' },
  { id: 'link', name: 'Link', category: 'basic', icon: 'link', content: '<a href="#" class="builder-component-link text-blue-600 hover:underline">Click Here</a>' },
  { id: 'button', name: 'HTML Button', category: 'basic', icon: 'mouse-pointer', content: '<button class="builder-component-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Button</button>' },
  { id: 'blockquote', name: 'Blockquote', category: 'basic', icon: 'quote', content: '<blockquote class="builder-component-quote border-l-4 border-gray-300 pl-4 italic">引用 text...</blockquote>' },
  { id: 'list-ul', name: 'List (UL)', category: 'basic', icon: 'list', content: '<ul class="builder-component-list list-disc pl-5"><li>Item 1</li><li>Item 2</li></ul>' },
  { id: 'table', name: 'Table', category: 'basic', icon: 'table', content: '<table class="builder-component-table w-full border-collapse border border-gray-300"><tr><th class="border p-2">Head 1</th><th class="border p-2">Head 2</th></tr><tr><td class="border p-2">Data 1</td><td class="border p-2">Data 2</td></tr></table>' },
  { id: 'pre', name: 'Preformatted', category: 'basic', icon: 'code', content: '<pre class="builder-component-pre bg-gray-100 p-2 rounded">Code block...</pre>' },
  
  // Forms
  { id: 'form', name: 'Form Container', category: 'basic', icon: 'box-select', content: '<form class="builder-component-form p-4 border rounded space-y-4"><div class="p-2 border border-dashed">Drop Inputs Here</div></form>' },
  { id: 'input', name: 'Input', category: 'basic', icon: 'text-cursor', content: '<input type="text" placeholder="Text Input" class="builder-component-input w-full p-2 border rounded" />' },
  { id: 'textarea', name: 'Text Area', category: 'basic', icon: 'file-text', content: '<textarea placeholder="Enter text..." class="builder-component-textarea w-full p-2 border rounded"></textarea>' },
  { id: 'select', name: 'Select', category: 'basic', icon: 'list', content: '<select class="builder-component-select w-full p-2 border rounded"><option>Option 1</option><option>Option 2</option></select>' },
  { id: 'checkbox', name: 'Checkbox', category: 'basic', icon: 'check-square', content: '<label class="flex items-center space-x-2"><input type="checkbox" class="builder-component-checkbox" /> <span>Check me</span></label>' },
  { id: 'radio', name: 'Radio', category: 'basic', icon: 'circle-dot', content: '<label class="flex items-center space-x-2"><input type="radio" name="radio" class="builder-component-radio" /> <span>Option</span></label>' },

  // Media
  { id: 'audio', name: 'Audio', category: 'basic', icon: 'music', content: '<audio controls class="w-full"><source src="" type="audio/mpeg">Your browser does not support audio.</audio>' },
  { id: 'video', name: 'Video (HTML5)', category: 'basic', icon: 'video', content: '<video controls class="w-full h-auto"><source src="" type="video/mp4">Your browser does not support video.</video>' },
  { id: 'iframe', name: 'Iframe', category: 'basic', icon: 'monitor', content: '<iframe src="about:blank" class="w-full h-64 border bg-gray-100"></iframe>' },

  // --- WIDGETS ---
  { id: 'gmaps', name: 'Google Maps', category: 'widget', icon: 'map-pin', content: '<iframe width="100%" height="300" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4&key=YOUR_API_KEY"></iframe>' },
  { id: 'embed-vid', name: 'Embed Video', category: 'widget', icon: 'youtube', content: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>' },
  { id: 'chartjs', name: 'Chart JS', category: 'widget', icon: 'bar-chart', content: '<div class="builder-component-chart p-4 bg-white border rounded text-center text-gray-500">[Chart.js Placeholder]</div>' },
  { id: 'lottie', name: 'Lottie', category: 'widget', icon: 'film', content: '<div class="builder-component-lottie p-4 bg-gray-50 border rounded text-center">[Lottie Animation]</div>' },
  { id: 'paypal', name: 'PayPal', category: 'widget', icon: 'credit-card', content: '<button class="bg-blue-500 text-white px-6 py-2 rounded font-bold italic">PayPal <span class="font-normal text-xs">Checkout</span></button>' },
  { id: 'twitter', name: 'Twitter Feed', category: 'widget', icon: 'twitter', content: '<div class="p-4 border rounded bg-blue-50 text-blue-500">[Twitter Feed Embed]</div>' },
  { id: 'osm', name: 'Open Street Map', category: 'widget', icon: 'map', content: '<iframe width="100%" height="300" src="https://www.openstreetmap.org/export/embed.html"></iframe>' },

  // --- SECTIONS (API DRIVEN) ---
  { 
    id: 'section-products', name: 'Products Carousel', category: 'section', icon: 'shopping-bag', 
    content: `<div class="builder-component-products-carousel py-8">...</div>`
  },
  {
    id: 'section-product-single', name: 'Single Product', category: 'section', icon: 'tag',
    content: `<div class="builder-component-product-single" data-product-id="prod-123">...</div>`
  },
  
  // --- CUSTOM EXAMPLES ---
  { id: 'custom-1', name: 'My Hero', category: 'custom', icon: 'star', content: '<div class="bg-indigo-600 text-white p-12 text-center rounded"><h1>Hero Section</h1><p>Subtitle here</p></div>' },
];