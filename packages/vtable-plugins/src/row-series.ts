import * as VTable from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface RowSeriesOptions {
  rowCount: number;
  fillRowRecord?: (index: number) => any;
  rowSeriesNumber?: VTable.TYPES.IRowSeriesNumber;
}
/**
 * 生成行序号标题的插件
 */
export class RowSeriesPlugin implements VTable.plugins.IVTablePlugin {
  id = 'row-series';
  runTime = [VTable.TABLE_EVENT_TYPE.BEFORE_INIT];
  pluginOptions: RowSeriesOptions;
  table: VTable.ListTable;

  constructor(pluginOptions: RowSeriesOptions = { rowCount: 100 }) {
    this.pluginOptions = pluginOptions;
  }
  run(...args: any[]) {
    const eventArgs = args[0];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    const options: VTable.ListTableConstructorOptions = eventArgs.options;
    const records = options.records ?? [];
    //用空数据将records填充到pluginOptions.rowCount
    for (let i = records.length; i < this.pluginOptions.rowCount; i++) {
      records.push(this.pluginOptions.fillRowRecord ? this.pluginOptions.fillRowRecord(i) : {});
    }
    options.records = records;
    if (this.pluginOptions.rowSeriesNumber) {
      options.rowSeriesNumber = this.pluginOptions.rowSeriesNumber;
      if (!this.pluginOptions.rowSeriesNumber.width) {
        options.rowSeriesNumber.width = 'auto';
      }
    } else if (!options.rowSeriesNumber) {
      options.rowSeriesNumber = {
        width: 'auto'
      };
    }
  }
}
