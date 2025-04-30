import type { TableEvents } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI, BaseTableConstructorOptions } from '../ts-types/base-table';
import type { IVTablePlugin } from './interface';

export class PluginManager {
  private plugins: Map<string, IVTablePlugin> = new Map();
  private table: BaseTableAPI;

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

  _bindTableEventForPlugin(plugin: IVTablePlugin) {
    plugin.runTime?.forEach(runTime => {
      this.table.on(runTime, (...args) => {
        plugin.run?.(...args, runTime, this.table);
      });
    });
  }

  // 更新所有插件
  updatePlugins(plugins?: IVTablePlugin[]): void {
    // 先找到plugins中没有，但this.plugins中有，也就是已经被移除的插件
    const removedPlugins = Array.from(this.plugins.values()).filter(plugin => !plugins?.some(p => p.id === plugin.id));
    removedPlugins.forEach(plugin => {
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
