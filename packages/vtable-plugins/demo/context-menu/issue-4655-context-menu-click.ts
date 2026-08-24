import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '../../src/context-menu';

const CONTAINER_ID = 'vTable';
const INFO_ID = 'context-menu-click-info';
const STATUS_ID = 'context-menu-click-status';

function createRecords() {
  return Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `name-${index + 1}`,
    city: ['Beijing', 'Shanghai', 'Shenzhen'][index % 3],
    value: Math.round((index + 1) * 12.6)
  }));
}

function updateStatus(table: VTable.ListTable, status: HTMLElement, eventArgs?: any) {
  const lines = [
    `frozenRowCount: ${table.frozenRowCount}`,
    `frozenColCount: ${table.frozenColCount}`,
    eventArgs
      ? `last context_menu_click: ${JSON.stringify(eventArgs.contextMenu)}`
      : 'last context_menu_click: waiting for menu click'
  ];
  status.textContent = lines.join('\n');
}

export function createTableInstance(status: HTMLElement) {
  const plugin = new ContextMenuPlugin();
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records: createRecords(),
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: 'Name', width: 160 },
      { field: 'city', title: 'City', width: 160 },
      { field: 'value', title: 'Value', width: 120 }
    ],
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 40,
    widthMode: 'standard',
    heightMode: 'standard',
    plugins: [plugin]
  };

  const tableInstance = new VTable.ListTable(option);
  tableInstance.on(VTable.TABLE_EVENT_TYPE.CONTEXT_MENU_CLICK, args => {
    updateStatus(tableInstance, status, args);
    // eslint-disable-next-line no-console
    console.log('context_menu_click', args);
  });

  updateStatus(tableInstance, status);
  window.tableInstance = tableInstance;
  return tableInstance;
}

export function createTable() {
  document.getElementById(INFO_ID)?.remove();
  document.getElementById(STATUS_ID)?.remove();

  const container = document.getElementById(CONTAINER_ID) ?? document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.width = '100%';
  container.style.height = '460px';
  if (!container.parentNode) {
    document.body.appendChild(container);
  }

  const info = document.createElement('div');
  info.id = INFO_ID;
  info.style.margin = '10px';
  info.style.padding = '10px';
  info.style.border = '1px solid #ddd';
  info.style.borderRadius = '4px';
  info.style.backgroundColor = '#f9f9f9';
  info.innerHTML = `
    <h3>Issue 4655: context menu click event</h3>
    <p>Right-click a body cell, open the freeze submenu, then click freeze or unfreeze.</p>
    <p>The table should emit <code>context_menu_click</code> with menu details in <code>contextMenu</code>.</p>
  `;
  document.body.appendChild(info);

  const status = document.createElement('pre');
  status.id = STATUS_ID;
  status.style.margin = '10px';
  status.style.padding = '10px';
  status.style.border = '1px solid #ddd';
  status.style.borderRadius = '4px';
  status.style.backgroundColor = '#fff';
  document.body.appendChild(status);

  const tableInstance = createTableInstance(status);
  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    document.getElementById(INFO_ID)?.remove();
    document.getElementById(STATUS_ID)?.remove();
    release();
  };

  return tableInstance;
}
