import type { Gantt } from '../Gantt'; // Adjust path as needed
import type { IGanttPlugin } from './interface'; // Adjust path as needed
import type { GanttConstructorOptions } from '../ts-types/gantt-engine'; // Adjust path as needed

export class PluginManager {
  private plugins: Map<string, IGanttPlugin> = new Map();
  private gantt: Gantt;

  constructor(gantt: Gantt, options: GanttConstructorOptions) {
    this.gantt = gantt;
    options.plugins?.forEach(plugin => {
      this.register(plugin);
      this._initializePluginRun(plugin);
    });
  }

  private _initializePluginRun(plugin: IGanttPlugin): void {
    // 检查 runTime 是否存在
    if (plugin.runTime === undefined) {
      try {
        plugin.run(this.gantt);
      } catch (error) {
        console.error(`Error executing run for plugin ${plugin.name}:`, error);
      }
    } else {
      this._bindGanttEventForPlugin(plugin);
    }
  }

  // 注册插件
  register(plugin: IGanttPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  // 注册多个插件
  registerAll(plugins: IGanttPlugin[]): void {
    plugins.forEach(plugin => this.register(plugin));
  }

  // 获取插件
  getPlugin(id: string): IGanttPlugin | undefined {
    return this.plugins.get(id);
  }
  getPluginByName(name: string): IGanttPlugin | undefined {
    return Array.from(this.plugins.values()).find(plugin => plugin.name === name);
  }

  // 内部方法：只负责绑定事件，不负责立即执行逻辑
  private _bindGanttEventForPlugin(plugin: IGanttPlugin) {
    if (plugin.runTime) {
      plugin.runTime.forEach(runTime => {
        this.gantt.on(runTime, (...args: any[]) => {
          try {
            plugin.run?.(...args, runTime, this.gantt);
          } catch (error) {
            console.error(`Error executing plugin ${plugin.name} on event ${String(runTime)}:`, error);
          }
        });
      });
    }
  }

  // 更新所有插件
  updatePlugins(plugins?: IGanttPlugin[]): void {
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
      this._initializePluginRun(plugin);
    });
  }

  release() {
    this.plugins.forEach(plugin => {
      try {
        plugin.release?.(this.gantt);
      } catch (error) {
        console.error(`Error releasing plugin ${plugin.name}:`, error);
      }
    });
  }
}
