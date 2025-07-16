import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '../../src/context-menu';
import { TableSeriesNumber } from '../../src/table-series-number';

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
    columnSeriesNumberMenuItems: [
      { text: '向左插入', menuKey: 'insert_column_left', iconName: 'insert' },
      { text: '向右插入', menuKey: 'insert_column_right', iconName: 'insert' },
      { text: '列宽设为', menuKey: 'set_width', iconName: 'merge' },
      { text: '列宽自适应', menuKey: 'fit_width', iconName: 'merge' },
      { text: '删除列', menuKey: 'delete_column', iconName: 'delete' },
      { text: '隐藏列', menuKey: 'hide_column', iconName: 'hide' },
      '---',
      { text: '排序', menuKey: 'sort', iconName: 'sort' },
      { text: '合并单元格', menuKey: 'merge_cells', iconName: 'merge' },
      { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
    ]
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
    // menuClickCallback: (args, table) => {
    //   console.log('菜单点击事件:', args);
    // }
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
  `;

  document.body.insertBefore(info, container);
}
