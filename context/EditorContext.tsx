import React, { createContext, useReducer, Dispatch, useState, useEffect, useMemo } from 'react';
import { EditorState, Action } from '../types';
import { editorReducer } from '../hooks/useEditorReducer';
import { getInitialState } from '../state/initialState';
import { getInitialData } from '../services/surrealdbService';

interface EditorContextProps {
  state: EditorState;
  dispatch: Dispatch<Action>;
  isLoading: boolean;
  error: string | null;
}

export const EditorContext = createContext<EditorContextProps>({
  state: getInitialState(),
  dispatch: () => null,
  isLoading: true,
  error: null,
});

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, getInitialState());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const initialStateFromDB = await getInitialData();
        dispatch({ type: 'SET_INITIAL_STATE', payload: initialStateFromDB });
      } catch (e: any) {
        setError(e.message || 'Failed to initialize database.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    isLoading,
    error,
  }), [state, isLoading, error]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};