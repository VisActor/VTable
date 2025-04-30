import * as VTable from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface ColumnSeriesOptions {
  columnCount: number;
  generateColumnTitle?: (index: number) => string;
  generateColumnField?: (index: number) => string;
  /**
   * 是否自动扩展列, 配置监听键值（键盘事件的key）
   * @default true
   */
  autoExtendColumnTriggerKeys?: ('ArrowRight' | 'Tab')[];
}
/**
 * 生成列序号标题的插件
 */
export class ColumnSeriesPlugin implements VTable.plugins.IVTablePlugin {
  id = `column-series-${Date.now()}`;
  name = 'Column Series';
  runTime = [VTable.TABLE_EVENT_TYPE.BEFORE_INIT, VTable.TABLE_EVENT_TYPE.BEFORE_KEYDOWN];
  pluginOptions: ColumnSeriesOptions;
  table: VTable.ListTable;
  columns: { field?: string; title: string }[] = [];
  constructor(pluginOptions: ColumnSeriesOptions) {
    this.pluginOptions = Object.assign({ columnCount: 100 }, pluginOptions);
  }
  run(...args: any[]) {
    if (args[1] === VTable.TABLE_EVENT_TYPE.BEFORE_INIT) {
      const eventArgs = args[0];
      const table: VTable.BaseTableAPI = args[2];
      this.table = table as VTable.ListTable;
      const options = eventArgs.options;
      //根据pluginOptions的columnCount组织columns，column的title生成规则和excel一致，如A~Z,AA~AZ,AB~AZ,AA~ZZ,AAA~ZZZ
      this.columns = this.generateColumns(this.pluginOptions.columnCount);
      options.columns = this.columns;
    } else if (args[1] === VTable.TABLE_EVENT_TYPE.BEFORE_KEYDOWN) {
      const eventArgs = args[0];
      const e = eventArgs.event;
      if (this.pluginOptions.autoExtendColumnTriggerKeys?.includes(e.key)) {
        if (this.table.stateManager.select.cellPos.col === this.table.colCount - 1) {
          this.table.addColumn(this.generateColumn(this.table.colCount - 1) as VTable.ColumnDefine);
        }
      }
    }
  }
  /**
   * 生成列字段和标题
   * 规则和excel一致，如A~Z,AA~AZ,AB~AZ,AA~ZZ,AAA~ZZZ
   * @param columnCount 列数
   * @returns 列字段和标题的数组
   */
  generateColumns(columnCount: number): { field?: string; title: string }[] {
    const columnFields = [];
    for (let i = 0; i < columnCount; i++) {
      columnFields.push(this.generateColumn(i));
    }
    return columnFields;
  }
  generateColumn(index: number): { field?: string; title: string } {
    const column = {
      // field: this.pluginOptions.generateColumnField
      //   ? this.pluginOptions.generateColumnField(i)
      //   : this.generateColumnField(i),
      title: this.pluginOptions.generateColumnTitle
        ? this.pluginOptions.generateColumnTitle(index)
        : this.generateColumnField(index)
    };
    return column;
  }
  /**
   * 生成excel的列标题，规则和excel一致，如A~Z,AA~AZ,AB~AZ,AA~ZZ,AAA~ZZZ
   * @param index 从0开始
   * @returns
   */
  generateColumnField(index: number): string {
    // 处理0-25的情况（A-Z）
    if (index < 26) {
      return String.fromCharCode(65 + index);
    }

    const title = [];
    index++; // 调整索引，使得第一个26变成AA

    while (index > 0) {
      index--; // 每次循环前减1，以正确处理进位
      title.unshift(String.fromCharCode(65 + (index % 26)));
      index = Math.floor(index / 26);
    }

    return title.join('');
  }

  resetColumnCount(columnCount: number) {
    this.pluginOptions.columnCount = columnCount;
    this.columns = this.generateColumns(columnCount);
    this.table.updateColumns(this.columns as VTable.ColumnsDefine);
  }
}
