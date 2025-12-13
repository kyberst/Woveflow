import React, { createContext, useReducer, Dispatch } from 'react';
import { EditorState, Action } from '../types';
import { editorReducer, getInitialState } from '../hooks/useEditorReducer';

interface EditorContextProps {
  state: EditorState;
  dispatch: Dispatch<Action>;
}

export const EditorContext = createContext<EditorContextProps>({
  state: getInitialState(),
  dispatch: () => null,
});

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, getInitialState());

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};