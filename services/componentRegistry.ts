import { BuilderComponent } from '../types';
import { COMPONENT_TEMPLATES } from '../constants';
import { htmlToJson } from '../utils/htmlToJson';

// Singleton cache for parsed system components to avoid re-parsing overhead
let systemComponentsCache: BuilderComponent[] | null = null;

/**
 * Retrieves all available system components.
 * Lazily parses HTML templates into JSON trees on the first call.
 */
export const getSystemComponents = (): BuilderComponent[] => {
  if (systemComponentsCache) {
    return systemComponentsCache;
  }

  try {
      systemComponentsCache = COMPONENT_TEMPLATES.map(tmpl => ({
        ...tmpl,
        owner: 'system',
        content: htmlToJson(tmpl.content)[0] // Assumes single root element in template
      }));
  } catch (error) {
      console.error("[ComponentRegistry] Failed to parse component templates:", error);
      return [];
  }

  return systemComponentsCache;
};

/**
 * Retrieves a specific system component by its ID.
 */
export const getSystemComponentById = (id: string): BuilderComponent | undefined => {
  return getSystemComponents().find(c => c.id === id);
};