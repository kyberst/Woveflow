import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirtyHTML: string): string => {
  // Allow data-builder-id, link attributes, and keep basic HTML structure.
  // Forbid script/style to prevent XSS and style injection on fragments.
  // Added 'loading' for performance and 'data-variants' for responsive image storage.
  return DOMPurify.sanitize(dirtyHTML, { 
    USE_PROFILES: { html: true },
    ADD_ATTR: ['data-builder-id', 'target', 'loading', 'data-variants'], // 'href' is allowed by default with html profile
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
  });
};