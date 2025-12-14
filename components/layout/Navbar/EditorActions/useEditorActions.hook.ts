import { useEditor } from '../../../../hooks/useEditor';

export function useEditorActions() {
    const { state, dispatch } = useEditor();

    const handleUndo = () => dispatch({ type: 'UNDO' });
    const handleRedo = () => dispatch({ type: 'REDO' });
    const handleTogglePreview = () => dispatch({ type: 'TOGGLE_PREVIEW' });

    return {
        isPreviewing: state.isPreviewing,
        handleUndo,
        handleRedo,
        handleTogglePreview,
    };
}