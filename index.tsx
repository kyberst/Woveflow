import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EditorProvider } from './context/EditorContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <EditorProvider>
        <App />
      </EditorProvider>
    </I18nextProvider>
  </React.StrictMode>
);