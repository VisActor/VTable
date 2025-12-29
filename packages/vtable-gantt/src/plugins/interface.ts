import type { EVENT_TYPES } from '../ts-types/EVENT_TYPE';
import type { Gantt } from '../Gantt';

// 插件生命周期接口
export interface IGanttPlugin {
  // 插件唯一标识
  id: string;
  // 插件名称
  name: string;
  // // 插件优先级，数字越小优先级越高  TODO：目前还没起作用，后续是否有安排插件优先级的需求
  // priority?: number;

  // // 插件类型，用于区分不同功能的插件
  // type: 'layout' | 'interaction' | 'style' | 'animation';
  // 插件运行时机
  runTime?: EVENT_TYPES[keyof EVENT_TYPES][];
  // // 插件依赖
  // dependencies?: string[];
  // 初始化方法，在Gantt实例创建后、首次渲染前调用
  run: (...args: any[]) => void;
  // 更新方法，当Gantt数据或配置更新时调用
  update?: () => void;
  // 销毁方法，在Gantt实例销毁前调用
  release?: (gantt: Gantt) => void;
}
