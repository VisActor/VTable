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
      '---',
      { text: 'Body cell item', menuKey: 'body_cell_item' }
    ],
    canvasMenuItems: [
      { text: 'Canvas blank area', menuKey: 'canvas_blank_area' },
      { text: 'Canvas menu item', menuKey: 'canvas_menu_item' }
    ],
    beforeShowAdjustMenuItems: (menuItems, _table, col, row) => {
      if (col === -1 && row === -1) {
        return [
          ...menuItems,
          {
            text: `Blank canvas: col ${col}, row ${row}`,
            menuKey: 'canvas_position'
          }
        ];
      }
      return menuItems.filter(item => item !== '---');
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

export function createTable() {
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.width = '100%';
  container.style.height = '420px';
  document.body.appendChild(container);

  const info = document.createElement('div');
  info.style.margin = '10px';
  info.style.padding = '10px';
  info.style.border = '1px solid #ddd';
  info.style.borderRadius = '4px';
  info.style.backgroundColor = '#f9f9f9';
  info.innerHTML = `
    <h3>Issue 5215: Canvas context menu</h3>
    <p>Right-click the blank canvas area outside the table cells. The context menu should show canvas-specific items.</p>
    <p>Right-click body cells to verify cell menu items are still independent from blank canvas menu items.</p>
  `;

  document.body.insertBefore(info, container);
  return createTableInstance();
}
