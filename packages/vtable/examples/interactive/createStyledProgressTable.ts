import * as VTable from '../../src/index.ts'; // 导入 VTable 模块
import { bindDebugTool } from '../../src/scenegraph/debug-tool/index.ts'; // 导入调试工具绑定函数
import { TABLE_EVENT_TYPE } from '../../src/core/TABLE_EVENT_TYPE.ts'; // 导入表事件类型常量
import { importStyle } from '../../src/components/menu/dom/logic/MenuElementStyle.ts'; // 导入样式导入函数

const ListTable = VTable.ListTable; // 获取 ListTable 构造函数
const CONTAINER_ID = 'vTable'; // 定义表格容器的 ID

declare global {
  interface Window {
    tableInstance: InstanceType<typeof ListTable>; // 在全局 window 对象上声明 tableInstance 属性
  }
}

// 创建并初始化表格
export function createTable() {
  // 定义表格数据源
  const personsDataSource = [
    { progress: 100, id: 1, name: 'Alice' },
    { progress: 80, id: 2, name: 'Bob' },
    { progress: 50, id: 3, name: 'Charlie' },
    { progress: 20, id: 4, name: 'David' },
    { progress: 0, id: 5, name: 'Eva' }
  ];

  // 定义表格配置选项
  const option: VTable.ListTableConstructorOptions = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    container: document.getElementById(CONTAINER_ID)!, // 获取表格容器元素
    columns: [
      {
        field: 'progress',
        fieldFormat: rec => `完成度: ${rec.progress}%`, // 格式化字段显示
        title: '进度',
        width: 150,
        showSort: true // 启用排序
      },
      {
        field: 'id',
        title: 'ID',
        width: 100,
        sort: (v1, v2, order) => {
          // 自定义排序函数
          const result = order === 'desc' ? v2 - v1 : v1 - v2;
          return result > 0 ? 1 : result < 0 ? -1 : 0;
        }
      },
      {
        field: 'name',
        title: '姓名',
        headerStyle: {
          // 设置列头样式
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
        },
        width: 150,
        dropDownMenu: [
          // 定义下拉菜单项
          { type: 'item', menuKey: 'edit', text: '编辑' },
          { type: 'item', menuKey: 'delete', text: '删除' }
        ]
      }
    ],
    showFrozenIcon: true, // 显示冻结图标
    widthMode: 'standard', // 设置宽度模式
    allowFrozenColCount: 2, // 允许冻结列数
    title: {
      text: '人员进度表', // 表格标题
      orient: 'top' // 标题位置
    }
  };

  // 创建表格实例
  const instance = new ListTable(option);
  instance.setRecords(personsDataSource, {
    sortState: {
      field: 'progress',
      order: 'desc' // 设置默认排序状态
    }
  });

  // 绑定调试工具
  bindDebugTool(instance.scenegraph.stage as unknown, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 监听下拉菜单点击事件
  instance.on(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, args => {
    // eslint-disable-next-line no-console
    console.log('dropdown_menu_click', args);

    const menuElement = document.querySelector('.vtable__menu-element__item');

    if (menuElement) {
      const menuStyle = window.getComputedStyle(menuElement);
      // eslint-disable-next-line no-console
      console.log('菜单字体:', menuStyle.fontFamily);
      // eslint-disable-next-line no-console
      console.log('菜单字体大小:', menuStyle.fontSize);
      instance.setDropDownMenuHighlight([{ field: args.field as string }]);
    } else {
      console.warn('未找到菜单元素');
    }
  });

  // 监听单元格点击事件
  instance.on(TABLE_EVENT_TYPE.CLICK_CELL, args => {
    const cellElement = instance.getElement(args.col, args.row);
    if (cellElement) {
      const cellStyle = window.getComputedStyle(cellElement);
      // eslint-disable-next-line no-console
      console.log('单元格字体:', cellStyle.fontFamily);
      // eslint-disable-next-line no-console
      console.log('单元格字体大小:', cellStyle.fontSize);
    } else {
      console.warn('未找到单元格元素');
    }
  });

  // 将表格实例赋值给全局 window 对象
  window.tableInstance = instance;

  // 导入统一的菜单和单元格样式
  importStyle({
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    fontSize: '16px'
  });

  // 添加全局样式覆盖
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
