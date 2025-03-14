import * as VTable from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface ColumnSeriesOptions {
  columnCount: number;
  generateColumnTitle?: (index: number) => string;
  generateColumnField?: (index: number) => string;
}
/**
 * 生成列序号标题的插件
 */
export class ColumnSeriesPlugin implements VTable.plugins.IVTablePlugin {
  id = 'column-series';
  name = 'Column-Series';
  type: 'layout' = 'layout';
  runTime = [VTable.TABLE_EVENT_TYPE.BEFORE_INIT];
  pluginOptions: ColumnSeriesOptions;
  table: VTable.ListTable;
  columns: { field: string; title: string }[] = [];
  constructor(pluginOptions: ColumnSeriesOptions = { columnCount: 100 }) {
    this.pluginOptions = pluginOptions;
  }
  run(...args: any[]) {
    const eventArgs = args[0];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    const options = eventArgs.options;
    //根据pluginOptions的columnCount组织columns，column的title生成规则和excel一致，如A~Z,AA~AZ,AB~AZ,AA~ZZ,AAA~ZZZ
    this.columns = this.generateColumnFields(this.pluginOptions.columnCount);
    options.columns = this.columns;
  }
  generateColumnFields(columnCount: number): { field: string; title: string }[] {
    const columnFields = [];
    for (let i = 0; i < columnCount; i++) {
      const column = {
        field: this.pluginOptions.generateColumnField
          ? this.pluginOptions.generateColumnField(i)
          : this.generateColumnField(i),
        title: this.pluginOptions.generateColumnTitle
          ? this.pluginOptions.generateColumnTitle(i)
          : this.generateColumnField(i)
      };
      columnFields.push(column);
    }
    return columnFields;
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
    this.columns = this.generateColumnFields(columnCount);
    this.table.updateColumns(this.columns);
  }
}
