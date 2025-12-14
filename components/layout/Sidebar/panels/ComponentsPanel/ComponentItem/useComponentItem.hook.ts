import { useEditor } from '../../../../../../hooks/useEditor';
import { BuilderComponent } from '../../../../../../types';

export function useComponentItem(component: BuilderComponent, onClick?: (component: BuilderComponent) => void) {
    const { dispatch } = useEditor();
    const isClickable = !!onClick;

    const handleDragStart = (e: React.DragEvent) => {
        const payload = { id: component.id };
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copy';
        dispatch({ type: 'SET_IS_DRAGGING', payload: true });
    };

    const handleDragEnd = () => {
        dispatch({ type: 'CLEAR_DRAG_STATE' });
    };

    const handleClick = () => {
        if (onClick) {
            onClick(component);
        }
    };

    return {
        componentName: component.name,
        isClickable,
        handleDragStart,
        handleDragEnd,
        handleClick,
    };
}