import type { pluginsDefinition, ListTable, BaseTableAPI } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import { AutoFillManager } from './auto-fill-manager';
export * from './formula-integration';
export * from './types';
export * from './rules';
/**
 * 自动填充插件
 */
export interface IAutoFillPluginOptions {
  /**
   * 填充模式
   * 'copy': 复制填充
   * 'series': 序列填充
   * 不填写则开启自动填充菜单
   */
  fillMode?: 'copy' | 'series';
  /**
   * 快速填充模式
   * 'copy': 复制填充
   * 'series': 序列填充
   * 不填写则开启自动填充菜单
   */
  fastFillMode?: 'copy' | 'series';
  /**
   * 自定义公式检测函数
   * 用于判断单元格是否包含公式
   * @param col 列索引
   * @param row 行索引
   * @param cellData 单元格数据
   * @param table 表格实例
   * @returns 是否为公式
   */
  isFormulaCell?: (col: number, row: number, cellData: any, table: ListTable) => boolean;
  /**
   * 自定义公式获取函数
   * 用于获取单元格的公式字符串
   * @param col 列索引
   * @param row 行索引
   * @param cellData 单元格数据
   * @param table 表格实例
   * @returns 公式字符串，如果没有公式则返回undefined
   */
  getCellFormula?: (col: number, row: number, cellData: any, table: ListTable) => string | undefined;
  /**
   * 自定义公式设置函数
   * 用于设置单元格的公式
   * @param col 列索引
   * @param row 行索引
   * @param formula 公式字符串
   * @param table 表格实例
   */
  setCellFormula?: (col: number, row: number, formula: string, table: ListTable) => void;
}

export class AutoFillPlugin implements pluginsDefinition.IVTablePlugin {
  id = `auto-fill`;
  name = 'Auto Fill';
  runTime = [
    TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE,
    TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END,
    TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE
  ];
  table: ListTable;
  private autoFillManager: AutoFillManager;
  constructor(options?: IAutoFillPluginOptions) {
    this.autoFillManager = new AutoFillManager(options);
  }
  run(
    ...args: [{ direction: string }, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], BaseTableAPI]
  ) {
    // start drag
    if (args[1] === TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE) {
      const [, , table] = args;
      this.table = table as ListTable;
      this.autoFillManager.setTable(this.table);
      this.autoFillManager.handleStartDrag(this.table?.getSelectedCellRanges()[0]);
    } else if (args[1] === TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END) {
      // end drag
      const [{ direction }] = args;
      this.autoFillManager.handleEndDrag(this.table?.getSelectedCellRanges()[0], direction);
    } else if (args[1] === TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE) {
      this.autoFillManager.handleDbClick();
    }
  }
}
