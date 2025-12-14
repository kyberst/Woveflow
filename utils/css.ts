/**
 * Minifies a CSS string by removing comments, newlines, and excess whitespace.
 */
export const minifyCss = (css: string): string => {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s*([{}:;,])\s*/g, '$1') // remove whitespace around operators
        .replace(/\s\s+/g, ' ') // collapse multiple spaces into one
        .trim();
};
