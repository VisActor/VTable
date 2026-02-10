# 交互模式示例

## 1. 可编辑表格

```javascript
import * as VTable from '@visactor/vtable';
// 引入编辑器
import { InputEditor, DateInputEditor, ListEditor } from '@visactor/vtable-editors';

// 注册编辑器
const inputEditor = new InputEditor();
const dateEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['低', '中', '高'] });

VTable.register.editor('input', inputEditor);
VTable.register.editor('date', dateEditor);
VTable.register.editor('list', listEditor);

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    { field: 'name', title: '名称', width: 150, editor: 'input' },
    { field: 'date', title: '日期', width: 120, editor: 'date' },
    { field: 'priority', title: '优先级', width: 100, editor: 'list' },
    { field: 'readonly', title: '只读列', width: 100 }  // 无 editor = 不可编辑
  ],
  editCellTrigger: 'doubleclick'  // 双击进入编辑
});

// 监听编辑
table.on('change_cell_value', (args) => {
  console.log('值变更:', args.col, args.row, args.rawValue, '→', args.changedValue);
});
```

## 2. 选中与高亮

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  // 选中配置
  select: {
    disableSelect: false,
    disableHeaderSelect: false,
    highlightMode: 'cell'  // 'cell' | 'cross' | 'row' | 'column'
  },
  // hover 配置
  hover: {
    highlightMode: 'row',  // hover 整行高亮
    disableHover: false,
    disableHeaderHover: false
  },
  // 主题中自定义选中样式
  theme: VTable.themes.DEFAULT.extends({
    selectionStyle: {
      cellBgColor: 'rgba(24, 144, 255, 0.1)',
      cellBorderColor: '#1890ff',
      cellBorderLineWidth: 2
    }
  })
});

// 监听选中
table.on('selected_cell', (args) => {
  console.log('选中:', args.ranges);
});

// API: 设置选中区域
table.selectCells([{ start: { col: 0, row: 1 }, end: { col: 2, row: 3 } }]);

// API: 获取选中区域数据
const selectedData = table.getSelectedCellInfos();
```

## 3. 右键菜单

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  menu: {
    contextMenuItems: [
      { text: '复制', menuKey: 'copy' },
      { text: '粘贴', menuKey: 'paste' },
      '-',  // 分隔线
      { text: '删除行', menuKey: 'delete', icon: '🗑️' },
      {
        text: '导出',
        menuKey: 'export',
        children: [
          { text: '导出CSV', menuKey: 'export-csv' },
          { text: '导出Excel', menuKey: 'export-excel' }
        ]
      }
    ],
    // 下拉菜单（表头按钮）
    dropDownMenuHighlight: [
      { menuKey: 'filter-asc', text: '升序' },
      { menuKey: 'filter-desc', text: '降序' }
    ]
  }
});

// 监听菜单点击
table.on('dropdown_menu_click', (args) => {
  switch (args.menuKey) {
    case 'copy':
      table.copyCellsToClipboard();
      break;
    case 'delete':
      // 删除对应行
      const records = [...table.records];
      records.splice(args.row - table.columnHeaderLevelCount, 1);
      table.setRecords(records);
      break;
    case 'export-csv':
      exportToCSV(table);
      break;
  }
});
```

## 4. 拖拽排序列/行

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  dragHeaderMode: 'all',  // 'all' | 'column' | 'row' | 'none'
});

// 监听拖拽完成
table.on('change_header_position', (args) => {
  console.log('列位置变更:', args.source, '→', args.target);
});
```

## 5. 列宽调整

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  columnResizeMode: 'header',  // 'all' | 'header' | 'body' | 'none'
  columnResizeType: 'column'   // 'column' | 'indicator' | 'all' | 'indicatorGroup'
});

// 监听列宽变化
table.on('resize_column_end', (args) => {
  console.log('列宽:', args.col, args.colWidth);
});
```

## 6. 键盘导航

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  keyboardOptions: {
    moveFocusCellOnTab: true,          // Tab 移动焦点
    moveFocusCellOnEnter: true,        // Enter 移动焦点
    copySelected: true,                 // Ctrl+C 复制
    pasteValueToCell: true,             // Ctrl+V 粘贴
    selectAllOnCtrlA: true,             // Ctrl+A 全选
    editCellOnEnter: true               // Enter 编辑
  }
});

// 监听键盘事件
table.on('keydown', (args) => {
  if (args.event.key === 'Delete') {
    // 清除选中区域数据
    const ranges = table.getSelectedCellRanges();
    ranges.forEach(range => {
      for (let r = range.start.row; r <= range.end.row; r++) {
        for (let c = range.start.col; c <= range.end.col; c++) {
          table.changeCellValue(c, r, '');
        }
      }
    });
  }
});
```

## 7. Tooltip

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    {
      field: 'description',
      title: '描述',
      width: 120,
      style: { textOverflow: 'ellipsis' }
    }
  ],
  tooltip: {
    isShowOverflowTextTooltip: true  // 文字省略时自动提示
  }
});

// 自定义 tooltip
table.showTooltip(col, row, {
  content: '自定义提示内容',
  referencePosition: { rect: { x: 100, y: 100 }, placement: 'bottom' },
  style: { bgColor: '#333', color: '#fff' }
});
```

## 8. 冻结列

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...],
  frozenColCount: 2,          // 左侧冻结2列
  rightFrozenColCount: 1,     // 右侧冻结1列
  bottomFrozenRowCount: 1,    // 底部冻结1行（如汇总行）
  allowFrozenColCount: 5      // 允许冻结的最大列数
});

// 动态更新冻结列
table.updateOption({ frozenColCount: 3 });
```

## 9. 搜索高亮

```javascript
import { SearchComponent } from '@visactor/vtable-search';

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [...]
});

// 初始化搜索组件
const search = new SearchComponent({
  table,
  autoJump: true  // 自动跳转到匹配项
});

// 搜索
const results = search.search('关键词');

// 跳转到下一个/上一个匹配
search.next();
search.prev();

// 清除搜索
search.clear();
```

## 10. 导出

```javascript
import { exportVTableToExcel } from '@visactor/vtable-export';

// 导出为 Excel
exportVTableToExcel(table, {
  fileName: 'data-export',
  formatExcelJSCell: (cellInfo, cellInExcelFile) => {
    // 自定义 Excel 单元格格式
    return cellInExcelFile;
  }
});

// 导出为 CSV（内置）
const csvString = table.exportCellsContent();
```
