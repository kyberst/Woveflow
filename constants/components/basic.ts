import { ComponentTemplate } from '../../types';
import { COMMON_STYLE } from './_common';

export const BASIC_COMPONENTS: ComponentTemplate[] = [
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
];