import { useEditor } from '../../../../hooks/useEditor';

export function useElementToolbar() {
  const { state, dispatch } = useEditor();

  const handleAction = (type: any) => {
    dispatch({ type });
    dispatch({ type: 'ADD_HISTORY' });
  };

  const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ id: state.selectedElementId }));
      e.dataTransfer.effectAllowed = 'move';
      dispatch({ type: 'SET_IS_DRAGGING', payload: true });
  };
  
  const handleDragEnd = () => {
      dispatch({ type: 'CLEAR_DRAG_STATE' });
  };

  const handleSelectParent = () => dispatch({ type: 'SELECT_PARENT'});
  const handleToggleSettingsModal = () => dispatch({ type: 'TOGGLE_SETTINGS_MODAL', payload: true });
  const handleToggleCodeEditorModal = () => dispatch({ type: 'TOGGLE_CODE_EDITOR_MODAL', payload: true });
  const handleToggleAIModal = () => dispatch({ type: 'TOGGLE_AI_MODAL', payload: true });
  const handleToggleSaveComponentModal = () => dispatch({ type: 'TOGGLE_SAVE_COMPONENT_MODAL', payload: true });

  return {
    handleAction,
    handleDragStart,
    handleDragEnd,
    handleSelectParent,
    handleToggleSettingsModal,
    handleToggleCodeEditorModal,
    handleToggleAIModal,
    handleToggleSaveComponentModal,
  };
}
