# 交互配置

## 一、选择

### 基本选择配置

```typescript
const table = new ListTable({
  select: {
    disableSelect: false,           // 是否禁用选择
    disableHeaderSelect: false,     // 是否禁用表头选择
    
    // 选择高亮模式
    highlightMode: 'cell',          // 'cross' | 'column' | 'row' | 'cell'
    
    // 点击表头的选择行为
    headerSelectMode: 'inline',     // 'inline' 选中整行/列 | 'cell' 只选表头
    
    // 点击空白区域取消选中
    blankAreaClickDeselect: true
  }
});
```

### 选择 API

```typescript
// 选中单元格
table.selectCell(col, row);

// 选中区域
table.selectCells([
  { start: { col: 1, row: 1 }, end: { col: 3, row: 5 } }
]);

// 选中整行/列
table.selectRow(3);
table.selectCol(2);

// 清除选中
table.clearSelected();

// 获取选中信息
const selected = table.getSelectedCellInfos();
```

### 选择事件

```typescript
table.on('selected_cell', (args) => {
  console.log('选中:', args.ranges);
});

table.on('selected_changed', (args) => {
  // 拖拽选择过程中持续触发
});

table.on('selected_clear', () => {
  console.log('取消选中');
});
```

## 二、Hover 高亮

```typescript
const table = new ListTable({
  hover: {
    // 高亮模式
    highlightMode: 'cross',    // 'cross' 十字花 | 'column' | 'row' | 'cell'
    
    disableHover: false,       // 禁用 hover
    disableHeaderHover: false, // 禁用表头 hover
    enableSingleCell: false    // 只高亮单个单元格
  }
});
```

主题中配置 hover 样式：

```typescript
theme: {
  bodyStyle: {
    hover: {
      cellBgColor: '#e6f7ff',        // hover 单元格背景色
      inlineColumnBgColor: '#f0f5ff', // 十字花列背景色
      inlineRowBgColor: '#f0f5ff'     // 十字花行背景色
    }
  }
}
```

## 三、编辑

### 配置编辑器

```typescript
import { ListTable } from '@visactor/vtable';
import { InputEditor, DateInputEditor, ListEditor } from '@visactor/vtable-editors';

// 1. 注册编辑器
const inputEditor = new InputEditor();
const dateEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['选项A', '选项B', '选项C'] });

VTable.register.editor('input', inputEditor);
VTable.register.editor('date', dateEditor);
VTable.register.editor('list', listEditor);

// 2. 在列定义中使用
const table = new ListTable({
  columns: [
    { field: 'name', title: '姓名', editor: 'input' },
    { field: 'date', title: '日期', editor: 'date' },
    { field: 'status', title: '状态', editor: 'list' }
  ],
  editCellTrigger: 'doubleclick'  // 编辑触发方式
});
```

### 编辑触发方式

```typescript
editCellTrigger: 'doubleclick'  // 双击（默认）
editCellTrigger: 'click'       // 单击
editCellTrigger: 'api'         // 仅通过 API
editCellTrigger: 'keydown'     // 键盘按下
editCellTrigger: ['doubleclick', 'api']  // 多种方式
```

### 编辑 API

```typescript
// 开启编辑
table.startEditCell(col, row);
table.startEditCell(col, row, 'customValue'); // 自定义编辑初始值

// 结束编辑
table.completeEditCell();  // 保存
table.cancelEditCell();    // 取消

// 获取编辑器
const editor = table.getEditor(col, row);
```

### 编辑事件

```typescript
table.on('change_cell_value', (args) => {
  const { col, row, value, oldValue } = args;
  console.log('值改变:', oldValue, '->', value);
});
```

### 动态编辑器

```typescript
{
  field: 'value',
  title: '值',
  editor: (args) => {
    // 根据行数据动态返回编辑器
    const record = args.table.getCellOriginRecord(args.col, args.row);
    if (record.type === 'date') return 'date';
    if (record.type === 'select') return 'list';
    return 'input';
  }
}
```

## 四、排序

### 列定义排序

```typescript
{
  field: 'name',
  title: '姓名',
  sort: true,      // 开启默认排序
  showSort: true   // 显示排序图标（默认 sort:true 时自动显示）
}

// 自定义排序
{
  field: 'name',
  sort: (a, b, order) => {
    return order === 'asc' 
      ? a.localeCompare(b, 'zh') 
      : b.localeCompare(a, 'zh');
  }
}
```

### 排序状态

```typescript
// 初始排序
const table = new ListTable({
  sortState: { field: 'age', order: 'asc' },
  multipleSort: true  // 支持多列排序
});

// 更新排序
table.updateSortState({
  field: 'name',
  order: 'desc'
});
```

### 排序事件

```typescript
table.on('sort_click', (args) => {
  const { field, order } = args;
  // 可以阻止默认排序，实现服务端排序
  // args.preventDefault?.();
  // fetchSortedData(field, order).then(data => table.setRecords(data));
});
```

## 五、拖拽

### 拖拽调整列/行顺序

```typescript
const table = new ListTable({
  dragOrder: {
    dragHeaderMode: 'column',  // 'all' | 'none' | 'column' | 'row'
    
    // 冻结列拖拽规则
    frozenColDragHeaderMode: 'fixedFrozenCount'
    // 'disabled': 禁止拖入/出冻结列
    // 'adjustFrozenCount': 拖入冻结区增加冻结数
    // 'fixedFrozenCount': 自由拖拽，冻结数不变
  }
});
```

### 拖拽事件

```typescript
table.on('change_header_position', (args) => {
  console.log(`列从 ${args.source} 移到 ${args.target}`);
});
```

### 行拖拽排序

通过 `rowSeriesNumber.dragOrder` 启用行拖拽：

```typescript
const table = new ListTable({
  rowSeriesNumber: {
    title: '#',
    width: 50,
    dragOrder: true  // 启用行拖拽排序
  }
});
```

## 六、列宽/行高调整

```typescript
const table = new ListTable({
  resize: {
    columnResizeMode: 'header',  // 'all' | 'none' | 'header' | 'body'
    rowResizeMode: 'none',
    columnResizeWidth: 6         // 调整热区宽度
  }
});
```

### 列宽调整事件

```typescript
table.on('resize_column_end', (args) => {
  console.log(`列 ${args.col} 宽度调整为 ${args.colWidth}`);
});
```

## 七、冻结列/行

```typescript
const table = new ListTable({
  frozenColCount: 2,         // 左侧冻结2列
  rightFrozenColCount: 1,    // 右侧冻结1列
  frozenRowCount: 1,         // 顶部冻结（通常是表头）
  bottomFrozenRowCount: 1    // 底部冻结（如汇总行）
});
```

## 八、键盘交互

```typescript
const table = new ListTable({
  keyboardOptions: {
    moveFocusCellOnTab: true,          // Tab 键移动
    editCellOnEnter: true,             // Enter 进入编辑
    selectAllOnCtrlA: true,            // Ctrl+A 全选
    copySelected: true,               // Ctrl+C 复制
    pasteValueToCell: true,            // Ctrl+V 粘贴
    moveSelectedCellOnArrowKeys: true, // 方向键移动
    ctrlMultiSelect: true,             // Ctrl 多选
    shiftMultiSelect: true             // Shift 范围选
  }
});
```

## 九、右键菜单

```typescript
const table = new ListTable({
  menu: {
    contextMenuItems: [
      { text: '复制', menuKey: 'copy' },
      { text: '粘贴', menuKey: 'paste' },
      { text: '---' },  // 分割线
      { text: '删除行', menuKey: 'delete' }
    ]
  }
});

table.on('dropdown_menu_click', (args) => {
  switch (args.menuKey) {
    case 'copy': table.getCopyValue(); break;
    case 'delete': table.deleteRecords([args.row]); break;
  }
});
```

## 十、Tooltip 提示

```typescript
const table = new ListTable({
  tooltip: {
    renderMode: 'html',              // 'html' | 'canvas'
    isShowOverflowTextTooltip: true, // 省略文字自动提示
    confine: true,                   // 限制在表格内
    overflowTextTooltipDisappearDelay: 1000  // 延迟消失(ms)
  }
});

// 手动显示 tooltip
table.showTooltip(col, row, {
  content: '自定义提示内容',
  style: { bgColor: '#333', color: '#fff' }
});
```
