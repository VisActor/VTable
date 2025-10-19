import type { ListTable, BaseTableAPI, pluginsDefinition } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
export type IPasteAddRowColumnPluginOptions = {
  id?: string;
  addRowCallback?: (addedRow: number, table: ListTable) => void;
  addColumnCallback?: (addedCount: number, table: ListTable) => void;
};

export class PasteAddRowColumnPlugin implements pluginsDefinition.IVTablePlugin {
  id = `paste-add-row-column`;
  name = 'Paste Add row';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED, TABLE_EVENT_TYPE.PASTED_DATA];
  table: ListTable;
  pluginOptions: IPasteAddRowColumnPluginOptions;
  pastedData: any;
  constructor(pluginOptions?: IPasteAddRowColumnPluginOptions) {
    this.pluginOptions = pluginOptions;
    this.id = pluginOptions?.id ?? this.id;
  }
  run(...args: any[]) {
    const runtime = args[1];
    const table: BaseTableAPI = args[2];
    this.table = table as ListTable;
    if (runtime === TABLE_EVENT_TYPE.PASTED_DATA) {
      this.pastedData = args[0];
      this.handlePaste();
    }
  }

  handlePaste() {
    const { pasteData, row, col } = this.pastedData;
    const rowCount = this.table.rowCount;
    const colCount = this.table.colCount;

    const pastedRowCount = pasteData.length;
    const pastedColCount = pasteData[0]?.length || 0;

    const rowsNeeded = row + pastedRowCount - rowCount;
    const colsNeeded = col + pastedColCount - colCount;

    // 扩展行
    if (rowsNeeded > 0) {
      for (let i = 0; i < rowsNeeded; i++) {
        if (this.pluginOptions?.addRowCallback) {
          this.pluginOptions.addRowCallback(rowCount + i, this.table);
        } else {
          this.table.addRecord([]);
        }
      }
    }

    // 扩展列
    if (colsNeeded > 0) {
      for (let i = 0; i < colsNeeded; i++) {
        const newColIndex = colCount + i;
        if (this.pluginOptions?.addColumnCallback) {
          this.pluginOptions.addColumnCallback(newColIndex, this.table);
        } else {
          this.table.addColumns([
            {
              field: `field_${newColIndex}`,
              title: `New Column ${newColIndex}`,
              width: 100
            }
          ]);
        }
      }
    }

    // 最后统一写入数据
    this.table.changeCellValues(col, row, pasteData, true);
  }

  release() {
    this.table.internalProps.handler.clear();
  }
}
