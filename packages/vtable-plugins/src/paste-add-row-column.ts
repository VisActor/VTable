import * as VTable from '@visactor/vtable';
export type IPasteAddRowColumnPluginOptions = {
  addRowCallback?: (addedRow: number, table: VTable.ListTable) => void;
  addColumnCallback?: (addedCount: number, table: VTable.ListTable) => void;
};

export class PasteAddRowColumnPlugin implements VTable.plugins.IVTablePlugin {
  id = `paste-add-row-${Date.now()}`;
  name = 'Paste Add row';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.PASTED_DATA];
  table: VTable.ListTable;
  pluginOptions: IPasteAddRowColumnPluginOptions;
  pastedData: any;
  constructor(pluginOptions?: IPasteAddRowColumnPluginOptions) {
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
   * @param updateValue 更新数据
   * @returns
   */
  private handleDimensionExpansion(
    needed: number,
    currentCount: number,
    addFunction: () => void,
    updateValue: () => void
  ) {
    if (needed > 0) {
      Array.from({ length: needed }).forEach(() => {
        addFunction();
      });
      updateValue();
      return true;
    }
    return false;
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
          this.table.addRecord({});
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
          this.table.addColumn({
            field: `field_${newColIndex}`,
            title: `New Column ${newColIndex}`,
            width: 100
          });
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
