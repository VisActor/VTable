import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TYPES, BaseTableAPI, ListTable, ListTableConstructorOptions, plugins } from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface RowSeriesOptions {
  id?: string;
  rowCount: number;
  fillRowRecord?: (index: number) => any;
  rowSeriesNumber?: TYPES.IRowSeriesNumber;
  /**
   * 是否自动扩展行
   * @default true
   */
  autoExtendRowTriggerKeys?: ('ArrowDown' | 'Enter')[];
}
/**
 * 生成行序号标题的插件
 */
export class RowSeriesPlugin implements plugins.IVTablePlugin {
  id = `row-series`;
  name = 'Row Series';
  runTime = [TABLE_EVENT_TYPE.BEFORE_INIT, TABLE_EVENT_TYPE.BEFORE_KEYDOWN];
  pluginOptions: RowSeriesOptions;
  table: ListTable;

  constructor(pluginOptions: RowSeriesOptions) {
    this.id = pluginOptions.id ?? this.id;
    this.pluginOptions = Object.assign({ rowCount: 100 }, pluginOptions);
  }
  run(...args: any[]) {
    if (args[1] === TABLE_EVENT_TYPE.BEFORE_INIT) {
      const eventArgs = args[0];
      const table: BaseTableAPI = args[2];
      this.table = table as ListTable;
      const options: ListTableConstructorOptions = eventArgs.options;
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
    } else if (args[1] === TABLE_EVENT_TYPE.BEFORE_KEYDOWN) {
      const eventArgs = args[0];

      const e = eventArgs.event;

      if (
        this.pluginOptions.autoExtendRowTriggerKeys?.includes(e.key) &&
        this.table.stateManager.select.cellPos.row === this.table.rowCount - 1
      ) {
        (this.table as ListTable).addRecord(
          this.pluginOptions.fillRowRecord
            ? this.pluginOptions.fillRowRecord(this.table.rowCount - this.table.columnHeaderLevelCount)
            : {}
        );
      }
    }
  }
}
