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
      const { targetId, mode } = state.dragOverState;
      
      if (parsed.layerId) {
           dispatch({ type: 'MOVE_ELEMENT', payload: { elementId: parsed.layerId, targetId, position: mode } });
      } else if (parsed.id) {
          // Check custom components first, then system components via Registry
          const customComp = state.components.find(c => c.id === parsed.id);
          const systemComp = getSystemComponentById(parsed.id);
          const comp = customComp || systemComp;

          if (comp) {
              const content = typeof comp.content === 'string' 
                  ? htmlToJson(comp.content as string)[0] 
                  : comp.content;

              dispatch({ type: 'ADD_ELEMENT', payload: { targetId, mode, element: JSON.parse(JSON.stringify(content)) } });
          }
      }
      dispatch({ type: 'ADD_HISTORY' });
    } catch (error) { console.error('Drop Error', error); }
    dispatch({ type: 'CLEAR_DRAG_STATE' });
  };

  return onDrop;
};
