# API 方法速查

表格实例方法，通过 `tableInstance.methodName()` 调用。完整文档: `docs/assets/api/zh/methods.md`。

## 生命周期

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateOption` | `(option: TableConstructorOptions) => void` | 全量更新配置并重绘 |
| `renderWithRecreateCells` | `() => void` | 重建单元格并重新渲染（批量配置更新后调用） |
| `release` | `() => void` | **销毁表格实例**（必须调用，释放资源） |

## 数据操作

| 方法 | 签名 | 说明 | 适用表格 |
|---|---|---|---|
| `setRecords` | `(records: any[], option?: { sortState }) => void` | 设置/更新全量数据 | 全部 |
| `addRecord` | `(record: any, recordIndex?: number) => void` | 添加单条数据 | ListTable |
| `addRecords` | `(records: any[], recordIndex?: number) => void` | 添加多条数据 | ListTable |
| `deleteRecords` | `(recordIndexs: number[]) => void` | 删除多条数据 | ListTable |
| `updateRecords` | `(records: any[], recordIndexs: (number\|number[])[]) => void` | 更新多条数据 | ListTable |
| `changeCellValue` | `(col, row, value, workOnEditableCell?) => void` | 更改单个单元格值 | 全部 |
| `changeCellValues` | `(col, row, values[][]) => void` | 批量更改单元格值 | 全部 |
| `setRecordChildren` | `(children, recordIndex) => void` | 树形结构插入子节点 | ListTable |
| `setTreeNodeChildren` | `(children, ...) => void` | 透视表树形插入子节点 | PivotTable |
| `updateFilterRules` | `(filterRules) => void` | 更新数据过滤规则 | ListTable |
| `getFilteredRecords` | `() => any[]` | 获取过滤后的数据 | ListTable |

## 查询

| 方法 | 签名 | 说明 |
|---|---|---|
| `getCellValue` | `(col, row) => string` | 获取单元格**格式化后**的展示值 |
| `getCellOriginValue` | `(col, row) => any` | 获取单元格 format 前的值 |
| `getCellRawValue` | `(col, row) => any` | 获取数据源最原始值（从 records 直取） |
| `getCellStyle` | `(col, row) => CellStyle` | 获取单元格样式对象 |
| `getCellRange` | `(col, row) => CellRange` | 获取单元格合并范围 |
| `getCellRect` | `(col, row) => RectProps` | 获取单元格在表格中的位置 |
| `getCellRelativeRect` | `(col, row) => RectProps` | 获取相对于左上角的位置（含滚动） |
| `getCellHeaderPaths` | `(col, row) => ICellHeaderPaths` | 获取行列表头路径 |
| `getCellHeaderTreeNodes` | `(col, row) => object` | 获取表头树节点（含自定义属性） |
| `getRecordByCell` | `(col, row) => any` | 获取完整数据记录 |
| `getCellOriginRecord` | `(col, row) => any` | 获取源数据项 |
| `getCellOverflowText` | `(col, row) => string` | 获取省略文字全文 |
| `getCellAddress` | `(findRecord, field) => CellAddress` | 根据数据查找地址 (ListTable) |
| `getCellAddressByHeaderPaths` | `(paths) => CellAddress` | 根据表头路径查找地址 (PivotTable) |
| `getBodyColumnDefine` | `(col, row) => ColumnDefine` | 获取列配置定义 |
| `getHeaderField` | `(col, row) => string` | 获取 field / indicatorKey |
| `getAllCells` | `(range?) => CellInfo[]` | 获取所有单元格信息 |
| `getAllBodyCells` | `(range?) => CellInfo[]` | 获取 body 区域单元格 |
| `getAllColumnHeaderCells` | `() => CellInfo[]` | 获取列表头单元格 |
| `getAllRowHeaderCells` | `() => CellInfo[]` | 获取行表头单元格 |

## 索引转换

| 方法 | 说明 | 适用表格 |
|---|---|---|
| `getBodyIndexByTableIndex(col, row)` | 表格行列号 → body 索引 | 全部 |
| `getTableIndexByBodyIndex(col, row)` | body 索引 → 表格行列号 | 全部 |
| `getTableIndexByRecordIndex(recordIndex)` | 数据索引 → 表格行列号 | ListTable |
| `getRecordIndexByCell(col, row)` | 单元格 → 数据索引 | ListTable |
| `getBodyRowIndexByRecordIndex(index)` | 数据索引 → body 行号 | ListTable |
| `getTableIndexByField(field)` | 字段名 → 列号 | ListTable |
| `getRecordShowIndexByCell(col, row)` | 单元格 → body 展示索引 | ListTable |
| `getCellAddrByFieldRecord(field, index)` | 字段+数据索引 → 行列号 | ListTable |

## 选择

| 方法 | 签名 | 说明 |
|---|---|---|
| `selectCell` | `(col, row) => void` | 选中单元格（传空清除） |
| `selectCells` | `(ranges: CellRange[]) => void` | 选中多个区域 |
| `selectRow` | `(row, isShift?, isCtrl?) => void` | 选中整行 |
| `selectCol` | `(col, isShift?, isCtrl?) => void` | 选中整列 |
| `getSelectedCellInfos` | `() => CellInfo[][]` | 获取选中单元格信息 |
| `clearSelected` | `() => void` | 清除选中 |
| `getCopyValue` | `() => string` | 获取选中区域复制内容 |

## 滚动

| 方法 | 签名 | 说明 |
|---|---|---|
| `getScrollTop` | `() => number` | 获取竖向滚动位置 |
| `getScrollLeft` | `() => number` | 获取横向滚动位置 |
| `setScrollTop` | `(top: number) => void` | 设置竖向滚动位置 |
| `setScrollLeft` | `(left: number) => void` | 设置横向滚动位置 |
| `scrollToCell` | `(cellAddr: { col?, row? }) => void` | 滚动到指定单元格 |
| `disableScroll` | `() => void` | 禁用滚动 |
| `enableScroll` | `() => void` | 启用滚动 |

## 编辑

| 方法 | 签名 | 说明 |
|---|---|---|
| `startEditCell` | `(col?, row?, value?) => void` | 开启单元格编辑 |
| `completeEditCell` | `() => void` | 结束编辑（保存） |
| `cancelEditCell` | `() => void` | 取消编辑（不保存） |
| `getEditor` | `(col, row) => IEditor` | 获取单元格编辑器 |

## 树形操作

| 方法 | 说明 | 适用表格 |
|---|---|---|
| `toggleHierarchyState(col, row)` | 切换展开/收起 | 全部 |
| `getHierarchyState(col, row)` | 获取展开状态 | 全部 |
| `expandAllTreeNode()` | 展开所有节点 | ListTable |
| `collapseAllTreeNode()` | 折叠所有节点 | ListTable |
| `expandAllForRowTree()` | 展开行表头所有节点 | PivotTable |
| `collapseAllForRowTree()` | 折叠行表头所有节点 | PivotTable |
| `expandAllForColumnTree()` | 展开列表头所有节点 | PivotTable |
| `collapseAllForColumnTree()` | 折叠列表头所有节点 | PivotTable |

## 布局更新

| 方法 | 说明 | 适用表格 |
|---|---|---|
| `updateColumns(columns)` | 更新列定义 | ListTable |
| `updatePagination(pagination)` | 更新分页 | 全部 |
| `updateTheme(theme)` | 更新主题 | 全部 |
| `updateSortState(sortState)` | 更新排序状态 | ListTable |
| `updateSortRules(sortRules)` | 全量更新排序规则 | PivotTable |
| `updatePivotSortState(state)` | 更新透视排序（仅图标） | PivotTable |
| `setDropDownMenuHighlight(info)` | 设置菜单选中高亮 | 全部 |

## 尺寸

| 方法 | 签名 | 说明 |
|---|---|---|
| `getColWidth` | `(col) => number` | 获取列宽 |
| `getRowHeight` | `(row) => number` | 获取行高 |
| `setColWidth` | `(col, width) => void` | 设置列宽 |
| `setRowHeight` | `(row, height) => void` | 设置行高 |
| `getAllRowsHeight` | `() => number` | 获取所有行总高 |
| `getAllColsWidth` | `() => number` | 获取所有列总宽 |
| `setCanvasSize` | `(w, h) => void` | 设置画布尺寸 |
| `setPixelRatio` | `(ratio) => void` | 设置像素比 |

## 导出

| 方法 | 签名 | 说明 |
|---|---|---|
| `exportImg` | `() => string` | 导出可视区域为 base64 图片 |
| `exportCellImg` | `(col, row, options?) => string` | 导出单个单元格图片 |
| `exportCellRangeImg` | `(range) => string` | 导出单元格区域图片 |

## 事件

| 方法 | 签名 | 说明 |
|---|---|---|
| `on` | `(type, listener) => EventListenerId` | 监听事件 |
| `off` | `(idOrType, listener?) => void` | 移除监听 |
| `onVChartEvent` | `(type, query, listener) => void` | 监听 VChart 事件 |
| `offVChartEvent` | `(type, listener) => void` | 移除 VChart 事件 |

## Checkbox / Radio / Switch 状态

| 方法 | 说明 |
|---|---|
| `getCheckboxState(field?)` | 获取 checkbox 选中状态 |
| `getCellCheckboxState(col, row)` | 获取单元格 checkbox 状态 |
| `setCellCheckboxState(col, row, checked)` | 设置 checkbox 状态 |
| `getRadioState(field?)` | 获取 radio 选中状态 |
| `getCellRadioState(col, row)` | 获取单元格 radio 状态 |
| `setCellRadioState(col, row, index)` | 设置 radio 选中 |
| `getSwitchState(field?)` | 获取 switch 状态 |
| `getCellSwitchState(col, row)` | 获取单元格 switch 状态 |
| `setCellSwitchState(col, row, open)` | 设置 switch 状态 |

## 可视区域查询

| 方法 | 说明 |
|---|---|
| `getBodyVisibleCellRange()` | 获取 body 可见单元格范围 |
| `getBodyVisibleColRange()` | 获取 body 可见列范围 |
| `getBodyVisibleRowRange()` | 获取 body 可见行范围 |
| `cellIsInVisualView(col, row)` | 判断单元格是否完全可见 |
| `getCellAtRelativePosition(x, y)` | 获取坐标处的单元格 |

## 其他

| 方法 | 说明 |
|---|---|
| `getDrawRange()` | 获取实际绘制区域 |
| `showTooltip(col, row, tooltipOptions)` | 显示提示框 |
| `showDropdownMenu(col, row, items)` | 显示下拉菜单 |
| `setLegendSelected(selectedData)` | 设置图例选中 |
| `getChartDatumPosition(...)` | 获取图表图元位置 |
| `registerCustomCellStyle(id, style)` | 注册自定义样式 |
| `arrangeCustomCellStyle(config)` | 分配自定义样式 |
| `setSortedIndexMap(field, map)` | 设置预排序索引 |
| `showMoverLine(col, row)` | 显示移动标记线 |
| `hideMoverLine()` | 隐藏移动标记线 |
| `updateCellContent(col, row)` | 更新单元格内容 |
| `updateCellContentRange(range)` | 更新区域内容 |
| `setTranslate(x, y)` | 设置偏移量 |
| `setLoadingHierarchyState(col, row)` | 设置加载中状态 |
| `getAggregateValuesByField(field)` | 获取聚合值 |
| `isAggregation(col, row)` | 判断是否聚合单元格 |
| `refreshAfterSourceChange()` | 源数据变更后刷新 |
| `getLayoutRowTree()` | 获取行表头树 (PivotTable) |
| `getLayoutColumnTree()` | 获取列表头树 (PivotTable) |
