import { EditorState, BuilderElementNode } from '../types';
import { jsonToHtml, generateDesignTokensCSS, generateGlobalStyles } from '../utils/jsonToHtml';
import { runHook } from './pluginService';
import JSZip from 'jszip';

/**
 * Recursively traverses the node tree to collect a unique set of all class names used.
 */
const collectUsedClasses = (nodes: (BuilderElementNode | string)[]): Set<string> => {
    const classSet = new Set<string>();
    const traverse = (nodeList: (BuilderElementNode | string)[]) => {
        nodeList.forEach(node => {
            if (typeof node === 'string') return;
            if (node.classNames) {
                node.classNames.forEach(cn => classSet.add(cn));
            }
            if (node.children) {
                traverse(node.children);
            }
        });
    };
    traverse(nodes);
    return classSet;
};

/**
 * Minifies a CSS string by removing comments, newlines, and excess whitespace.
 */
const minifyCss = (css: string): string => {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s*([{}:;,])\s*/g, '$1') // remove whitespace around operators
        .replace(/\s\s+/g, ' ') // collapse multiple spaces into one
        .trim();
};

/**
 * Generates a static site from the current editor state, packages it into a ZIP file,
 * and initiates a download.
 */
export const exportStaticSite = async (state: EditorState): Promise<void> => {
    const page = state.pages.find(p => p.id === state.currentPageId);
    if (!page) {
        throw new Error("Current page not found for export.");
    }

    // Allow plugins to modify content before publishing
    const finalContent = await runHook('onPublish', page.content, { page, state });

    // --- CSS Generation ---
    const usedClasses = collectUsedClasses(finalContent);
    const designTokensCss = generateDesignTokensCSS(state.designTokens);
    
    const purgedGlobalClasses = state.globalClasses.filter(gc => usedClasses.has(gc.name));
    const globalStylesCss = generateGlobalStyles(purgedGlobalClasses);

    const finalCss = minifyCss(`${designTokensCss}\n\n${globalStylesCss}`);
    const cssFileName = 'styles.css';

    // --- HTML Generation ---
    const productionBodyHtml = jsonToHtml(finalContent, state.components, true, state.viewMode, true); // isProduction = true
    
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="./${cssFileName}">
</head>
<body>
${productionBodyHtml}
</body>
</html>`;

    // --- Zipping and Downloading ---
    const zip = new JSZip();
    zip.file('index.html', finalHtml);
    zip.file(cssFileName, finalCss);

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${page.name.replace(/\s+/g, '-') || 'website'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};
