import { ComponentTemplate } from '../../types';

export const SECTION_COMPONENTS: ComponentTemplate[] = [
    { 
        id: 'section-products', name: 'Products Carousel', category: 'section', icon: 'shopping-bag', 
        content: `<div class="builder-component-products-carousel py-8">...</div>`
    },
    {
        id: 'section-product-single', name: 'Single Product', category: 'section', icon: 'tag',
        content: `<div class="builder-component-product-single" data-product-id="prod-123">...</div>`
    },
];