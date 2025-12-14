import { registerPlugin } from '../services/pluginService';
import { seoOptimizerPlugin } from './seoOptimizerPlugin';

/**
 * This is the central registration point for all editor plugins.
 * Import your plugin and register it here.
 */

registerPlugin(seoOptimizerPlugin);

console.log('[Plugins] All plugins loaded and registered.');
