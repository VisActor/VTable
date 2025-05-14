import * as VTable from '@visactor/vtable';
export type IPasteAddRowPluginOptions = {};

export class PasteAddRowPlugin implements VTable.plugins.IVTablePlugin {
  id = `paste-add-row-${Date.now()}`;
  name = 'Paste Add row';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.COPY_DATA];
  table: VTable.ListTable;
  pluginOptions: IPasteAddRowPluginOptions;
  copyData: any;
  constructor(pluginOptions?: IPasteAddRowPluginOptions) {
    this.pluginOptions = pluginOptions;

    this.bindEvent();
  }
  run(...args: any[]) {
    const runtime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    if (runtime === VTable.TABLE_EVENT_TYPE.COPY_DATA) {
      this.copyData = args[0].copyData;
    }
  }

  bindEvent() {
    //监听document全局的keydown事件 捕获阶段监听 可以及时阻止事件传播和默认行为
    document.addEventListener('keydown', this.handlePaste.bind(this), true);
  }

  handlePaste(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      // 当前选中的信息
      const selection = this.table.stateManager.select;
      const { ranges } = selection;
      // 读取已复制内容
      const _copyData = this.copyData;
      // 将数据拆分为行
      const rows = _copyData?.split('\n') || [];
      // 复用container-dom文件中的paste事件的转换rows逻辑(line: 342)
      const values: (string | number)[][] = [];
      rows.forEach(function (rowCells: any, rowIndex: number) {
        const cells = rowCells.split('\t'); // 将行数据拆分为单元格
        const rowValues: (string | number)[] = [];
        values.push(rowValues);
        cells.forEach(function (cell: string, cellIndex: number) {
          // 去掉单元格数据末尾的 '\r'
          if (cellIndex === cells.length - 1) {
            cell = cell.trim();
          }
          rowValues.push(cell);
        });
      });
      // 处理粘贴行为
      // 1. 没有选中单元格
      if (ranges.length === 0) {
        // 直接添加行
        this.table.addRecords(values);
        return;
      }
      // 2. 选中单元格
      // 超出行数
      let overRowCount = values.length - (this.table.rowCount - ranges[0].start.row - 1) - 1;
      if (overRowCount > 0) {
        const shiftCount = values.length - overRowCount;
        // 出队
        for (let i = 0; i < shiftCount; i++) {
          overRowCount--;
        }
        // 先添加空行，再覆写数据，保证正确的插入行为
        for (let i = 0; i < values.length - 1; i++) {
          this.table.addRecord([]);
        }
        this.table.changeCellValues(ranges[0].start.col, ranges[0].start.row, values, true);
      }
      // 如果选择插入的行不是最后一行，则执行正常的paste操作
      if (!(ranges[0].start.row === this.table.rowCount - 1) && overRowCount <= 0) {
        this.table.internalProps.handler.fire(this.table.getElement(), 'paste');
      }
    }
  }

  release() {
    document.removeEventListener('keydown', this.handlePaste, true);
  }
}
