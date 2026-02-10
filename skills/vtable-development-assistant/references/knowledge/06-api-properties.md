# API 属性速查

表格实例属性，通过 `tableInstance.propertyName` 访问。完整文档: `docs/assets/api/zh/properties.md`。

## 只读属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `records` | `any[]` | 当前表格数据数组（用 `setRecords()` 更新） |
| `options` | `TableConstructorOptions` | 当前表格配置（用 `updateOption()` 更新） |
| `columns` | `ColumnsDefine` | 当前列定义（ListTable，用 `updateColumns()` 更新） |
| `rowCount` | `number` | 表格总行数（含表头） |
| `colCount` | `number` | 表格总列数（含行表头） |
| `rowHeaderLevelCount` | `number` | 行表头层级数 |
| `columnHeaderLevelCount` | `number` | 列表头层级数 |
| `frozenColCount` | `number` | 左侧冻结列数 |
| `frozenRowCount` | `number` | 顶部冻结行数 |
| `rightFrozenColCount` | `number` | 右侧冻结列数 |
| `bottomFrozenRowCount` | `number` | 底部冻结行数 |
| `theme` | `ITableThemeDefine` | 当前主题（用 `updateTheme()` 更新） |
| `pixelRatio` | `number` | 画布像素比（用 `setPixelRatio()` 更新） |
| `rowHierarchyType` | `'grid' \| 'tree'` | 行层次展示方式（PivotTable 只读） |

## 可读写属性

| 属性 | 类型 | 说明 | 注意 |
|---|---|---|---|
| `scrollLeft` | `number` | 横向滚动位置 | 赋值后自动重绘 |
| `scrollTop` | `number` | 纵向滚动位置 | 赋值后自动重绘 |
| `widthMode` | `'standard' \| 'adaptive' \| 'autoWidth'` | 列宽模式 | 赋值后需手动 `renderWithRecreateCells()` |
| `heightMode` | `'standard' \| 'adaptive' \| 'autoHeight'` | 行高模式 | 赋值后需手动 `renderWithRecreateCells()` |
| `autoWrapText` | `boolean` | 自动换行 | 赋值后需刷新 |
| `transpose` | `boolean` | 转置显示 | 赋值后需重建 |

## 属性使用示例

```typescript
const table = new ListTable(options);

// 读取数据
console.log(table.records.length);  // 数据条数
console.log(table.rowCount);         // 总行数
console.log(table.colCount);         // 总列数

// 滚动控制
table.scrollTop = 100;  // 滚动到 100px 位置
table.scrollLeft = 50;

// 修改模式（需手动刷新）
table.widthMode = 'adaptive';
table.renderWithRecreateCells();

// 获取冻结信息
console.log(`冻结 ${table.frozenColCount} 列, ${table.frozenRowCount} 行`);
```
