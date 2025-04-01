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
    });
    this.initPlugins(table);
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

  initPlugins(table: BaseTableAPI) {
    this.plugins.forEach(plugin => {
      if (Array.isArray(plugin.runTime)) {
        plugin.runTime.forEach(runTime => {
          table.on(runTime, (...args) => {
            plugin.run?.(...args, runTime, table);
          });
        });
      } else {
        table.on(plugin.runTime, (...args) => {
          plugin.run?.(table, ...args, plugin.runTime as TableEvents[keyof TableEvents]);
        });
      }
    });
  }

  // 更新所有插件
  updatePlugins(): void {
    this.plugins.forEach(plugin => {
      if (plugin.update) {
        plugin.update(this.table);
      }
    });
  }
  release() {
    this.plugins.forEach(plugin => {
      plugin.release?.(this.table);
    });
  }
}
