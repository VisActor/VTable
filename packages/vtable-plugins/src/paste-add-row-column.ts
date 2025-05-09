import * as VTable from '@visactor/vtable';
//备用 插件配置项 目前感觉都走默认逻辑就行
export type IPasteAddRowColumnPluginOptions = {};

export class PasteAddRowColumn implements VTable.plugins.IVTablePlugin {
  id = `paste-add-row-column-${Date.now()}`;
  name = 'Paste Add row column';
  runTime = [
    VTable.TABLE_EVENT_TYPE.INITIALIZED,
    VTable.TABLE_EVENT_TYPE.MOUSEENTER_CELL,
    VTable.TABLE_EVENT_TYPE.CLICK_CELL
  ];
  table: VTable.ListTable;
  pluginOptions: IPasteAddRowColumnPluginOptions;
  hoverCell: VTable.TYPES.CellAddressWithBound;
  constructor(pluginOptions?: IPasteAddRowColumnPluginOptions) {
    this.pluginOptions = pluginOptions;

    this.bindEvent();
  }
  run(...args: any[]) {
    const eventArgs = args[0];
    const runTime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    if (runTime === VTable.TABLE_EVENT_TYPE.MOUSEENTER_CELL || runTime === VTable.TABLE_EVENT_TYPE.CLICK_CELL) {
      const canvasBounds = table.canvas.getBoundingClientRect();
      const cell = table.getCellAtRelativePosition(
        eventArgs.event.clientX - canvasBounds.left,
        eventArgs.event.clientY - canvasBounds.top
      );
      this.hoverCell = cell;
    }
  }

  bindEvent() {
    //监听document全局的keydown事件 捕获阶段监听 可以及时阻止事件传播和默认行为
    document.addEventListener('keydown', this.handlePaste.bind(this), true);
  }

  async handlePaste(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      if (!navigator.clipboard) {
        throw new Error('clipboard is not defined, please check your browser support for Clipboard API');
      }
      // 读取剪贴板内容
      const text = await navigator.clipboard.readText();
      // 解析剪贴板内容为表格数据
      const rows = text.trim().split('\n');
      const tableData = rows.map(row => row.split('\t'));
      const structuredData = this.convertTableToObjects(this.removeIndexColumn(tableData));
      // 插入表格数据到VTable中
      const { row } = this.hoverCell;
      const addRowIndex = row + 1;
      const recordIndex = this.table.getRecordIndexByCell(0, addRowIndex);
      for (let i = 0; i < structuredData.length; i++) {
        this.table.addRecord(structuredData[i], recordIndex);
      }
    }
  }
  convertTableToObjects(tableData: string[][]) {
    if (!tableData || tableData.length < 2) {
      return [];
    }

    const headers = this.table.columns.map(item => item.field) as string[]; // 根据columns进行转换
    return tableData.map(row => {
      const obj: any = {};
      headers.forEach((key: string, index: number) => {
        obj[key] = row[index] ?? ''; // 防止缺值
      });
      return obj;
    });
  }

  removeIndexColumn(tableData: string[][]): string[][] {
    return tableData.map(row => row.slice(1)); // 去除每行的第一列（索引列）
  }

  release() {
    document.removeEventListener('keydown', this.handlePaste, true);
  }
}
