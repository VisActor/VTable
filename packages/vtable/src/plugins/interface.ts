import type { TableEvents } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';

// 插件生命周期接口
export interface IVTablePlugin {
  // 插件唯一标识
  id: string;
  // // 插件优先级，数字越小优先级越高  TODO：目前还没起作用，后续是否有安排插件优先级的需求
  // priority?: number;

  // // 插件类型，用于区分不同功能的插件
  // type: 'layout' | 'interaction' | 'style' | 'animation';
  // 插件运行时机
  runTime: TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][];
  // // 插件依赖
  // dependencies?: string[];
  // 初始化方法，在VTable实例创建后、首次渲染前调用
  run: (...args: any[]) => void;
  // 更新方法，当表格数据或配置更新时调用
  update?: (table: BaseTableAPI, options?: any) => void;
  // 销毁方法，在VTable实例销毁前调用
  release?: (table: BaseTableAPI) => void;
}
