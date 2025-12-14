import { useEditor } from '../../../../hooks/useEditor';

export function useThemeToggle() {
    const { state, dispatch } = useEditor();

    const handleToggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

    return {
        theme: state.theme,
        handleToggleTheme,
    };
}