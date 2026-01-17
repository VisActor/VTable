{{ target: table-methods }}

# Methods

## updateOption(Function)

更新表格配置项，调用后会自动重绘。

```ts
  /**
   * 更新options 目前只支持全量更新
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions, updateConfig?: { clearColWidthCache?: boolean; clearRowHeightCache?: boolean }) => void
```

updateConfig 可以对更新配置项进行控制，默认情况下会清除列宽缓存和行高缓存，如果不需要清除缓存，可以传入{ clearColWidthCache: false, clearRowHeightCache: false }。

如果需要更新单个配置项，请参考下面其他`update**`接口

## updateTheme(Function)

更新表格主题，调用后会自动重绘

```ts
  /**
   * 更新主题
   * @param theme
   */
  updateTheme(theme: ITableThemeDefine) => void
```

使用：

```
tableInstance.updateTheme(newTheme)
```

对应属性更新接口（可参考教程：https://visactor.io/vtable/guide/basic_function/update_option ）:

```
// 调用后不会自动重绘
tableInstance.theme = newTheme;
```

## updateColumns(Function)

更新表格的 columns 字段配置信息，调用后会自动重绘。

**ListTable 专有**

```ts
  /**
   * 更新表格的columns字段配置信息
   * @param columns
   * @param options 配置项(可选)
   * @param options.clearColWidthCache 是否清除调整列宽缓存，默认为 false。当设置为 true 时
   * ，将清除手动调整过宽度的列的宽度缓存，重新分配所有列的宽度
   *
   */
  updateColumns(columns: ColumnsDefine, options?: { clearColWidthCache?: boolean }) => void
```

使用：

```
tableInstance.updateColumns(newColumns)

tableInstance.updateColumns(newColumns, { clearColWidthCache: true })
```

对应属性更新接口（可参考教程：https://visactor.io/vtable/guide/basic_function/update_option ）:

```
// 调用后不会自动重绘
tableInstance.columns = newColumns;
```

## updatePagination(Function)

更新页码配置信息 调用后会自动重绘。

```ts
  /**
   * 更新页码
   * @param pagination 要修改页码的信息
   */
  updatePagination(pagination: IPagination): void;
```

其中类型：

```
/**
 * 分页配置
 */
export interface IPagination {
  /** 数据总条数 透视表中这个数据会自动加上 不需用户传入*/
  totalCount?: number;
  /** 每页显示数据条数  */
  perPageCount: number;
  /** 当前页码 */
  currentPage?: number;
}
```

基本表格和 VTable 数据分析透视表支持分页，透视组合图不支持分页。

注意! 透视表中 perPageCount 会自动修正为指标数量的整数倍。

## renderWithRecreateCells(Function)

重新组织单元格对象树并重新渲染表格，使用场景如：

批量更新多个配置项后的刷新：

```
tableInstance.theme = newThemeObj;
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight;
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells();
```

## release(Function)

销毁表格实例

## on(Function)

监听表格事件，当指定事件触发时执行回调函数。

```ts
/**
 * 监听事件
 * @param type 事件类型，可选值参考 TABLE_EVENT_TYPE
 * @param listener 事件监听器函数
 * @returns 事件监听器ID，可用于off方法移除监听
 */
on<TYPE extends keyof TableEventHandlersEventArgumentMap>(
  type: TYPE,
  listener: TableEventListener<TYPE>
): EventListenerId
```

**参数说明：**

- `type`: 事件类型，如 `'click_cell'`, `'scroll'`, `'selected_cell'` 等
- `listener`: 事件处理函数，接收事件参数对象

**使用示例：**

```javascript
// 监听单元格点击事件
const listenerId = tableInstance.on('click_cell', event => {
  console.log('点击的单元格：', event.col, event.row);
  console.log('单元格数据：', event.value);
});

// 监听滚动事件
tableInstance.on('scroll', event => {
  console.log('滚动位置：', event.scrollLeft, event.scrollTop);
});

// 监听选中状态变化
tableInstance.on('selected_cell', event => {
  console.log('选中的单元格范围：', event.ranges);
});
```

**常用事件类型：**

- `click_cell`: 单元格点击事件
- `dblclick_cell`: 单元格双击事件
- `scroll`: 表格滚动事件
- `selected_cell`: 单元格选中事件
- `selected_clear`: 清除选中事件
- `resize_column`: 列宽调整事件
- `resize_row`: 行高调整事件

**事件参数说明：**

- `click_cell` 事件参数: `{ col: number, row: number, value: any, event: MouseEvent }`
- `scroll` 事件参数: `{ scrollLeft: number, scrollTop: number, event: WheelEvent }`
- `selected_cell` 事件参数: `{ ranges: CellRange[], cells: CellAddress[] }`

## off(Function)

解除监听事件，支持两种方式：通过监听器 ID 或事件类型+监听器函数。

```ts
/**
 * 解除监听事件
 * @param id 事件监听器ID（on方法返回的ID）
 */
off(id: EventListenerId): void;

/**
 * 解除监听事件
 * @param type 事件类型
 * @param listener 事件监听器函数
 */
off(type: string, listener: TableEventListener): void;
```

**参数说明：**

- `id`: 通过 on 方法返回的监听器 ID
- `type`: 事件类型（与 on 方法中的 type 参数对应）
- `listener`: 要移除的事件处理函数

**使用示例：**

```javascript
// 方式1：通过监听器ID移除
const listenerId = tableInstance.on('click_cell', handleClick);
tableInstance.off(listenerId);

// 方式2：通过事件类型和函数移除
function handleClick(event) {
  console.log('单元格被点击');
}
tableInstance.on('click_cell', handleClick);
tableInstance.off('click_cell', handleClick);

// 移除所有指定类型的事件监听器
function handleScroll1(event) {
  /* ... */
}
function handleScroll2(event) {
  /* ... */
}
tableInstance.on('scroll', handleScroll1);
tableInstance.on('scroll', handleScroll2);
// 需要分别移除每个监听器
tableInstance.off('scroll', handleScroll1);
tableInstance.off('scroll', handleScroll2);
```

## onVChartEvent(Function)

监听 VChart 图表事件，用于监听表格中嵌入的图表组件事件。

```ts
/**
 * 监听VChart图表事件
 * @param type 图表事件类型，如 'mouseover', 'click' 等
 * @param callback 事件处理函数
 */
onVChartEvent(type: string, callback: AnyFunction): void;

/**
 * 监听VChart图表事件（带查询条件）
 * @param type 图表事件类型
 * @param query 查询条件对象，用于筛选特定图表元素
 * @param callback 事件处理函数
 */
onVChartEvent(type: string, query: any, callback: AnyFunction): void;
```

**参数说明：**

- `type`: 图表事件类型，如 `'mouseover'`, `'click'`, `'legend_item_click'` 等
- `query`: 可选的查询条件，用于筛选特定的图表元素（如特定的系列、维度等）
- `callback`: 事件处理函数，接收图表事件参数

**使用示例：**

```javascript
// 监听图表鼠标悬停事件
tableInstance.onVChartEvent('mouseover', event => {
  console.log('鼠标悬停在图表上:', event);
});

// 监听特定系列的点击事件
tableInstance.onVChartEvent('click', { seriesId: 'series1' }, event => {
  console.log('点击了series1:', event.data);
});

// 监听图例项点击事件
tableInstance.onVChartEvent('legend_item_click', event => {
  console.log('图例项被点击:', event.item);
});
```

## offVChartEvent(Function)

解除监听 VChart 图表事件。

```ts
/**
 * 解除VChart图表事件监听
 * @param type 图表事件类型
 * @param callback 要移除的事件处理函数（可选）
 */
offVChartEvent(type: string, callback?: AnyFunction): void;
```

**参数说明：**

- `type`: 图表事件类型
- `callback`: 要移除的具体事件处理函数。如果不传，则移除该类型下的所有监听器

**使用示例：**

```javascript
// 定义事件处理函数
function handleChartClick(event) {
  console.log('图表被点击:', event);
}

// 添加监听
tableInstance.onVChartEvent('click', handleChartClick);

// 移除指定监听函数
tableInstance.offVChartEvent('click', handleChartClick);

// 移除某类型的所有监听函数
tableInstance.offVChartEvent('mouseover');
```

## setRecords(Function)

设置表格数据接口，可作为更新接口调用。

基本表格更新：

基本表格可同时设置排序状态对表格数据排序，sortState 设置为 null 清空当前的排序状态，如果不设置则按当前排序状态对传入数据排序。如果是禁用内部排序的场景，请务必在调用该接口前清空当前的排序状态。

```
setRecords(
    records: Array<any>,
    option?: { sortState?: SortState | SortState[] | null }
  ): void;
```

透视表更新：

```
setRecords(records: Array<any>)
```

## setRecordChildren(Function)

**ListTable 专有**

基本表格树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用

```
  /**
   * @param records 设置到单元格其子节点的数据
   * @param col 需要设置子节点的单元格地址
   * @param row  需要设置子节点的单元格地址
   * @param recalculateColWidths  添加数据后是否重新计算列宽 默认为true.（设置width:auto或者 autoWidth 情况下才有必要考虑该参数）
   */
  setRecordChildren(records: any[], col: number, row: number, recalculateColWidths: boolean = true)
```

## setTreeNodeChildren(Function)

**PivotTable 专有**

透视表格树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用。节点数据懒加载可以参考 demo：https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load

```
  /**
   * 树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用
   * @param children 设置到该单元格的子节点
   * @param records 该节点展开后新增数据
   * @param col 需要设置子节点的单元格地址
   * @param row  需要设置子节点的单元格地址
   */
  setTreeNodeChildren(children: IHeaderTreeDefine[], records: any[], col: number, row: number)
```

## getDrawRange(Function)

获取表格实际绘制内容区域的 boundRect 的值，返回表格内容在画布上的实际位置和尺寸信息。

```ts
/**
 * 获取表格实际绘制内容区域的boundRect值
 * @returns 返回包含边界信息的对象
 */
getDrawRange(): Rect
```

**返回值说明：**
返回一个包含边界信息的对象，结构如下：

```javascript
{
    "bounds": {
        "x1": 1,      // 左边界坐标
        "y1": 1,      // 上边界坐标
        "x2": 1581,   // 右边界坐标
        "y2": 361     // 下边界坐标
    },
    left: 1,      // 左边界
    top: 1,       // 上边界
    right: 1581,  // 右边界
    bottom: 361,  // 下边界
    width: 1580,  // 内容宽度
    height: 360   // 内容高度
}
```

**使用场景：**

- 获取表格内容的确切位置和尺寸
- 计算表格内容在画布上的布局
- 用于自定义绘制或覆盖层的定位

## selectCell(Function)

选中某个单元格。如果传空，则清除当前选中高亮状态。

```
   /**
   * 选中单元格  和鼠标选中单元格效果一致
   * @param col
   * @param row
   * @param isShift 是否按住 shift 键
   * @param isCtrl 是否按住 ctrl 键
   * @param makeSelectCellVisible 是否让选中的单元格可见
   * @param skipBodyMerge 是否忽略合并单元格，默认 false针对合并单元自动扩大选取范围
   */
  selectCell(col: number, row: number, isShift?: boolean, isCtrl?: boolean, makeSelectCellVisible?: boolean,skipBodyMerge?: boolean): void
```

## selectCells(Function)

选中一个或者多个单元格区域

```
  /**
   * 选中单元格区域，可设置多个区域同时选中
   * @param cellRanges: CellRange[]
   */
  selectCells(cellRanges: CellRange[]): void
```

其中：
{{ use: CellRange() }}

## selectRow(Function)

选中整行，支持单选、多选和范围选择模式。

```ts
/**
 * 选中整行
 * @param rowIndex 行索引（从0开始）
 * @param isCtrl 是否按住Ctrl键，用于多选模式
 * @param isShift 是否按住Shift键，用于范围选择模式
 */
selectRow(rowIndex: number, isCtrl?: boolean, isShift?: boolean): void
```

**参数说明：**

- `rowIndex`: 要选中的行索引，从 0 开始
- `isCtrl`: 是否使用 Ctrl 键多选模式。为 true 时，保留之前的选择并添加新行
- `isShift`: 是否使用 Shift 键范围选择模式。为 true 时，从上次选择扩展到当前行

**使用示例：**

```javascript
// 单选一行（会清除之前的选择）
tableInstance.selectRow(2);

// Ctrl+点击效果：多选行
tableInstance.selectRow(2, true); // 选中第3行
tableInstance.selectRow(5, true); // 保持第3行选中，同时选中第6行

// Shift+点击效果：范围选择
tableInstance.selectRow(2); // 先选中第3行
tableInstance.selectRow(5, false, true); // 选中第3行到第6行的所有行
```

## selectCol(Function)

选中整列，支持单选、多选和范围选择模式。

```ts
/**
 * 选中整列
 * @param colIndex 列索引（从0开始）
 * @param isCtrl 是否按住Ctrl键，用于多选模式
 * @param isShift 是否按住Shift键，用于范围选择模式
 */
selectCol(colIndex: number, isCtrl?: boolean, isShift?: boolean): void
```

**参数说明：**

- `colIndex`: 要选中的列索引，从 0 开始
- `isCtrl`: 是否使用 Ctrl 键多选模式。为 true 时，保留之前的选择并添加新列
- `isShift`: 是否使用 Shift 键范围选择模式。为 true 时，从上次选择扩展到当前列

**使用示例：**

```javascript
// 单选一列（会清除之前的选择）
tableInstance.selectCol(1);

// Ctrl+点击效果：多选列
tableInstance.selectCol(1, true); // 选中第2列
tableInstance.selectCol(3, true); // 保持第2列选中，同时选中第4列

// Shift+点击效果：范围选择
tableInstance.selectCol(1); // 先选中第2列
tableInstance.selectCol(3, false, true); // 选中第2列到第4列的所有列
```

## getSelectedCellInfos(Function)

获取已选中的单元格信息，返回结果是二维数组，第一层数组项代表一行，第二层数组每一项即代表该行的一个单元格信息。

```
  /**获取选中区域的每个单元格详情 */
  getSelectedCellInfos(): CellInfo[][] | null;
```

{{ use: CellInfo() }}

## clearSelected(Function)

清除所有单元格的选中状态，等同于调用 `selectCell()` 不传参数。

```ts
/**
 * 清除所有单元格的选中状态
 */
clearSelected(): void
```

**使用示例：**

```javascript
// 选中一些单元格
tableInstance.selectCell(2, 3);
tableInstance.selectRow(5, true);

// 清除所有选中状态
tableInstance.clearSelected();

// 验证是否已清除
const selectedInfos = tableInstance.getSelectedCellInfos();
console.log(selectedInfos); // null
```

**相关方法：**

- `selectCell()`: 选中单个单元格
- `selectCells()`: 选中多个单元格区域
- `getSelectedCellInfos()`: 获取当前选中的单元格信息

## getBodyColumnDefine(Function)

通过索引获取表列配置

```
  /**
   * 通过索引获取表列配置
   */
  getBodyColumnDefine(col: number, row: number): ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber;

```

## getCopyValue(Function)

获取选中区域的内容 作为复制内容。返回值是个字符串，以`\t`分割单元格，以`\n`分割行。

## getCellValue(Function)

获取单元格展示值，返回格式化后的显示值。如果在 customMergeCell 函数中使用，需要传入 skipCustomMerge 参数，否则会导致报错。

```ts
/**
 * 获取单元格展示值
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @param skipCustomMerge 是否跳过自定义合并单元格逻辑，默认为false
 * @returns 返回格式化后的单元格显示值
 */
getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData;
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数
- `skipCustomMerge`: 是否跳过自定义合并单元格逻辑，在 customMergeCell 函数中使用时需要设置为 true

**返回值说明：**

- 返回格式化后的单元格显示值（字符串或数字）
- 如果单元格不存在或为空，可能返回 null 或 undefined

**使用示例：**

```javascript
// 获取第3行第2列的单元格显示值
const cellValue = tableInstance.getCellValue(1, 2);
console.log('单元格显示值:', cellValue);

// 在自定义合并单元格函数中使用
function customMergeCell(col, row) {
  const value = tableInstance.getCellValue(col, row, true); // 必须传true
  // ...自定义合并逻辑
}
```

**注意事项：**

- 返回的是经过格式化的显示值，不是原始数据
- 如需获取原始数据，请使用 getCellOriginValue 或 getCellRawValue 方法

## getCellOriginValue(Function)

获取单元格展示数据的 format 前的原始值，即未经过格式化函数处理的原始数据值。

```ts
/**
 * 获取单元格展示数据的format前的值
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @returns 返回未经格式化的原始数据值
 */
getCellOriginValue(col: number, row: number): FieldData;
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数

**返回值说明：**

- 返回未经格式化的原始数据值
- 与 getCellValue()不同，此值未经过列配置中的 format 函数处理

**使用示例：**

```javascript
// 获取第3行第2列的原始数据值
const originValue = tableInstance.getCellOriginValue(1, 2);
console.log('原始数据值:', originValue);

// 对比格式化前后的值
const displayValue = tableInstance.getCellValue(1, 2); // 格式化后的显示值
const originValue = tableInstance.getCellOriginValue(1, 2); // 原始数据值
console.log('显示值:', displayValue, '原始值:', originValue);
```

**与相关方法的区别：**

- `getCellValue()`: 返回格式化后的显示值
- `getCellOriginValue()`: 返回格式化前的原始值
- `getCellRawValue()`: 返回数据源中最原始的值（包括嵌套数据）

## getCellRawValue(Function)

获取单元格展示数据源最原始值，即从数据源 records 中直接获取的未经任何处理的最原始数据。

```ts
/**
 * 获取单元格展示数据源最原始值
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @returns 返回数据源中最原始的值
 */
getCellRawValue(col: number, row: number): FieldData;
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数

**返回值说明：**

- 返回从数据源 records 中直接获取的最原始数据
- 对于嵌套数据结构，返回完整的嵌套对象
- 不受任何格式化或转换函数影响

**使用示例：**

```javascript
// 获取第3行第2列的最原始数据值
const rawValue = tableInstance.getCellRawValue(1, 2);
console.log('最原始数据值:', rawValue);

// 三种值获取方式的对比
const displayValue = tableInstance.getCellValue(1, 2); // 格式化显示值: "$1,234.56"
const originValue = tableInstance.getCellOriginValue(1, 2); // 原始数据值: 1234.56
const rawValue = tableInstance.getCellRawValue(1, 2); // 最原始值: { price: 1234.56, currency: "USD" }
```

**适用场景：**

- 需要访问完整的数据对象结构
- 进行数据调试和验证
- 获取嵌套数据对象的特定属性

## getCellStyle(Function)

获取某个单元格的样式对象，包含该单元格的所有样式属性。

```ts
/**
 * 获取某个单元格的样式 供业务方调用
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @returns 返回单元格样式对象
 */
getCellStyle(col: number, row: number): CellStyle
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数

**返回值说明：**
返回一个包含单元格所有样式属性的对象，可能包含：

- `color`: 文字颜色
- `bgColor`: 背景颜色
- `fontSize`: 字体大小
- `fontFamily`: 字体族
- `textAlign`: 文本对齐方式
- `textBaseline`: 文本基线
- `lineHeight`: 行高
- `fontWeight`: 字体粗细
- 等其他样式属性

**使用示例：**

```javascript
// 获取第3行第2列的单元格样式
const cellStyle = tableInstance.getCellStyle(1, 2);
console.log('单元格样式:', cellStyle);

// 根据样式做条件判断
const style = tableInstance.getCellStyle(col, row);
if (style.bgColor === '#ff0000') {
  console.log('该单元格背景为红色');
}
```

**注意事项：**

- 返回的是计算后的最终样式，包括主题、列配置、单元格自定义样式等的合并结果
- 如果单元格没有特殊样式，返回默认样式对象

## getRecordByCell(Function)

根据行列号获取该单元格对应的完整数据记录。对于不同类型的表格，返回的数据结构有所不同。

```ts
/**
 * 根据行列号获取整条数据记录
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @return {object} ListTable返回单条记录对象，PivotTable返回记录数组
 */
getRecordByCell(col: number, row: row): any | any[]
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数

**返回值说明：**

- **ListTable**: 返回该单元格对应的单条数据记录（对象）
- **PivotTable**: 返回该单元格对应的记录数组（因为透视表单元格可能包含多条聚合数据）
- **表头单元格**: 可能返回 null 或表头相关信息

**使用示例：**

```javascript
// ListTable示例
const record = tableInstance.getRecordByCell(1, 2);
console.log('该单元格的数据记录:', record);
// 输出: { name: "张三", age: 25, department: "技术部" }

// PivotTable示例
const records = tableInstance.getRecordByCell(1, 2);
console.log('该单元格的数据记录数组:', records);
// 输出: [{ product: "手机", sales: 1000 }, { product: "电脑", sales: 500 }]

// 访问记录中的特定字段
const record = tableInstance.getRecordByCell(col, row);
if (record && record.name) {
  console.log('姓名:', record.name);
}
```

**注意事项：**

- 对于 ListTable，返回的是单条数据对象
- 对于 PivotTable，返回的是数据数组（因为透视表单元格可能聚合了多条数据）
- 如果指定的行列号超出范围，可能返回 null 或 undefined
- 表头单元格返回的数据结构与数据单元格不同

## getBodyIndexByTableIndex(Function)

根据表格单元格的行列号 获取在 body 部分的列索引及行索引

```
  /** 根据表格单元格的行列号 获取在body部分的列索引及行索引 */
  getBodyIndexByTableIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByBodyIndex(Function)

根据 body 部分的列索引及行索引，获取单元格的行列号

```
  /** 根据body部分的列索引及行索引，获取单元格的行列号 */
  getTableIndexByBodyIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByRecordIndex(Function)

根据数据源的 index 获取显示到表格中的 index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。

**ListTable 专有**

```
  /**
   * 根据数据源的index 获取显示到表格中的index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。

   注：ListTable特有接口
   * @param recordIndex
   */
  getTableIndexByRecordIndex: (recordIndex: number) => number;
```

## getRecordIndexByCell(Function)

获取当前单元格的数据是数据源中的第几条。

如果是树形模式的表格，将返回数组，如[1,2] 数据源中第 2 条数据中 children 中的第 3 条。

**ListTable 专有**

```
  /** 获取当前单元格的数据是数据源中的第几条。
   * 如果是树形模式的表格，将返回数组，如[1,2] 数据源中第2条数据中children中的第3条
   * 注：ListTable特有接口 */
  getRecordIndexByCell(col: number, row: number): number | number[]
**ListTable 专有**
```

## getBodyRowIndexByRecordIndex(Function)

根据数据的索引获取应该显示在 body 的第几行, 参数和返回值的索引均从 0 开始。如果是树形模式的表格，参数支持数组，如[1,2]

**ListTable 专有**

```
  /**
   * 根据数据的索引获取应该显示在body的第几行  参数和返回值的索引均从0开始
   * @param  {number} index The record index.
   */
  getBodyRowIndexByRecordIndex: (index: number | number[]) => number;
```

## getTableIndexByField(Function)

根据数据源的 field 获取显示到表格中的 index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。

**ListTable 专有**

```
  /**
   * 根据数据源的field 获取显示到表格中的index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。注：ListTable特有接口
   * @param recordIndex
   */
  getTableIndexByField: (field: FieldDef) => number;
```

## getRecordShowIndexByCell(Function)

获取当前单元格数据在 body 部分的索引，即通过行列号去除表头层级数的索引（与转置相关，非转置获取的是 body 行号，转置表获取的是 body 列号）。

**ListTable 专有**

```
  /** 获取当前单元格在body部分的展示索引，即（ row / col ）- headerLevelCount。注：ListTable特有接口 */
  getRecordShowIndexByCell(col: number, row: number): number
```

## getCellAddrByFieldRecord(Function)

根据数据源中的 index 和 field 获取单元格行列号。

注：ListTable 特有接口

```
  /**
   * 根据数据源中的index和field获取单元格行列号。注：ListTable特有接口
   * @param field
   * @param recordIndex
   * @returns
   */
  getCellAddrByFieldRecord: (field: FieldDef, recordIndex: number) => CellAddress;
```

## getCellOriginRecord(Function)

获取该单元格的源数据项。

如果是普通表格，会返回源数据的对象。

如果是透视分析表（开启了数据分析的透视表），会返回源数据的数组。

```
  /**
   * 根据行列号获取源数据
   * @param  {number} col col index.
   * @param  {number} row row index.
   * @return {object} record or record array.  ListTable return one record, PivotTable return an array of records.
   */
  getCellOriginRecord(col: number, row: number)
```

## getAllCells(Function)

获取所有单元格上下文信息

```
  /**
   * 获取所有单元格数据信息
   * @param colMaxCount 限制获取最多列数
   * @param rowMaxCount 限制获取最多行数
   * @returns CellInfo[][]
   */
  getAllCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllBodyCells(Function)

获取所有 body 单元格上下文信息

```
  /**
   * 获取所有body单元格上下文信息
   * @param colMaxCount 限制获取最多列数
   * @param rowMaxCount 限制获取最多行数
   * @returns CellInfo[][]
   */
  getAllBodyCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllColumnHeaderCells(Function)

获取所有列表头单元格上下文信息

```
  /**
   * 获取所有列表头单元格数据信息
   * @returns CellInfo[][]
   */
  getAllColumnHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllRowHeaderCells(Function)

获取所有行表头单元格上下文信息

```
  /**
   * 获取所有行表头单元格上下文信息
   * @returns CellInfo[][]
   */
  getAllRowHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getCellOverflowText(Function)

获取有省略文字的的单元格文本内容

```
  /**
   * 获取有省略文字的的单元格文本内容
   * cellTextOverflows存储了无法显示全文本的value，供toolTip使用
   * @param  {number} col column index.
   * @param  {number} row row index
   * @return {string | null}
   */
  getCellOverflowText(col: number, row: number) => string | null
```

## getCellRect(Function)

获取单元格在整张表格中的具体位置。

```
 /**
   * 获取单元格的范围 返回值为Rect类型。不考虑是否为合并单元格的情况，坐标从0开始
   * @param {number} col column index
   * @param {number} row row index
   * @returns {Rect}
   */
  getCellRect(col: number, row: number): Rect
```

## getCellRelativeRect(Function)

获取单元格在整张表格中的具体位置。相对位置是基于表格左上角（滚动情况减去滚动值）

```
  /**
   * 获取的位置是相对表格显示界面的左上角 情况滚动情况 如单元格已经滚出表格上方 则这个单元格的y将为负值
   * @param {number} col index of column, of the cell
   * @param {number} row index of row, of the cell
   * @returns {Rect} the rect of the cell.
   */
  getCellRelativeRect(col: number, row: number): Rect
```

## getCellRange(Function)

获取单元格的合并范围

```
 /**
   * @param {number} col column index
   * @param {number} row row index
   * @returns {Rect}
*/
getCellRange(col: number, row: number): CellRange

export interface CellRange {
  start: CellAddress;
  end: CellAddress;
}

export interface CellAddress {
  col: number;
  row: number;
}
```

## getCellHeaderPaths(Function)

获取行列表头的路径

```
  /**
   * 获取行列表头的路径
   * @param col
   * @param row
   * @returns ICellHeaderPaths
   */
  getCellHeaderPaths(col: number, row: number)=> ICellHeaderPaths
```

{{ use: ICellHeaderPaths() }}

## getCellRowHeaderFullPaths(Function)

获取行表头全路径

解决 getCellHeaderPaths 接口在有合并单元格的情况，获取不到正确的行表头路径的问题。

**PivotTable 专有**

```
  /**
   * 获取行表头全路径
   * @param col
   * @returns
   */
  getCellRowHeaderFullPaths(col: number) => IDimensionInfo[]
```

## getCellHeaderTreeNodes(Function)

根据行列号获取表头 tree 节点，包含了用户在自定义树 rowTree 及 columnTree 树上的自定义属性（也是内部布局树的节点，获取后请不要随意修改）。一般情况下用 getCellHeaderPaths 即可。

```
  /**
   * 根据行列号获取表头tree节点，包含了用户在自定义树rowTree及columnTree树上的自定义属性（也是内部布局树的节点，获取后请不要随意修改）
   * @param col
   * @param row
   * @returns ICellHeaderPaths
   */
  getCellHeaderTreeNodes(col: number, row: number)=> ICellHeaderPaths
```

## getCellAddress(Function)

根据数据和 field 属性字段名称获取 body 中某条数据的行列号。目前仅支持基本表格 ListTable

```
  /**
   * 方法适用于获取body中某条数据的行列号
   * @param findTargetRecord 通过数据对象或者指定函数来计算数据条目index
   * @param field
   * @returns
   */
  getCellAddress(findTargetRecord: any | ((record: any) => boolean), field: FieldDef) => CellAddress
```

## getCellAddressByHeaderPaths(Function)

针对透视表格的接口，根据要匹配表头维度路径来获取具体的单元格地址

```
  /**
   * 通过表头的维度值路径来计算单元格位置
   * @param dimensionPaths
   * @returns
   */
  getCellAddressByHeaderPaths(
    dimensionPaths:
      | {
          colHeaderPaths: IDimensionInfo[];
          rowHeaderPaths: IDimensionInfo[];
        }
      | IDimensionInfo[]
  )=> CellAddress
```

## getScrollTop(Function)

获取当前竖向滚动位置，返回表格内容在垂直方向上的滚动距离。

```ts
/**
 * 获取当前竖向滚动位置
 * @returns 垂直滚动距离（像素值）
 */
getScrollTop(): number
```

**返回值说明：**

- 返回表格内容在垂直方向上的滚动距离，单位为像素
- 如果表格未发生垂直滚动，返回 0

**使用示例：**

```javascript
const scrollTop = tableInstance.getScrollTop();
console.log('当前垂直滚动位置:', scrollTop, 'px');

// 监听滚动事件获取滚动位置
tableInstance.on('scroll', event => {
  console.log('垂直滚动位置:', tableInstance.getScrollTop());
  console.log('水平滚动位置:', tableInstance.getScrollLeft());
});
```

## getScrollLeft(Function)

获取当前横向滚动位置，返回表格内容在水平方向上的滚动距离。

```ts
/**
 * 获取当前横向滚动位置
 * @returns 水平滚动距离（像素值）
 */
getScrollLeft(): number
```

**返回值说明：**

- 返回表格内容在水平方向上的滚动距离，单位为像素
- 如果表格未发生水平滚动，返回 0

**使用示例：**

```javascript
const scrollLeft = tableInstance.getScrollLeft();
console.log('当前水平滚动位置:', scrollLeft, 'px');
```

## setScrollTop(Function)

设置竖向滚动位置，会立即更新渲染界面使指定位置的内容显示在可视区域内。

```ts
/**
 * 设置竖向滚动位置（会更新渲染界面）
 * @param scrollTop 垂直滚动距离（像素值）
 */
setScrollTop(scrollTop: number): void
```

**参数说明：**

- `scrollTop`: 要设置的垂直滚动距离，单位为像素
- 有效值范围：0 到 (表格总高度 - 可视区域高度)

**使用示例：**

```javascript
// 滚动到顶部
tableInstance.setScrollTop(0);

// 滚动到指定位置（例如200像素）
tableInstance.setScrollTop(200);

// 滚动到底部
const totalHeight = tableInstance.getAllRowsHeight();
const visibleHeight = tableInstance.getDrawRange().height;
tableInstance.setScrollTop(totalHeight - visibleHeight);
```

**注意事项：**

- 设置后会立即更新渲染界面
- 如果设置的值超出范围，会自动调整到有效范围内

## setScrollLeft(Function)

设置横向滚动位置，会立即更新渲染界面使指定位置的内容显示在可视区域内。

```ts
/**
 * 设置横向滚动位置（会更新渲染界面）
 * @param scrollLeft 水平滚动距离（像素值）
 */
setScrollLeft(scrollLeft: number): void
```

**参数说明：**

- `scrollLeft`: 要设置的水平滚动距离，单位为像素
- 有效值范围：0 到 (表格总宽度 - 可视区域宽度)

**使用示例：**

```javascript
// 滚动到最左侧
tableInstance.setScrollLeft(0);

// 滚动到指定位置（例如300像素）
tableInstance.setScrollLeft(300);

// 滚动到最右侧
const totalWidth = tableInstance.getAllColsWidth();
const visibleWidth = tableInstance.getDrawRange().width;
tableInstance.setScrollLeft(totalWidth - visibleWidth);
```

**注意事项：**

- 设置后会立即更新渲染界面
- 如果设置的值超出范围，会自动调整到有效范围内

## scrollToCell(Function)

滚动到具体某个单元格位置。
col 或者 row 可以为空，为空的话也就是只移动 x 方向或者 y 方向。

```
  /**
   * 滚动到具体某个单元格位置
   * @param cellAddr 要滚动到的单元格位置
   */
  scrollToCell(cellAddr: { col?: number; row?: number })=>void
```

## toggleHierarchyState(Function)

树形展开收起状态切换

```
 /**
   * 表头切换层级状态
   * @param col
   * @param row
   * @param recalculateColWidths  是否重新计算列宽 默认为true.（设置width:auto或者 autoWidth 情况下才有必要考虑该参数）
   */
  toggleHierarchyState(col: number, row: number,recalculateColWidths: boolean = true)
```

## getHierarchyState(Function)

获取某个单元格树形展开 or 收起状态

```
  /**
   * 获取层级节点收起展开的状态
   * @param col
   * @param row
   * @returns
   */
  getHierarchyState(col: number, row: number) : HierarchyState | null;

enum HierarchyState {
  expand = 'expand',
  collapse = 'collapse',
  none = 'none'
}
```

## getLayoutRowTree(Function)

**PivotTable 专有**

获取表格行头树形结构

```
  /**
   * 获取表格行树状结构
   * @returns
   */
  getLayoutRowTree() : LayouTreeNode[]
```

## getLayoutRowTreeCount(Function)

**PivotTable 专有**

获取表格行头树形结构的占位的总节点数。

注意：逻辑中区分了平铺和树形层级结构

```
  /**
   * 获取表格行头树形结构的占位的总节点数。
   * @returns
   */
  getLayoutRowTreeCount() : number
```

## getLayoutColumnTree(Function)

**PivotTable 专有**

获取表格列头树形结构

```
  /**
   * 获取表格列头树状结构
   * @returns
   */
  getLayoutColumnTree() : LayouTreeNode[]
```

## getLayoutColumnTreeCount(Function)

**PivotTable 专有**

获取表格列头树形结构的占位的总节点数。

```
  /**
   * 获取表格列头树形结构的占位的总节点数。
   * @returns
   */
  getLayoutColumnTreeCount() : number
```

## updateSortState(Function)

更新排序状态，ListTable 专有

```
  /**
   * 更新排序状态
   * @param sortState 要设置的排序状态
   * @param executeSort 是否执行内部排序逻辑，设置false将只更新图标状态
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)
```

## updateSortRules(Function)

透视表更新排序规则，PivotTable 专有

```
  /**
   * 全量更新排序规则
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules)
```

## updatePivotSortState(Function)

更新排序状态，vtable 本身不执行排序逻辑。PivotTable 专有。

```
  /**
   * 更新排序状态
   * @param pivotSortStateConfig.dimensions 排序状态维度对应关系；pivotSortStateConfig.order 排序状态
   */
  updatePivotSortState(pivotSortStateConfig: {
      dimensions: IDimensionInfo[];
      order: SortOrder;
    }[])
```

更新后不会主动重绘表格，需要配置接口 renderWithRecreateCells 刷新

## setDropDownMenuHighlight(Function)

设置下拉菜单选中状态, 同时单元格中也会显示对应的 icon

```
  setDropDownMenuHighlight(dropDownMenuInfo: DropDownMenuHighlightInfo[]): void
```

## showTooltip(Function)

显示 tooltip 信息提示框

```
  /**
   * 显示tooltip信息提示框
   * @param col 显示提示框的单元格的列号
   * @param row 显示提示框的单元格的行号
   * @param tooltipOptions tooltip的内容配置
   */
  showTooltip(col: number, row: number, tooltipOptions?: TooltipOptions) => void
```

注意：暂时只支持全局设置了 tooltip.renderMode='html'，调用该接口才有效。

如果想要 tooltip 可以被鼠标 hover 上去，需要配置接口 tooltip.disappearDelay，让其不立即消失。

其中 TooltipOptions 类型为：

```
/** 显示弹出提示内容 */
export type TooltipOptions = {
  /** tooltip内容 */
  content: string;
  /** tooltip框的位置 优先级高于referencePosition */
  position?: { x: number; y: number };
  /** tooltip框的参考位置 如果设置了position则该配置不生效 */
  referencePosition?: {
    /** 参考位置设置为一个矩形边界 设置placement来指定处于边界位置的方位*/
    rect: RectProps;
    /** 指定处于边界位置的方位  */
    placement?: Placement;
  };
  /** 需要自定义样式指定className dom的tooltip生效 */
  className?: string;
  /** 设置tooltip的样式 */
  style?: {
    bgColor?: string;
    font?: string;
    color?: string;
    padding?: number[];
    arrowMark?: boolean;
  };
  /** 设置tooltip的消失时间 */
  disappearDelay?: number;
};

```

## showDropdownMenu(Function)

显示下拉菜单，显示内容可以为 option 中已经设置好的菜单项, 或者显示指定 dom 内容。使用[demo](../demo/component/dropdown)

```
  /**
   * 显示下拉菜单
   * @param col 显示下拉菜单的单元格的列号
   * @param row 显示下拉菜单的单元格的行号
   * @param menuOptions 下拉菜单的内容配置
   */
  showDropdownMenu(col: number, row: number, menuOptions?: DropDownMenuOptions) => void;

  /** 显示下拉菜单设置项 或者显示指定dom内容 */
  export type DropDownMenuOptions = {
    // menuList?: MenuListItem[];
    content: HTMLElement | MenuListItem[];
    position?: { x: number; y: number };
    referencePosition?: {
      rect: RectProps;
      /** 目前下拉菜单右对齐icon，指定位置暂未实现  */
      placement?: Placement;
    };
  };
```

## updateFilterRules(Function)

更新数据过滤规则

```
/** 更新数据过滤规则 */
updateFilterRules(filterRules: FilterRules) => void
```

use case: 对于透视图的场景上，点击图例项后 更新过滤规则 来更新图表

透视表 PivotTable 该接口的签名如下：

```
  /**
   * 更新数据过滤规则 对应dataConfig中filterRules配置格式
   * @param filterRules 过滤规则
   * @param isResetTree 是否重置表头树结构。 当为true时，会重置表头树结构，当为false时，表头树结构维持不变
   */
  updateFilterRules(filterRules: FilterRules, isResetTree: boolean = false) => void
```

## getFilteredRecords(Function)

获取过滤后的数据

**ListTable、PivotTable 专有**

## setLegendSelected(Function)

设置图例的选择状态。

注意：设置完后如过需要同步图表的状态需要配合 updateFilterRules 接口使用

```
/** 设置图例的选择状态。设置完后同步图表的状态需要配合updateFilterRules接口使用 */
  setLegendSelected(selectedData: (string | number)[])
```

## getChartDatumPosition(Function)

获取图表上某一个图元的位置

```
/**
   * 获取图表上某一个图元的位置
   * @param datum 图元对应的数据
   * @param cellHeaderPaths 单元格的header路径
   * @returns 图元在整个表格上的坐标位置（相对表格左上角视觉坐标）
   */
  getChartDatumPosition(datum:any,cellHeaderPaths:IPivotTableCellHeaderPaths): {x:number,y:number}
```

## exportImg(Function)

导出表格中当前可视区域的图片，返回 base64 编码的图片字符串。

```ts
/**
 * 导出表格中当前可视区域的图片
 * @returns base64编码的图片字符串
 */
exportImg(): string
```

**返回值说明：**

- 返回当前可视区域表格内容的 base64 编码图片字符串
- 图片格式为 PNG
- 只包含当前可视区域内的表格内容

**使用示例：**

```javascript
// 导出当前可视区域的图片
const base64Image = tableInstance.exportImg();
console.log('导出的base64图片:', base64Image);

// 创建图片元素显示导出的图片
const img = document.createElement('img');
img.src = base64Image;
document.body.appendChild(img);

// 下载图片
const link = document.createElement('a');
link.download = 'table-screenshot.png';
link.href = base64Image;
link.click();
```

**注意事项：**

- 只导出当前可视区域的内容，不包括滚动隐藏的部分
- 返回的 base64 字符串可以直接用作图片的 src 属性
- 图片质量取决于当前表格的渲染设置和像素比

## exportCellImg(Function)

导出指定单元格的图片，可以控制是否包含背景和边框。

```ts
/**
 * 导出某个单元格图片
 * @param col 列索引（从0开始）
 * @param row 行索引（从0开始）
 * @param options 导出选项配置
 * @returns base64编码的图片字符串
 */
exportCellImg(col: number, row: number, options?: { disableBackground?: boolean; disableBorder?: boolean }): string
```

**参数说明：**

- `col`: 列索引，从 0 开始计数
- `row`: 行索引，从 0 开始计数
- `options`: 可选的导出配置
  - `disableBackground`: 是否禁用背景，默认为 false
  - `disableBorder`: 是否禁用边框，默认为 false

**返回值说明：**

- 返回指定单元格的 base64 编码图片字符串
- 图片格式为 PNG

**使用示例：**

```javascript
// 导出单个单元格图片（包含背景和边框）
const cellImage = tableInstance.exportCellImg(1, 2);

// 导出单元格图片（不包含背景）
const cellImageNoBg = tableInstance.exportCellImg(1, 2, {
  disableBackground: true
});

// 导出单元格图片（不包含边框）
const cellImageNoBorder = tableInstance.exportCellImg(1, 2, {
  disableBorder: true
});

// 导出单元格图片（只包含文字内容）
const cellImageContentOnly = tableInstance.exportCellImg(1, 2, {
  disableBackground: true,
  disableBorder: true
});
```

**注意事项：**

- 可以精确控制导出图片的样式元素
- 适用于需要将单元格内容嵌入到其他文档或报告中的场景
- 返回的 base64 字符串可以直接用作图片的 src 属性

## exportCellRangeImg(Function)

导出指定单元格区域的图片，支持导出多个连续单元格组成的矩形区域。

```ts
/**
 * 导出某一片区域的图片
 * @param cellRange 要导出的单元格区域范围
 * @returns base64编码的图片字符串
 */
exportCellRangeImg(cellRange: CellRange): string
```

**参数说明：**

- `cellRange`: 要导出的单元格区域范围，包含起始和结束位置
  - `start`: 起始单元格位置 `{ col: number, row: number }`
  - `end`: 结束单元格位置 `{ col: number, row: number }`

**返回值说明：**

- 返回指定单元格区域的 base64 编码图片字符串
- 图片格式为 PNG
- 包含区域内所有单元格的内容、样式和边框

**使用示例：**

```javascript
// 导出从第1行第1列到第3行第4列的区域
const cellRange = {
  start: { col: 0, row: 0 }, // 第1行第1列
  end: { col: 3, row: 2 } // 第3行第4列
};
const rangeImage = tableInstance.exportCellRangeImg(cellRange);

// 导出单个单元格（区域起始和结束相同）
const singleCellRange = {
  start: { col: 1, row: 2 }, // 第3行第2列
  end: { col: 1, row: 2 } // 同一个单元格
};
const singleCellImage = tableInstance.exportCellRangeImg(singleCellRange);

// 导出整行
const rowRange = {
  start: { col: 0, row: 5 }, // 第6行第1列
  end: { col: tableInstance.colCount - 1, row: 5 } // 第6行最后一列
};
const rowImage = tableInstance.exportCellRangeImg(rowRange);
```

**注意事项：**

- 区域必须是矩形，由起始和结束位置确定
- 包含区域内所有单元格的完整样式（背景、边框、文字等）
- 适用于导出表格的特定部分，如报表、统计区域等
- 返回的 base64 字符串可以直接用作图片的 src 属性

## changeCellValue(Function)

更改单元格的 value 值：

```
  /**
   * 设置单元格的value值，注意对应的是源数据的原始值，vtable实例records会做对应修改
   * @param col 单元格的起始列号
   * @param row 单元格的起始行号
   * @param value 更改后的值
   * @param workOnEditableCell 是否仅更改可编辑单元格
   * @param triggerEvent 是否在值发生改变的时候触发change_cell_value事件
   */
  changeCellValue: (col: number, row: number, value: string | number | null, workOnEditableCell = false, triggerEvent = true) => void;
```

## changeCellValues(Function)

批量更改单元格的 value：

```
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   * @param workOnEditableCell 是否仅更改可编辑单元格
   * @param triggerEvent 是否在值发生改变的时候触发change_cell_value事件
   */
  changeCellValues(startCol: number, startRow: number, values: string[][], workOnEditableCell = false, triggerEvent=true) => Promise<boolean[][]>;
```

## getEditor(Function)

获取单元格配置的编辑器

```
  /** 获取单元格配置的编辑器 */
  getEditor: (col: number, row: number) => IEditor;
```

## startEditCell(Function)

开启单元格编辑。

如果想要改变显示到编辑框中的值 可以配置上 value 来设置改变

```
  /** 开启单元格编辑 */
  startEditCell: (col?: number, row?: number, value?: string | number) => void;
```

## completeEditCell(Function)

结束编辑

```
  /** 结束编辑 */
  completeEditCell: () => void;
```

## cancelEditCell(Function)

取消编辑，不保存任何更改

```
  /** 取消编辑 */
  cancelEditCell: () => void;
```

## records

获取当前表格的全部数据

## dataSource(CachedDataSource)

给 VTable 表格组件实例设置数据源，具体使用可以参考[异步懒加载数据 demo](../demo/performance/async-data)及[教程](../guide/data/async_data)

## addRecords(Function)

添加数据，支持多条数据

**ListTable 专有**

```
  /**
   * 添加数据 支持多条数据
   * @param records 多条数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。在树形（分组）结构中，recordIndex可能是一个数组，代表改节点从根节点开始的每级索引位置。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecords(records: any[], recordIndex?: number|number[])
```

## addRecord(Function)

添加数据，单条数据

**ListTable 专有**

```
  /**
   * 添加数据 单条数据
   * @param record 数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。在树形（分组）结构中，recordIndex可能是一个数组，代表改节点从根节点开始的每级索引位置。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecord(record: any, recordIndex?: number|number[])
```

## deleteRecords(Function)

删除数据 支持多条数据

**ListTable 专有**

```
  /**
   * 删除数据 支持多条数据
   * @param recordIndexs 要删除数据的索引（显示到body中的条目索引）,在树形（分组）结构中，recordIndex可能是一个数组，代表改节点从根节点开始的每级索引位置。
   */
  deleteRecords(recordIndexs: number[]|number[][])
```

## updateRecords(Function)

修改数据 支持多条数据

**ListTable 专有**

```
  /**
   * 修改数据 支持多条数据
   * @param records 修改数据条目
   * @param recordIndexs 对应修改数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）,在树形（分组）结构中，recordIndex可能是一个数组，代表改节点从根节点开始的每级索引位置。
   */
  updateRecords(records: any[], recordIndexs: number[]|number[][])
```

## getBodyVisibleCellRange(Function)

获取表格 body 部分的显示单元格范围

```
  /** 获取表格body部分的显示单元格范围 */
  getBodyVisibleCellRange: () => { rowStart: number; colStart: number; rowEnd: number; colEnd: number };
```

## getBodyVisibleColRange(Function)

获取表格 body 部分的显示列号范围

```
  /** 获取表格body部分的显示列号范围 */
  getBodyVisibleColRange: () => { colStart: number; colEnd: number };
```

## getBodyVisibleRowRange(Function)

获取表格 body 部分的显示行号范围

```
  /** 获取表格body部分的显示行号范围 */
  getBodyVisibleRowRange: () => { rowStart: number; rowEnd: number };
```

## getAggregateValuesByField(Function)

获取聚合汇总的值

```
  /**
   * 根据字段获取聚合值
   * @param field 字段名
   * 返回数组，包括列号和每一列的聚合值数组
   */
  getAggregateValuesByField(field: string | number)
```

**ListTable 专有**

## isAggregation(Function)

判断是否是聚合指单元格

```
  isAggregation(col: number, row: number): boolean
```

**ListTable 专有**

## registerCustomCellStyle(Function)

注册自定义样式

```
registerCustomCellStyle: (customStyleId: string, customStyle: ColumnStyleOption | undefined | null) => void
```

自定义单元格样式

- customStyleId: 自定义样式的唯一 id
- customStyle: 自定义单元格样式，与`column`中的`style`配置相同，最终呈现效果是单元格原有样式与自定义样式融合

## arrangeCustomCellStyle(Function)

分配自定义样式

```
arrangeCustomCellStyle: (cellPosition: { col?: number; row?: number; range?: CellRange }, customStyleId: string) => void
```

- cellPosition: 单元格位置信息，支持配置单个单元格与单元格区域
  - 单个单元格：`{ row: number, col: number }`
  - 单元格区域：`{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`
- customStyleId: 自定义样式 id，与注册自定义样式时定义的 id 相同

## getCheckboxState(Function)

获取某个字段下 checkbox 全部数据的选中状态 顺序对应原始传入数据 records 不是对应表格展示 row 的状态值

```
getCheckboxState(field?: string | number): Array
```

## getCellCheckboxState(Function)

获取某个单元格 checkbox 的状态

```
getCellCheckboxState(col: number, row: number): Array
```

## getRadioState(Function)

获取某个字段下 radio 全部数据的选中状态 顺序对应原始传入数据 records 不是对应表格展示 row 的状态值

```
getRadioState(field?: string | number): number | Record<number, boolean | number>
```

## getCellRadioState(Function)

获取某个单元格 radio 的状态，如果一个单元格中包含多个单选框，则返回值为 number，指该单元格内选中 radio 的索引，否则返回值为 boolean

```
getCellRadioState(col: number, row: number): boolean | number
```

## setCellCheckboxState(Function)

设置单元格的 checkbox 状态

```
setCellCheckboxState(col: number, row: number, checked: boolean) => void
```

- col: 列号
- row: 行号
- checked: 是否选中

## setCellRadioState(Function)

将单元格的 radio 状态设置为选中状态

```
setCellRadioState(col: number, row: number, index?: number) => void
```

- col: 列号
- row: 行号
- index: 更新的目标 radio 在单元格中的索引

## getSwitchState(Function)

获取某个字段下 switch 全部数据的选中状态 顺序对应原始传入数据 records 不是对应表格展示 row 的状态值

```
getSwitchState(field?: string | number): Array
```

## getCellSwitchState(Function)

获取某个单元格 switch 的状态

```
getCellSwitchState(col: number, row: number): boolean
```

## setCellSwitchState(Function)

设置单元格的 switch 状态

```
setCellSwitchState(col: number, row: number, checked: boolean) => void
```

- col: 列号
- row: 行号
- checked: 是否选中

## getAllRowsHeight(Function)

获取表格所有行的高度

```
getAllRowsHeight: () => number;
```

## getAllColsWidth(Function)

获取表格所有列的宽度

```
getAllColsWidth: () => number;
```

## getColsWidths(Function)

获取表格所有列的宽度列表

```
getColsWidths: () => number[];
```

## setSortedIndexMap(Function)

设置预排序索引，用在大数据量排序的场景下，提升初次排序性能

```
setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}
```

## getHeaderField(Function)

**ListTable**中表示获取对应 header 的 field。
**PivotTable**中表示获取对应 indicatorKey。

```
  /**获取对应header的field  */
  getHeaderField: (col: number, row: number)
```

## getColWidth(Function)

获取列宽

```
  /**获取列宽 */
  getColWidth: (col: number)
```

## getRowHeight(Function)

获取行高

```
  /**获取行高 */
  getRowHeight: (row: number)
```

## setColWidth(Function)

设置列宽

```
  /**设置列宽 */
  setColWidth: (col: number, width: number)
```

## setRowHeight(Function)

设置行高

```
  /**设置行高 */
  setRowHeight: (row: number, height: number)
```

## cellIsInVisualView(Function)

判断单元格是否在单元格可见区域，如果单元格完全都在可见区域才会返回 true，如果有部分或者完全都在可见区域外就返回 false

```
  cellIsInVisualView(col: number, row: number)
```

## getCellAtRelativePosition(Function)

获取相对于表格左上角的坐标对应的单元格位置。

有滚动的情况下，获取的单元格是滚动后的，如当前显示的行是 100-120 行，获取相对于表格左上角（10,100）位置的单元格位置是（第一列，第 103 行），假设行高 40px。

```
  /**
   * 获取屏幕坐标对应的单元格信息，考虑滚动
   * @param this
   * @param relativeX 左边x值，相对于容器左上角，已考虑格滚动情况
   * @param relativeY 左边y值，相对于容器左上角，已考虑格滚动情况
   * @returns
   */
  getCellAtRelativePosition(relativeX: number, relativeY: number): CellAddressWithBound
```

## showMoverLine(Function)

显示移动列或移动行的高亮标记线

```
  /**
   * 显示移动列或移动行的高亮线  如果(col，row)单元格是列头 则显示高亮列线；  如果(col，row)单元格是行头 则显示高亮行线
   * @param col 在表头哪一列后显示高亮线
   * @param row 在表头哪一行后显示高亮线
   */
  showMoverLine(col: number, row: number)
```

## hideMoverLine(Function)

隐藏掉移动列或移动行的高亮线

```
  /**
   * 隐藏掉移动列或移动行的高亮线
   * @param col
   * @param row
   */
  hideMoverLine(col: number, row: number)
```

## disableScroll(Function)

关闭表格的滚动，业务场景中如果有不期望表格内容滚动的话，可以调用该方法。

```
  /** 关闭表格的滚动 */
  disableScroll() {
    this.eventManager.disableScroll();
  }
```

## enableScroll(Function)

开启表格的滚动

```
  /** 开启表格的滚动 */
  enableScroll() {
    this.eventManager.enableScroll();
  }
```

## setCanvasSize(Function)

直接设置 canvas 的宽高 不根据容器宽高来决定表格的尺寸

```
  /** 直接设置canvas的宽高 不根据容器宽高来决定表格的尺寸 */
  setCanvasSize: (width: number, height: number) => void;
```

## setLoadingHierarchyState(Function)

设置单元格的树形展开收起状态为 loading，注意在使用前需要手动注册 loading 图标。

```
// 注册loading图标
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading', //定义图标的名称，在内部会作为缓存的key值
  positionType: VTable.TYPES.IconPosition.absoluteRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
  marginLeft: 0, // 左侧内容间隔 在特定位置position中起作用
  marginRight: 4, // 右侧内容间隔 在特定位置position中起作用
  visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // 热区大小
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});

/** 设置单元格的树形展开收起状态为 loading */
setLoadingHierarchyState: (col: number, row: number) => void;
```

## setPixelRatio(Function)

设置画布的像素比，内部逻辑默认值为 window.devicePixelRatio 。如果感觉绘制内容模糊，可以尝试将这个值设置高一点。

获取 pixelRatio 画布像素比可以直接通过实例的 pixelRatio 属性获取。

```
  /** 设置画布的像素比 */
  setPixelRatio: (pixelRatio: number) => void;
```

## setTranslate(Function)

设置表格的偏移量

```
  /** 设置表格的偏移量 */
  setTranslate: (x: number, y: number) => void;
```

## expandAllTreeNode(Function)

展开所有树形节点（包括表头和数据行）。

**ListTable 专有**

```ts
  /**
   * 展开所有树形节点（包括表头和数据行）。
   */
  expandAllTreeNode(): void
```

使用：

```ts
// 展开所有节点
tableInstance.expandAllTreeNode();
```

## collapseAllTreeNode(Function)

折叠所有树形节点（包括表头和数据行）。

**ListTable 专有**

```ts
  /**
   * 折叠所有树形节点（包括表头和数据行）。
   */
  collapseAllTreeNode(): void
```

使用：

```ts
// 折叠所有节点
tableInstance.collapseAllTreeNode();
```

## expandAllForRowTree(Function)

展开所有行表头树的节点。

**PivotTable 专有**

```ts
  /**
   * 展开行表头树的所有节点。
   */
  expandAllForRowTree(): void
```

使用：

```ts
// 展开行表头树的所有节点
tableInstance.expandAllForRowTree();
```

## collapseAllForRowTree(Function)

折叠所有行表头树的节点。

**PivotTable 专有**

```ts
  /**
   * 折叠行表头树的所有节点
   */
  collapseAllForRowTree(): void
```

使用：

```ts
// 折叠行表头树的所有节点
tableInstance.collapseAllForRowTree();
```

## expandAllForColumnTree(Function)

展开所有列表头树的节点。

**PivotTable 专有**

```ts
  /**
   * 展开列表头树的所有节点
   */
  expandAllForColumnTree(): void
```

使用：

```ts
// 展开列表头树的所有节点
tableInstance.expandAllForColumnTree();
```

## collapseAllForColumnTree(Function)

折叠所有行表头树的节点。

**PivotTable 专有**

```ts
  /**
   * 折叠列表头树的所有节点
   */
  collapseAllForColumnTree(): void
```

使用：

```ts
// 折叠列表头树的所有节点
tableInstance.collapseAllForColumnTree();
```
