import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '../../src/context-menu';

const CONTAINER_ID = 'vTable';

export function createTableInstance() {
  const records = [
    { id: 1, name: 'alpha', value: 12 },
    { id: 2, name: 'beta', value: 34 }
  ];

  const plugin = new ContextMenuPlugin({
    contextMenuWorkOnlyCell: false,
    bodyCellMenuItems: [
      { text: 'Copy from plugin', menuKey: 'copy' },
      { text: 'Canvas menu item', menuKey: 'canvas_menu_item' }
    ],
    beforeShowAdjustMenuItems: (menuItems, _table, col, row) => {
      if (col === -1 && row === -1) {
        return [{ text: 'Canvas blank area', menuKey: 'canvas_blank_area' }, ...menuItems];
      }
      return menuItems;
    }
  });

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns: [
      { field: 'id', title: 'ID', width: 100 },
      { field: 'name', title: 'Name', width: 160 },
      { field: 'value', title: 'Value', width: 120 }
    ],
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 40,
    widthMode: 'standard',
    heightMode: 'standard',
    plugins: [plugin]
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
  return tableInstance;
}
