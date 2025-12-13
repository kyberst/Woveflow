# Woveflow - Modern Web Editor

Woveflow is a highly interactive, modern WYSIWYG (What You See Is What You Get) web editor built with React and TypeScript. It allows users to visually create and design web pages with a drag-and-drop interface, responsive design previews, and powerful editing tools, including AI-powered content generation with Google's Gemini API.

## ✨ Key Features

- **Visual Drag-and-Drop Interface**: Build pages by visually adding and arranging components.
- **Inline Text Editing**: Double-click any text element to edit it directly on the canvas with a floating toolbar.
- **Element Resizing & Moving**: Easily resize and reposition elements with interactive handlers.
- **Responsive Design Preview**: Instantly switch between desktop, tablet, and mobile views.
- **AI-Powered Content Generation**: Use the Gemini API to generate or modify HTML content based on text prompts.
- **Component-Based Architecture**: Utilize pre-defined components for structure, basic elements, and widgets.
- **Save & Reuse Custom Components**: Save any element as a reusable component for future use.
- **Detailed Element Inspector**: Fine-tune content, styles (CSS), and advanced properties (visibility, animations) for each element.
- **Internationalization (i18n)**: Support for multiple languages (English and Spanish already implemented).
- **Undo/Redo History**: Easily navigate through the change history.
- **Secure HTML Handling**: Utilizes DOMPurify to prevent XSS attacks.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Generative AI**: Google Gemini API (`@google/genai`)
- **Routing**: `react-router-dom`
- **Internationalization**: `i18next` & `react-i18next`
- **Security**: `dompurify`

## 📂 Project Structure

The project is organized in a modular structure for easy maintenance and scalability.

```
/
├── components/         # React components, organized by feature (editor, layout, etc.)
├── constants.ts        # Application constants (component lists, initial pages, etc.)
├── context/            # React Context for global state management (EditorContext)
├── hooks/              # Custom hooks (useEditor, useEditorReducer)
├── i18n/               # Internationalization config and translation files
├── index.html          # The HTML entry point
├── index.tsx           # The React entry point
├── pages/              # Top-level page components
├── services/           # Services for external APIs (Gemini, security)
├── styles/             # Global CSS styles
└── types.ts            # TypeScript type definitions
```

## 🛠️ Installation & Setup

This project uses an `importmap` in `index.html` to manage dependencies, so a traditional `npm install` step is not required.

1.  **Clone the Repository**
    ```bash
    git clone <REPOSITORY_URL>
    cd woveflow
    ```

2.  **Set up Gemini API Key**
    - Woveflow uses the Google Gemini API for AI content generation. You must provide your own API key.
    - The project expects the API key to be available as an environment variable (`process.env.API_KEY`). In a local development environment or a platform like Codepen/Glitch, ensure this environment variable is configured.

3.  **Run the Project**
    - Because the project uses ES6 modules, it needs to be served by a local web server to function correctly (opening `index.html` directly from the filesystem will not work).
    - The easiest way is to use a live server extension for your code editor, such as **Live Server** for VS Code.
    - Right-click on `index.html` and select "Open with Live Server".

## 🌊 Project Flow

Woveflow operates on a unidirectional state flow managed by a React reducer, with the main editing canvas rendered inside an `iframe` to isolate styles and scripts.

1.  **Initialization**:
    - `index.tsx` renders the `App` component, which is wrapped in the `EditorProvider`.
    - `EditorProvider` initializes the global state using `useReducer` with the `editorReducer` and makes it available to the entire app via `EditorContext`.

2.  **State Management**:
    - The `useEditorReducer` hook contains all the logic for modifying the application state. It responds to `Actions` dispatched from various components.
    - The state includes the current page, content, selected element, undo history, view modes, and modal visibility.
    - The `useEditor` hook provides a simple way for components to access the state and the `dispatch` function.

3.  **The Editor Canvas (`iframe`)**:
    - The `EditorCanvas` component renders an `iframe`. The current page's HTML content is injected into the iframe's `srcDoc`.
    - The **`useIframeBridge`** hook is the core of interactivity. It runs after the iframe loads and:
        - Adds a unique `data-builder-id` attribute to every element inside the `iframe` for tracking.
        - Attaches event listeners (`click`, `dblclick`, `mousemove`, `drop`) to the iframe's `document`.
        - When an event occurs (e.g., a click), the listener dispatches an action (e.g., `SET_SELECTED_ELEMENT`) with the `data-builder-id` of the target element.

4.  **Action Flow (Example: Resizing an Element)**:
    1.  The user clicks an element. The `useIframeBridge` catches the click and dispatches `SET_SELECTED_ELEMENT`.
    2.  The state updates. The `SelectionOverlay` component now renders around the selected element because `state.selectedElementId` is set.
    3.  `SelectionOverlay` includes the `ResizeHandles` component.
    4.  The user clicks and drags one of the resize handles.
    5.  The `onMouseDown` event on `ResizeHandles` triggers a `handleMouseMove` that is listened for on the `window`.
    6.  On each mouse move, `handleMouseMove` dispatches an `UPDATE_ELEMENT_STYLE` action with the new `width` and `height`.
    7.  The `editorReducer` receives the action, updates the page's HTML content in the state.
    8.  `EditorCanvas` re-renders, updating the iframe's `srcDoc`. The element appears at its new size.
    9.  When the user releases the mouse, an `ADD_HISTORY` action is dispatched to save the final state to the undo history.
