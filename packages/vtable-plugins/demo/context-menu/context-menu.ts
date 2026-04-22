import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '../../src/context-menu';
import { TableSeriesNumber } from '../../src/table-series-number';
import { DEFAULT_HEADER_MENU_ITEMS } from '../../src';
import type { MenuItem } from '../../src';

const CONTAINER_ID = 'vTable';

/**
 * 生成示例数据
 */
const generateTestData = (count: number) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `名称 ${i + 1}`,
    value1: Math.floor(Math.random() * 1000),
    value2: Math.floor(Math.random() * 100) / 100,
    value3: Math.floor(Math.random() * 1000),
    value4: Math.floor(Math.random() * 1000),
    value5: Math.floor(Math.random() * 1000)
  }));
};

const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const DELETE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const SETTINGS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;

/**
 * 创建示例表格
 */
export function createTableInstance() {
  // 使用可变数据存储
  const records = generateTestData(20);

  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: 'name',
      title: '名称',
      width: 150
    },
    {
      field: 'value1',
      title: '数值1',
      width: 120
    },
    {
      field: 'value2',
      title: '数值2',
      width: 120
    },
    {
      field: 'value3',
      title: '数值3',
      width: 120
    },
    {
      field: 'value4',
      title: '数值4',
      width: 120
    },
    {
      field: 'value5',
      title: '数值5',
      width: 120
    }
  ];

  // 创建右键菜单插件
  const contextMenuPlugin = new ContextMenuPlugin({
    headerCellMenuItems: [
      ...DEFAULT_HEADER_MENU_ITEMS,
      {
        text: '设置筛选器',
        customIcon: { svg: SETTINGS_SVG, width: 16, height: 16 },
        menuKey: 'set_filter'
      }
    ],
    // columnSeriesNumberMenuItems: [
    //   { text: '向左插入', menuKey: 'insert_column_left', iconName: 'insert' },
    //   { text: '向右插入', menuKey: 'insert_column_right', iconName: 'insert' },
    //   { text: '列宽设为', menuKey: 'set_width', iconName: 'merge' },
    //   { text: '列宽自适应', menuKey: 'fit_width', iconName: 'merge' },
    //   { text: '删除列', menuKey: 'delete_column', iconName: 'delete' },
    //   { text: '隐藏列', menuKey: 'hide_column', iconName: 'hide' },
    //   '---',
    //   { text: '排序', menuKey: 'sort', iconName: 'sort' },
    //   { text: '合并单元格', menuKey: 'merge_cells', iconName: 'merge' }
    //   // { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
    // ]
    // bodyCellMenuItems: [
    //   { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
    //   { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
    //   { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
    //   { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
    //   { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
    //   { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
    //   { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
    //   { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
    //   { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
    //   '---',
    //   {
    //     text: '插入',
    //     menuKey: 'insert',
    //     iconName: 'insert',
    //     children: [
    //       {
    //         type: 'input',
    //         label: '向上插入行数：',
    //         menuKey: 'insert_row_above',
    //         defaultValue: 1
    //       },
    //       {
    //         type: 'input',
    //         label: '向下插入行数：',
    //         menuKey: 'insert_row_below',
    //         defaultValue: 1
    //       },
    //       '---',
    //       {
    //         type: 'input',
    //         label: '向左插入列数：',
    //         menuKey: 'insert_column_left',
    //         defaultValue: 1
    //       },
    //       {
    //         type: 'input',
    //         label: '向右插入列数：',
    //         menuKey: 'insert_column_right',
    //         defaultValue: 1
    //       }
    //     ]
    //   },
    //   {
    //     text: '删除',
    //     menuKey: 'delete',
    //     iconName: 'delete',
    //     children: [
    //       { text: '删除行', menuKey: 'delete_row' },
    //       { text: '删除列', menuKey: 'delete_column' }
    //     ]
    //   },
    //   {
    //     text: '冻结',
    //     menuKey: 'freeze',
    //     iconName: 'freeze',
    //     children: [
    //       { text: '冻结到本行', menuKey: 'freeze_to_this_row' },
    //       { text: '冻结到本列', menuKey: 'freeze_to_this_column' },
    //       { text: '冻结到本行本列', menuKey: 'freeze_to_this_row_and_column' },
    //       { text: '取消冻结', menuKey: 'unfreeze' }
    //     ]
    //   },
    //   '---',
    //   { text: '合并单元格', menuKey: 'merge_cells', iconName: 'merge' },
    //   { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
    // ],
    bodyCellMenuItems: [
      {
        text: '复制',
        customClassName: {
          item: 'copy-item',
          icon: 'copy-icon',
          text: 'copy-text',
          shortcut: 'copy-shortcut',
          leftContainer: 'left',
          rightContainer: 'right'
        },
        menuKey: 'copy',
        customIcon: { svg: COPY_SVG, width: 16, height: 16 },
        shortcut: 'Ctrl+C'
      },
      { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
      { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
      '---',
      {
        text: '删除选中',
        customIcon: (_menuItem: MenuItem) => {
          const el = document.createElement('span');
          el.style.display = 'inline-block';
          el.style.width = '8px';
          el.style.height = '8px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#ff4d4f';
          return el;
        },
        menuKey: 'delete_row'
      },
      {
        text: '自定义操作',
        customIcon: (_menuItem: MenuItem) => {
          const img = document.createElement('img');
          img.src = 'data:image/svg+xml,' + encodeURIComponent(DELETE_SVG);
          img.width = 16;
          img.height = 16;
          img.style.opacity = '0.6';
          return img;
        },
        menuKey: 'custom_action'
      },
      '---',
      {
        text: '插入',
        menuKey: 'insert',
        iconName: 'insert',
        children: [
          {
            text: '向上插入行数：',
            menuKey: 'insert_row_above',
            iconName: 'up-arrow',
            inputDefaultValue: 1,
            customClassName: { input: 'input' }
          },
          { text: '向下插入行数：', menuKey: 'insert_row_below', iconName: 'down-arrow', inputDefaultValue: 1 },
          '---',
          { text: '向左插入列数：', menuKey: 'insert_column_left', iconName: 'left-arrow', inputDefaultValue: 1 },
          { text: '向右插入列数：', menuKey: 'insert_column_right', iconName: 'right-arrow', inputDefaultValue: 1 }
        ],
        customClassName: {
          arrow: 'arrow'
        }
      },
      '---',
      { text: '合并单元格', menuKey: 'merge_cells' },
      '---',
      {
        text: '不可用操作',
        menuKey: 'disabled_action',
        disabled: true,
        iconName: 'protect',
        customClassName: { itemDisabled: 'custom-disabled' }
      },
      { text: '不可用粘贴', menuKey: 'paste_disabled', disabled: true, shortcut: 'Ctrl+V' }
    ],
    menuClickCallback: {
      custom_action: (args, _table) => {
        alert(`自定义操作被点击: 行${args.rowIndex} 列${args.colIndex}`);
      },
      set_filter: (args, table) => {
        alert(`设置筛选器: 列${args.colIndex}`);
      }
    },
    customMenuAttributions: {
      style: {
        menuContainer: {
          backgroundColor: 'rgba(255, 255, 255)',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
          padding: '4px',
          maxHeight: '400px'
        },
        submenuContainer: {
          borderRadius: '6px',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)'
        },
        menuItem: {
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer'
        },
        menuItemHover: {
          backgroundColor: 'rgba(22, 119, 255, 0.1)'
        },
        menuItemDisabled: {
          opacity: '0.35',
          cursor: 'not-allowed'
        },
        menuItemSeparator: {
          height: '2px',
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          margin: '4px 0'
        },
        menuItemIcon: {
          marginRight: '10px',
          width: '18px',
          height: '18px'
        },
        menuItemText: {
          flex: '1',
          fontSize: '13px'
        },
        menuItemShortcut: {
          marginLeft: '24px',
          color: '#aaa',
          fontSize: '11px'
        },
        submenuArrow: {
          marginLeft: '8px',
          fontSize: '10px',
          color: '#999'
        },
        inputContainer: {
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center'
        },
        inputLabel: {
          marginRight: '6px',
          whiteSpace: 'nowrap',
          fontSize: '12px'
        },
        inputField: {
          width: '50px',
          padding: '3px 4px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '12px',
          outline: 'none'
        },
        buttonContainer: {
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '4px 12px'
        },
        button: {
          padding: '4px 12px',
          backgroundColor: '#1677ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }
      },
      class: {
        menuContainer: 'custom-context-menu-container',
        menuItem: 'custom-context-menu-item',
        menuItemSeparator: ['custom1-context-menu-item-separator', 'custom2-context-menu-item-separator'],
        submenuContainer: 'custom-context-menu-submenu',
        menuItemDisabled: 'custom-context-menu-item-disabled'
      }
    }
  });
  const tableSeriesNumberPlugin = new TableSeriesNumber({
    rowCount: 1000,
    colCount: 100,
    colSeriesNumberHeight: 30,
    rowSeriesNumberWidth: 40
  });
  // 创建表格配置
  const option: VTable.ListTableConstructorOptions = {
    frozenRowCount: 2,
    container: document.getElementById(CONTAINER_ID)!,
    columns,
    records,
    widthMode: 'standard',
    defaultRowHeight: 40,
    hover: {
      highlightMode: 'cross'
    },
    showHeader: true,
    select: {
      makeSelectCellVisible: false
    },
    editor: '',
    headerEditor: '',
    keyboardOptions: {
      copySelected: true,
      pasteValueToCell: true
    },
    plugins: [contextMenuPlugin, tableSeriesNumberPlugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);

  console.log('右键菜单插件已加载，请在表格中右键点击试试');

  // 导出以便调试
  (window as any).tableInstance = tableInstance;
  console.log('表格实例已创建');
}

/**
 * 初始化页面和表格
 */
export function createTable() {
  // 创建表格容器
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.width = '100%';
  container.style.height = '500px';
  document.body.appendChild(container);

  // 创建表格
  createTableInstance();

  // 创建说明文字
  const info = document.createElement('div');
  info.style.margin = '10px';
  info.style.padding = '10px';
  info.style.border = '1px solid #ddd';
  info.style.borderRadius = '4px';
  info.style.backgroundColor = '#f9f9f9';
  info.innerHTML = `
    <h3>右键菜单演示</h3>
    <p>在表格的不同位置点击右键，可以看到对应的上下文菜单：</p>
    <ul>
      <li>表头序号列</li>
      <li>表头单元格</li>
      <li>表体序号列</li>
      <li>表体单元格</li>
    </ul>
    <p>菜单功能：</p>
    <ul>
      <li>带图标和快捷键提示</li>
      <li>悬停打开子菜单</li>
      <li>支持输入框数量</li>
      <li>长菜单可滚动</li>
    </ul>

    <h3>菜单自定义图标和样式演示</h3>
    <ul>
      <li><b>表体单元格</b>：展示了 SVG 图标、渲染函数图标、内置 emoji 图标的混合使用</li>
      <li><b>表头单元格</b>：展示了 SVG 图标（设置图标）</li>
      <li>菜单样式和类名通过 <code>customMenuAttributions</code> 统一配置</li>
      <li><b>图标类型说明</b></li>
      <ul>
        <li><code>iconName: 'copy'</code> — 内置 emoji 图标</li>
        <li><code>customIcon: { svg: '...', width: 16, height: 16 }</code> — SVG 图标</li>
        <li><code>customIcon: (menuItem) => HTMLElement</code> — 渲染函数</li>
      </ul>
      <li><b>自定义类名说明</b></li>
      <ul>
        <li><code>customMenuAttributions.class</code> — 统一追加类名</li>
        <li><code>MenuItem.customClassName</code> — 单项精细化类名</li>
      </ul>
    </ul>
  `;

  document.body.insertBefore(info, container);
}
