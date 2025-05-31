import * as VTable from '@visactor/vtable';
export type IPasteAddRowPluginOptions = {
  addRowCallback?: (addedRow: number, table: VTable.ListTable) => void;
  addColumnCallback?: (addedCount: number, table: VTable.ListTable) => void;
};

export class PasteAddRowPlugin implements VTable.plugins.IVTablePlugin {
  id = `paste-add-row-${Date.now()}`;
  name = 'Paste Add row';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.PASTED_DATA];
  table: VTable.ListTable;
  pluginOptions: IPasteAddRowPluginOptions;
  pastedData: any;
  constructor(pluginOptions?: IPasteAddRowPluginOptions) {
    this.pluginOptions = pluginOptions;
  }
  run(...args: any[]) {
    const runtime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    if (runtime === VTable.TABLE_EVENT_TYPE.PASTED_DATA) {
      this.pastedData = args[0];
      this.handlePaste();
    }
  }

  /**
   * @param needed 需要增加的列或行数量
   * @param currentCount 当前行、列的总数量
   * @param addFunction 添加行或列回调
   * @returns
   */
  private handleDimensionExpansion(needed: number, currentCount: number, addFunction: () => void) {
    if (needed > 0) {
      Array.from({ length: needed }).forEach(() => addFunction());
      return true;
    }
    return false;
  }

  handlePaste() {
    const { pasteData, row, col } = this.pastedData;
    const maxRowIndex = this.table.rowCount - 1;
    const maxColIndex = this.table.colCount - 1;

    // 处理行扩展
    const rowsNeeded = pasteData.length - (maxRowIndex - row) - 1;
    this.handleDimensionExpansion(rowsNeeded, this.table.rowCount, () => {
      if (this.pluginOptions?.addRowCallback) {
        this.pluginOptions.addRowCallback(row, this.table);
      } else {
        this.table.addRecord([]);
      }
    });

    // 处理列扩展
    const colsNeeded = pasteData[0]?.length - (maxColIndex - col) - 1;
    this.handleDimensionExpansion(colsNeeded, this.table.colCount, () => {
      if (this.pluginOptions?.addColumnCallback) {
        this.pluginOptions.addColumnCallback(col, this.table);
      } else {
        this.table.addColumn({ field: ``, title: `New Column ${col}`, width: 100 });
      }
    });

    // 统一更新单元格
    // 优化后的边界判断
    const isLastRow = row === maxRowIndex;
    const isLastCol = col === maxColIndex;

    if ((!isLastRow && rowsNeeded <= 0) || (!isLastCol && colsNeeded <= 0)) {
      this.table.changeCellValues(col, row, pasteData, true);
    }
  }

  release() {
    this.table.internalProps.handler.clear();
  }
}
