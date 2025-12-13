# Woveflow - Editor Web Moderno

Woveflow es un editor web WYSIWYG (Lo que ves es lo que obtienes) altamente interactivo y moderno, construido con React y TypeScript. Permite a los usuarios crear y diseñar páginas web visualmente con una interfaz de arrastrar y soltar, previsualizaciones de diseño responsivo y potentes herramientas de edición, incluida la generación de contenido impulsada por IA con la API de Gemini de Google.

## ✨ Características Principales

- **Interfaz Visual de Arrastrar y Soltar**: Construye páginas añadiendo y organizando componentes visualmente.
- **Edición de Texto en Línea**: Haz doble clic en cualquier elemento de texto para editarlo directamente en el lienzo con una barra de herramientas flotante.
- **Redimensión y Movimiento de Elementos**: Redimensiona y reposiciona elementos fácilmente con manejadores interactivos.
- **Previsualización de Diseño Responsivo**: Cambia instantáneamente entre las vistas de escritorio, tableta y móvil.
- **Generación de Contenido con IA**: Utiliza la API de Gemini para generar o modificar contenido HTML basado en indicaciones de texto.
- **Arquitectura Basada en Componentes**: Utiliza componentes predefinidos para la estructura, elementos básicos y widgets.
- **Guardar y Reutilizar Componentes Personalizados**: Guarda cualquier elemento como un componente reutilizable para un uso futuro.
- **Inspector de Elementos Detallado**: Ajusta el contenido, los estilos (CSS) y las propiedades avanzadas (visibilidad, animaciones) para cada elemento.
- **Internacionalización (i18n)**: Soporte para múltiples idiomas (Inglés y Español ya implementados).
- **Historial de Deshacer/Rehacer**: Navega fácilmente a través del historial de cambios.
- **Manejo Seguro de HTML**: Utiliza DOMPurify para prevenir ataques XSS.

## 🚀 Pila Tecnológica

- **Frontend**: React, TypeScript
- **Estilos**: Tailwind CSS
- **IA Generativa**: API de Gemini de Google (`@google/genai`)
- **Enrutamiento**: `react-router-dom`
- **Internacionalización**: `i18next` y `react-i18next`
- **Seguridad**: `dompurify`

## 📂 Estructura del Proyecto

El proyecto está organizado en una estructura modular para facilitar el mantenimiento y la escalabilidad.

```
/
├── components/         # Componentes de React, organizados por característica (editor, layout, etc.)
├── constants.ts        # Constantes de la aplicación (listas de componentes, páginas iniciales, etc.)
├── context/            # Contexto de React para la gestión del estado global (EditorContext)
├── hooks/              # Hooks personalizados (useEditor, useEditorReducer)
├── i18n/               # Configuración de internacionalización y archivos de traducción
├── index.html          # El punto de entrada HTML
├── index.tsx           # El punto de entrada de React
├── pages/              # Componentes de página de nivel superior
├── services/           # Servicios para APIs externas (Gemini, seguridad)
├── styles/             # Estilos CSS globales
└── types.ts            # Definiciones de tipos de TypeScript
```

## 🛠️ Instalación y Configuración

Este proyecto utiliza un `importmap` en `index.html` para gestionar las dependencias, por lo que no se requiere un paso tradicional de `npm install`.

1.  **Clonar el Repositorio**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd woveflow
    ```

2.  **Configurar la Clave de API de Gemini**
    - Woveflow utiliza la API de Gemini de Google para la generación de contenido con IA. Debes proporcionar tu propia clave de API.
    - El proyecto espera que la clave de API esté disponible como una variable de entorno (`process.env.API_KEY`). En un entorno de desarrollo local o en una plataforma como Codepen/Glitch, asegúrate de que esta variable de entorno esté configurada.

3.  **Ejecutar el Proyecto**
    - Debido a que el proyecto utiliza módulos ES6, necesita ser servido por un servidor web local para funcionar correctamente (abrir `index.html` directamente desde el sistema de archivos no funcionará).
    - La forma más fácil es usar una extensión de servidor en vivo para tu editor de código, como **Live Server** para VS Code.
    - Haz clic derecho en `index.html` y selecciona "Abrir con Live Server".

## 🌊 Flujo del Proyecto

Woveflow opera en un flujo de estado unidireccional gestionado por un reductor de React, con el lienzo de edición principal renderizado dentro de un `iframe` para aislar los estilos y scripts.

1.  **Inicialización**:
    - `index.tsx` renderiza el componente `App`, que está envuelto en el `EditorProvider`.
    - `EditorProvider` inicializa el estado global usando `useReducer` con `editorReducer` y lo pone a disposición de toda la aplicación a través del `EditorContext`.

2.  **Gestión del Estado**:
    - El hook `useEditorReducer` contiene toda la lógica para modificar el estado de la aplicación. Responde a `Actions` despachadas desde varios componentes.
    - El estado incluye la página actual, el contenido, el elemento seleccionado, el historial de deshacer, los modos de visualización y la visibilidad de los modales.
    - El hook `useEditor` proporciona una forma sencilla para que los componentes accedan al estado y a la función `dispatch`.

3.  **El Lienzo del Editor (`iframe`)**:
    - El componente `EditorCanvas` renderiza un `iframe`. El contenido HTML de la página actual se inyecta en el `srcDoc` del iframe.
    - El hook **`useIframeBridge`** es el núcleo de la interactividad. Se ejecuta después de que el iframe se carga y:
        - Añade un atributo único `data-builder-id` a cada elemento dentro del `iframe` para su seguimiento.
        - Adjunta escuchadores de eventos (`click`, `dblclick`, `mousemove`, `drop`) al `document` del iframe.
        - Cuando ocurre un evento (por ejemplo, un clic), el escuchador despacha una acción (por ejemplo, `SET_SELECTED_ELEMENT`) con el `data-builder-id` del elemento objetivo.

4.  **Flujo de una Acción (Ejemplo: Redimensionar un Elemento)**:
    1.  El usuario hace clic en un elemento. El `useIframeBridge` captura el clic y despacha `SET_SELECTED_ELEMENT`.
    2.  El estado se actualiza. El componente `SelectionOverlay` ahora se renderiza alrededor del elemento seleccionado porque `state.selectedElementId` está establecido.
    3.  `SelectionOverlay` incluye el componente `ResizeHandles`.
    4.  El usuario hace clic y arrastra uno de los manejadores de redimensión.
    5.  El evento `onMouseDown` en `ResizeHandles` activa un `handleMouseMove` que se escucha en el `window`.
    6.  En cada movimiento del ratón, `handleMouseMove` despacha una acción `UPDATE_ELEMENT_STYLE` con el nuevo `width` y `height`.
    7.  El `editorReducer` recibe la acción, actualiza el contenido HTML de la página en el estado.
    8.  `EditorCanvas` se vuelve a renderizar, actualizando el `srcDoc` del iframe. El elemento aparece con su nuevo tamaño.
    9.  Cuando el usuario suelta el ratón, se despacha una acción `ADD_HISTORY` para guardar el estado final en el historial de deshacer.
```