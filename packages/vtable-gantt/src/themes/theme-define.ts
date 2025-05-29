// vtable-gantt/src/themes/theme-define.ts
// 主题 TableTheme 实现，兼容 vtable 主题合并机制
import { ingoreNoneValueMerge } from '../tools/helper';

// 主题类型定义（可根据实际需要扩展）
export type RequiredTableThemeDefine = {
  grid: any;
  rowSeriesNumber: any;
  taskBar: any;
  timelineHeader: any;
  // ...可继续扩展其他主题字段
};

export class TableTheme {
  internalTheme: { obj: any; superTheme: any };
  name: string = '';
  constructor(obj: any, superTheme: any) {
    this.internalTheme = { obj: obj || {}, superTheme: superTheme || {} };
    this.name = obj?.name || superTheme?.name || '';
  }

  get grid(): RequiredTableThemeDefine['grid'] {
    const { obj, superTheme } = this.internalTheme;
    return ingoreNoneValueMerge({}, superTheme.grid, obj.grid);
  }

  get rowSeriesNumber(): RequiredTableThemeDefine['rowSeriesNumber'] {
    const { obj, superTheme } = this.internalTheme;
    return ingoreNoneValueMerge({}, superTheme.rowSeriesNumber, obj.rowSeriesNumber);
  }

  get taskBar(): RequiredTableThemeDefine['taskBar'] {
    const { obj, superTheme } = this.internalTheme;
    return ingoreNoneValueMerge({}, superTheme.taskBar, obj.taskBar);
  }

  get timelineHeader(): RequiredTableThemeDefine['timelineHeader'] {
    const { obj, superTheme } = this.internalTheme;
    return ingoreNoneValueMerge({}, superTheme.timelineHeader, obj.timelineHeader);
  }
  // ...可继续扩展其他 getter
}

export default TableTheme;
