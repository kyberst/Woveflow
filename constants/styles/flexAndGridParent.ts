export const FLEX_GRID_PARENT_PROPERTIES = [
    { label: 'Columns (Grid)', prop: 'gridTemplateColumns', type: 'text' },
    { label: 'Rows (Grid)', prop: 'gridTemplateRows', type: 'text' },
    { label: 'Gap', prop: 'gap', type: 'text' },
    { label: 'Direction', prop: 'flexDirection', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    { label: 'Wrap', prop: 'flexWrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
    { label: 'Justify Content', prop: 'justifyContent', type: 'select', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
    { label: 'Align Items', prop: 'alignItems', type: 'select', options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'] },
];