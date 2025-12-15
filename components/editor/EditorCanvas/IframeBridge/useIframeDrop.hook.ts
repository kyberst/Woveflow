import { DragEvent } from 'react';
import { useEditor } from '../../../../hooks/useEditor';
import { getSystemComponentById } from '../../../../services/componentRegistry';
import { htmlToJson } from '../../../../utils/htmlToJson';

export const useIframeDrop = () => {
  const { state, dispatch } = useEditor();

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (!state.dragOverState) return;
    const data = e.dataTransfer?.getData('application/json');
    if (!data) return;
    
    try {
      const parsed = JSON.parse(data);
      const { targetId, mode, activeCell } = state.dragOverState;
      
      // Determine Styles if dropping into a grid cell
      let placementStyles: any = {};
      if (activeCell) {
          placementStyles = {
              gridColumnStart: activeCell.colIndex,
              gridRowStart: activeCell.rowIndex,
              // Optional: reset span to default 1 to avoid carrying over massive spans
              gridColumnEnd: 'span 1', 
              gridRowEnd: 'span 1'
          };
      }

      if (parsed.layerId) {
           // --- MOVE EXISTING ELEMENT ---
           const payload: any = { 
               elementId: parsed.layerId, 
               targetId, 
               position: mode 
           };
           
           if (activeCell) {
               payload.newStyles = placementStyles;
               payload.viewMode = state.viewMode;
           }

           dispatch({ type: 'MOVE_ELEMENT', payload });

      } else if (parsed.id) {
          // --- ADD NEW COMPONENT ---
          const customComp = state.components.find(c => c.id === parsed.id);
          const systemComp = getSystemComponentById(parsed.id);
          const comp = customComp || systemComp;

          if (comp) {
              let content = typeof comp.content === 'string' 
                  ? htmlToJson(comp.content as string)[0] 
                  : comp.content;
              
              // Deep copy
              const element = JSON.parse(JSON.stringify(content));

              // Apply Grid Positioning if applicable
              if (activeCell) {
                  // Merge into existing desktop styles
                  element.styles.desktop = {
                      ...element.styles.desktop,
                      ...placementStyles
                  };
              }

              dispatch({ type: 'ADD_ELEMENT', payload: { targetId, mode, element } });
          }
      }
      dispatch({ type: 'ADD_HISTORY' });
    } catch (error) { console.error('Drop Error', error); }
    dispatch({ type: 'CLEAR_DRAG_STATE' });
  };

  return onDrop;
};