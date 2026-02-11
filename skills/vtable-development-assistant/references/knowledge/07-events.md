# 事件系统

## 使用方式

```typescript
// 监听事件
const listenerId = tableInstance.on('click_cell', (args) => {
  console.log('点击了', args.col, args.row);
});

// 移除监听（方式一：通过 ID）
tableInstance.off(listenerId);

// 移除监听（方式二：通过类型+函数）
tableInstance.off('click_cell', handler);
```

## 事件分类速查

### 鼠标事件

| 事件名 | 参数类型 | 说明 |
|---|---|---|
| `click_cell` | `MousePointerCellEvent` | 单击单元格 |
| `dblclick_cell` | `MousePointerCellEvent` | 双击单元格 |
| `mouseenter_cell` | `MousePointerCellEvent` | 鼠标进入单元格 |
| `mouseleave_cell` | `MousePointerCellEvent` | 鼠标离开单元格 |
| `mousemove_cell` | `MousePointerCellEvent` | 鼠标在单元格上移动 |
| `mousedown_cell` | `MousePointerCellEvent` | 单元格鼠标按下 |
| `mouseup_cell` | `MousePointerCellEvent` | 单元格鼠标松开 |
| `contextmenu_cell` | `MousePointerCellEvent` | 单元格右键 |
| `mouseenter_table` | — | 鼠标进入表格 |
| `mouseleave_table` | — | 鼠标离开表格 |
| `mousedown_table` | — | 鼠标在表格按下 |
| `contextmenu_canvas` | — | 画布区域右键 |

### MousePointerCellEvent 参数

```typescript
{
  col: number;           // 列号
  row: number;           // 行号
  value: FieldData;      // 格式化后的值
  dataValue: FieldData;  // 原始值
  cellRange: CellRange;  // 单元格范围
  cellType: string;      // 单元格类型
  title: string;         // 列标题
  field: FieldDef;       // 字段名
  cellLocation: CellLocation; // 'body' | 'rowHeader' | 'columnHeader' | 'cornerHeader'
  originData: any;       // 完整记录
  event: MouseEvent;     // 原生事件
  target: any;           // 场景图节点
  targetCell: any;       // 单元格节点
}
```

### 选择事件

| 事件名 | 说明 |
|---|---|
| `selected_cell` | 单元格选中状态改变 |
| `selected_clear` | 清除所有选中 |
| `selected_changed` | 选中范围改变（拖拽选择过程中持续触发） |
| `drag_select_end` | 拖拽框选鼠标松开 |
| `copy_data` | 复制内容 |

### 滚动事件

| 事件名 | 说明 |
|---|---|
| `scroll` | 滚动事件（scrollLeft, scrollTop, scrollDirection） |
| `scroll_vertical_end` | 竖向滚动到底部 |
| `scroll_horizontal_end` | 横向滚动到最右 |

### 调整大小事件

| 事件名 | 说明 |
|---|---|
| `resize_column` | 列宽调整中（持续触发） |
| `resize_column_end` | 列宽调整完成 |
| `resize_row` | 行高调整中 |
| `resize_row_end` | 行高调整完成 |

### 拖拽排序事件

| 事件名 | 说明 |
|---|---|
| `change_header_position` | 拖拽移动表头完成 |
| `change_header_position_start` | 开始拖拽 |
| `changing_header_position` | 拖拽中 |
| `change_header_position_fail` | 拖拽失败 |

### 排序事件

| 事件名 | 说明 | 适用表格 |
|---|---|---|
| `sort_click` | 点击排序图标 | ListTable |
| `after_sort` | 排序完成 | ListTable |
| `pivot_sort_click` | 透视表排序点击 | PivotTable |

### 菜单事件

| 事件名 | 说明 |
|---|---|
| `dropdown_menu_click` | 下拉菜单项点击 |
| `dropdown_icon_click` | 点击下拉图标 |
| `dropdown_menu_clear` | 清空下拉菜单 |
| `show_menu` | 显示菜单 |
| `hide_menu` | 隐藏菜单 |

### 图标事件

| 事件名 | 说明 |
|---|---|
| `icon_click` | 点击图标 |
| `drillmenu_click` | 下钻按钮点击（PivotTable） |

### 键盘事件

| 事件名 | 说明 |
|---|---|
| `keydown` | 键盘按下 |

### 树形展开事件

| 事件名 | 说明 |
|---|---|
| `tree_hierarchy_state_change` | 树形节点展开/收起 |

### 表单控件事件

| 事件名 | 说明 |
|---|---|
| `checkbox_state_change` | checkbox 状态变更 |
| `radio_state_change` | radio 状态变更 |
| `switch_state_change` | switch 状态变更 |
| `button_click` | 按钮点击 |

### 数据变更事件

| 事件名 | 说明 |
|---|---|
| `change_cell_value` | 更改单元格值 |
| `change_cell_values` | 批量更改单元格值（聚合事件） |
| `paste_data` | 粘贴数据 |
| `add_record` | 添加记录 |
| `delete_record` | 删除记录 |
| `update_record` | 更新记录 |

### 图例事件

| 事件名 | 说明 |
|---|---|
| `legend_item_click` | 图例项点击 |
| `legend_item_hover` | 图例项 hover |
| `legend_item_unhover` | 图例项取消 hover |
| `legend_change` | 颜色/尺寸图例变更 |

### 坐标轴事件

| 事件名 | 说明 |
|---|---|
| `mouseenter_axis` | 鼠标进入轴 |
| `mouseleave_axis` | 鼠标离开轴 |

### 迷你图事件

| 事件名 | 说明 |
|---|---|
| `mouseover_chart_symbol` | 鼠标经过迷你图标记 |

### 生命周期事件

| 事件名 | 说明 |
|---|---|
| `before_init` | 初始化前 |
| `initialized` | 初始化完成 |
| `after_render` | 每次渲染完成 |
| `before_update_option` | 更新配置前 |
| `before_set_size` | 设置大小前 |
| `updated` | 更新完成 |

### 空数据提示事件

| 事件名 | 说明 |
|---|---|
| `empty_tip_click` | 空提示点击 |
| `empty_tip_dblclick` | 空提示双击 |

## 常用事件示例

### 单元格点击

```typescript
table.on('click_cell', (args) => {
  const { col, row, cellLocation, originData } = args;
  if (cellLocation === 'body') {
    console.log('点击数据行:', originData);
  }
});
```

### 排序

```typescript
table.on('sort_click', (args) => {
  const { field, order } = args;
  console.log(`排序: ${field} ${order}`);
  // 自定义排序逻辑
});
```

### 编辑完成

```typescript
table.on('change_cell_value', (args) => {
  const { col, row, value, oldValue } = args;
  console.log(`单元格(${col},${row}) 从 ${oldValue} 改为 ${value}`);
});
```

### 滚动加载

```typescript
table.on('scroll_vertical_end', () => {
  // 滚动到底部，加载更多数据
  loadMoreData().then(newRecords => {
    table.addRecords(newRecords);
  });
});
```

### checkbox 状态

```typescript
table.on('checkbox_state_change', (args) => {
  const { col, row, checked } = args;
  console.log(`checkbox(${col},${row}): ${checked}`);
});
```

### VChart 图表事件

```typescript
// 监听嵌入 VChart 的事件（PivotChart 用）
table.onVChartEvent('click', { markName: 'bar' }, (args) => {
  console.log('点击了柱形:', args.datum);
});
```
