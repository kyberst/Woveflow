import { ComponentTemplate } from '../../types';
import { COMMON_STYLE } from './_common';

export const STRUCTURE_COMPONENTS: ComponentTemplate[] = [
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
];