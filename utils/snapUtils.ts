import { CSSProperties } from 'react';
import { SnapGuide, ContainerHighlight } from '../types';

export const calculateSnapping = (
  rect: DOMRect,
  builderEl: HTMLElement,
  doc: Document
): { guides: SnapGuide[], containerHighlight: ContainerHighlight | null } => {
  const guides: SnapGuide[] = [];
  let containerHighlight: ContainerHighlight | null = null;
  
  const computed = doc.defaultView?.getComputedStyle(builderEl);

  // 1. Calculate Container Highlight (Padding)
  if (computed) {
      containerHighlight = {
          rect: JSON.parse(JSON.stringify(rect)),
          padding: {
              top: parseFloat(computed.paddingTop) || 0,
              right: parseFloat(computed.paddingRight) || 0,
              bottom: parseFloat(computed.paddingBottom) || 0,
              left: parseFloat(computed.paddingLeft) || 0,
          }
      };
  }

  // 2. GRID SNAPPING LOGIC
  if (computed && computed.display === 'grid') {
      const colGap = parseFloat(computed.columnGap) || 0;
      const rowGap = parseFloat(computed.rowGap) || 0;
      
      // Parse Columns (e.g., "100px 100px")
      const colTracks = computed.gridTemplateColumns !== 'none' 
          ? computed.gridTemplateColumns.split(' ').map(parseFloat) 
          : [];
      
      let currentX = rect.left + (parseFloat(computed.borderLeftWidth) || 0) + (parseFloat(computed.paddingLeft) || 0);
      
      // Add start line
      guides.push({ id: `g-c-start`, orientation: 'vertical', x: currentX, y: rect.top, length: rect.height });

      colTracks.forEach((width, i) => {
          currentX += width;
          // Line at end of column
          guides.push({ id: `g-c-${i}`, orientation: 'vertical', x: currentX, y: rect.top, length: rect.height });
          currentX += colGap;
          // Line at start of next column (after gap)
          if (colGap > 0 && i < colTracks.length - 1) {
              guides.push({ id: `g-c-gap-${i}`, orientation: 'vertical', x: currentX, y: rect.top, length: rect.height });
          }
      });

      // Parse Rows
      const rowTracks = computed.gridTemplateRows !== 'none'
          ? computed.gridTemplateRows.split(' ').map(parseFloat)
          : [];
          
      let currentY = rect.top + (parseFloat(computed.borderTopWidth) || 0) + (parseFloat(computed.paddingTop) || 0);
      
      guides.push({ id: `g-r-start`, orientation: 'horizontal', x: rect.left, y: currentY, length: rect.width });

      rowTracks.forEach((height, i) => {
          currentY += height;
          guides.push({ id: `g-r-${i}`, orientation: 'horizontal', x: rect.left, y: currentY, length: rect.width });
          currentY += rowGap;
          if (rowGap > 0 && i < rowTracks.length - 1) {
              guides.push({ id: `g-r-gap-${i}`, orientation: 'horizontal', x: rect.left, y: currentY, length: rect.width });
          }
      });
  }

  // 3. SIBLING SNAPPING LOGIC (Existing)
  // Only apply sibling snapping if NOT strictly snapping to a grid, or to augment it
  const parent = builderEl.parentElement;
  if (parent) {
      const siblings = Array.from(parent.children) as HTMLElement[];
      const SNAP_THRESHOLD = 5;
      const targetLeft = rect.left;
      const targetRight = rect.right;

      siblings.forEach(sib => {
          if (sib === builderEl || !sib.getBoundingClientRect) return;
          const sibRect = sib.getBoundingClientRect();
          
          // Snap Left-to-Left
          if (Math.abs(sibRect.left - targetLeft) < SNAP_THRESHOLD) {
              guides.push({
                  id: `g-l-${Math.random()}`,
                  orientation: 'vertical',
                  x: targetLeft,
                  y: Math.min(rect.top, sibRect.top),
                  length: Math.max(rect.bottom, sibRect.bottom) - Math.min(rect.top, sibRect.top)
              });
          }
           // Snap Right-to-Right
           if (Math.abs(sibRect.right - targetRight) < SNAP_THRESHOLD) {
              guides.push({
                  id: `g-r-${Math.random()}`,
                  orientation: 'vertical',
                  x: targetRight,
                  y: Math.min(rect.top, sibRect.top),
                  length: Math.max(rect.bottom, sibRect.bottom) - Math.min(rect.top, sibRect.top)
              });
          }
      });
  }
  
  return { guides, containerHighlight };
};