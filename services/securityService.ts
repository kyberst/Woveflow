import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirtyHTML: string): string => {
  // Allow data-builder-id for our internal tracking
  return DOMPurify.sanitize(dirtyHTML, { 
    USE_PROFILES: { html: true },
    ADD_ATTR: ['data-builder-id'] 
  });
};