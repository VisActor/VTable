import * as VTable from '../../src/index.ts';
import { bindDebugTool } from '../../src/scenegraph/debug-tool/index.ts';
import { TABLE_EVENT_TYPE } from '../../src/core/TABLE_EVENT_TYPE.ts';
import { importStyle } from '../../src/components/menu/dom/logic/MenuElementStyle.ts';

const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

declare global {
  interface Window {
    tableInstance: InstanceType<typeof ListTable>;
  }
}

export function initializeProgressTable() {
  const personsDataSource = [
    { progress: 100, id: 1, name: 'Alice' },
    { progress: 80, id: 2, name: 'Bob' },
    { progress: 50, id: 3, name: 'Charlie' },
    { progress: 20, id: 4, name: 'David' },
    { progress: 0, id: 5, name: 'Eva' }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID)!,
    columns: [
      {
        field: 'progress',
        fieldFormat: rec => `完成度: ${rec.progress}%`,
        title: '进度',
        width: 150,
        showSort: true
      },
      {
        field: 'id',
        title: 'ID',
        width: 100,
        sort: (v1, v2, order) => {
          const result = order === 'desc' ? v2 - v1 : v1 - v2;
          return result > 0 ? 1 : result < 0 ? -1 : 0;
        }
      },
      {
        field: 'name',
        title: '姓名',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
        },
        width: 150,
        dropDownMenu: [
          { type: 'item', menuKey: 'edit', text: '编辑' },
          { type: 'item', menuKey: 'delete', text: '删除' }
        ]
      }
    ],
    showFrozenIcon: true,
    widthMode: 'standard',
    allowFrozenColCount: 2,
    title: {
      text: '人员进度表',
      orient: 'top'
    }
  };

  const instance = new ListTable(option);
  instance.setRecords(personsDataSource, {
    sortState: {
      field: 'progress',
      order: 'desc'
    }
  });

  bindDebugTool(instance.scenegraph.stage as unknown, {
    customGrapicKeys: ['role', '_updateTag']
  });

  instance.on(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, args => {
    console.log('dropdown_menu_click', args);

    const menuElement = document.querySelector('.vtable__menu-element__item');

    if (menuElement) {
      const menuStyle = window.getComputedStyle(menuElement);
      console.log('菜单字体:', menuStyle.fontFamily);
      console.log('菜单字体大小:', menuStyle.fontSize);
      instance.setDropDownMenuHighlight([{ field: args.field as string }]);
    } else {
      console.warn('未找到菜单元素');
    }
  });

  instance.on(TABLE_EVENT_TYPE.CLICK_CELL, args => {
    const cellElement = instance.getElement();
    if (cellElement) {
      const cellStyle = window.getComputedStyle(cellElement);
      console.log('单元格字体:', cellStyle.fontFamily);
      console.log('单元格字体大小:', cellStyle.fontSize);
    } else {
      console.warn('未找到单元格元素');
    }
  });

  window.tableInstance = instance;

  importStyle({
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    fontSize: '16px'
  });

  const style = document.createElement('style');
  style.innerHTML = `
    #${CONTAINER_ID} .vtable__cell {
      font-family: Avenir, Helvetica, Arial, sans-serif !important;
      font-size: 16px !important;
    }
    .vtable__menu-element__item {
      font-family: Avenir, Helvetica, Arial, sans-serif !important;
      font-size: 16px !important;
    }
    .vtable__menu-element {
      background-color: #ffffff !important;
      animation: vtable__menu-element--shown-animation 300ms ease-out !important;
    }
  `;
  document.head.appendChild(style);
}

importStyle({
  fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
  fontSize: '16px'
});
