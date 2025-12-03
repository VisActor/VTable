import type { TableEvents } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI, BaseTableConstructorOptions } from '../ts-types/base-table';
import type { IVTablePlugin } from './interface';

export class PluginManager {
  private plugins: Map<string, IVTablePlugin> = new Map();
  private table: BaseTableAPI;

  private pluginEventMap: Map<string, number[]> = new Map();

  constructor(table: BaseTableAPI, options: BaseTableConstructorOptions) {
    this.table = table;
    options.plugins?.map(plugin => {
      this.register(plugin);
      this._bindTableEventForPlugin(plugin);
    });
  }

  // 注册插件
  register(plugin: IVTablePlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  // 注册多个插件
  registerAll(plugins: IVTablePlugin[]): void {
    plugins.forEach(plugin => this.register(plugin));
  }

  // 获取插件
  getPlugin(id: string): IVTablePlugin | undefined {
    return this.plugins.get(id);
  }
  getPluginByName(name: string): IVTablePlugin | undefined {
    return Array.from(this.plugins.values()).find(plugin => plugin.name === name);
  }

  _bindTableEventForPlugin(plugin: IVTablePlugin) {
    plugin.runTime?.forEach(runTime => {
      const id = this.table.on(runTime, (...args) => {
        plugin.run?.(...args, runTime, this.table);
      });
      this.pluginEventMap.set(plugin.id, [...(this.pluginEventMap.get(plugin.id) || []), id]);
    });
  }

  // 更新所有插件
  updatePlugins(plugins?: IVTablePlugin[]): void {
    // 先找到plugins中没有，但this.plugins中有，也就是已经被移除的插件
    const removedPlugins = Array.from(this.plugins.values()).filter(plugin => !plugins?.some(p => p.id === plugin.id));
    removedPlugins.forEach(plugin => {
      this.pluginEventMap.get(plugin.id)?.forEach(id => {
        this.table.off(id);
      });
      this.release();
      this.plugins.delete(plugin.id);
    });
    // 更新插件
    this.plugins.forEach(plugin => {
      if (plugin.update) {
        plugin.update();
      }
    });
    // 添加新插件
    const addedPlugins = plugins?.filter(plugin => !this.plugins.has(plugin.id));
    addedPlugins?.forEach(plugin => {
      this.register(plugin);
      this._bindTableEventForPlugin(plugin);
    });
  }
  release() {
    this.plugins.forEach(plugin => {
      plugin.release?.(this.table);
    });
  }
}
