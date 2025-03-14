import * as VTable from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface RowSeriesOptions {
  rowCount: number;
  generateRowTitle?: (index: number) => string;
}
/**
 * 生成行序号标题的插件
 */
export class RowSeriesPlugin implements VTable.plugins.IVTablePlugin {
  id = 'row-series';
  name = 'Row-Series';
  type: 'layout' = 'layout';
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
      records.push({});
    }
    options.records = records;
    if (!options.rowSeriesNumber) {
      options.rowSeriesNumber = {
        width: 'auto'
      };
    }
  }
}
