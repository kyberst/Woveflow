import { Plugin, BuilderElementNode, HookContext } from '../types';

// Central registry for all plugins
const plugins: Plugin[] = [];

/**
 * Registers a new plugin, making its hooks available to the editor.
 * @param plugin The plugin object to register.
 */
export const registerPlugin = (plugin: Plugin) => {
  console.log(`[PluginService] Registering plugin: ${plugin.name}`);
  plugins.push(plugin);
};

/**
 * Unregisters a plugin by its name.
 * @param pluginName The name of the plugin to unregister.
 */
export const unregisterPlugin = (pluginName: string) => {
  const index = plugins.findIndex(p => p.name === pluginName);
  if (index > -1) {
    plugins.splice(index, 1);
    console.log(`[PluginService] Unregistered plugin: ${pluginName}`);
  }
};

/**
 * Runs a specific hook across all registered plugins that implement it.
 * The hooks are run in a middleware-style chain, where the output of one
 * hook becomes the input for the next.
 * 
 * @param hookName The name of the hook to run (e.g., 'onPublish').
 * @param initialValue The initial value to pass to the first plugin in the chain.
 * @param context Additional context to pass to the hook.
 * @returns The final value after being processed by all relevant plugins.
 */
export const runHook = async <T>(
  hookName: keyof Plugin,
  initialValue: T,
  context: HookContext
): Promise<T> => {
  let value = initialValue;
  for (const plugin of plugins) {
    const hook = plugin[hookName];
    if (typeof hook === 'function') {
      try {
        console.log(`[PluginService] Running hook '${hookName}' for plugin: ${plugin.name}`);
        // The type assertion is necessary because TypeScript can't guarantee
        // the function signature matches across different hook names.
        value = await (hook as (val: T, ctx: HookContext) => Promise<T>)(value, context);
      } catch (error) {
        console.error(`[PluginService] Error in plugin '${plugin.name}' during hook '${hookName}':`, error);
        // Continue with the last valid value, skipping the failing plugin.
      }
    }
  }
  return value;
};
