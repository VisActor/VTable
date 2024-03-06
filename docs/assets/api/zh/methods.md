{{ target: table-methods }}

# Methods

## updateOption(Function)

更新表格配置项，调用后会自动重绘

```ts
  /**
   * 更新options 目前只支持全量更新
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions) => void
```

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

对应属性更新接口（可参考教程：https://visactor.io/vtable/guide/basic_function/update_option）:

```
// 调用后不会自动重绘
tableInstance.theme = newTheme;
```

## updateColumns(Function)

更新表格的 columns 字段配置信息，调用后会自动重绘。

```ts
  /**
   * 更新表格的columns字段配置信息
   * @param columns
   */
  updateColumns(columns: ColumnsDefine) => void
```

使用：

```
tableInstance.updateColumns(newColumns)
```

对应属性更新接口（可参考教程：https://visactor.io/vtable/guide/basic_function/update_option）:

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
  /** 每页显示条数 */
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

监听事件

## off(Function)

解除监听事件

## onVChartEvent(Function)

监听 VChart 图表事件

## offVChartEvent(Function)

解除监听 VChart 图表事件

## setRecords(Function)

设置表格数据接口，可作为更新接口调用。

基本表格更新：

基本表格可同时设置排序状态对表格数据排序，sort 设置为 null 清空排序状态，如果不设置则按当前排序状态对传入数据排序。

restoreHierarchyState 可暂时忽略，用的场景比较特殊，可以咨询 VTable 的研发后再决定是否使用。

```
setRecords(
    records: Array<any>,
    option?: { sort?: SortState | SortState[], restoreHierarchyState: boolean;  }
  ): void;
```

透视表更新：

```
setRecords(records: Array<any>)
```

## getDrawRange(Function)

获取表格实际绘制内容区域的 boundRect 的值
如

```
{
    "bounds": {
        "x1": 1,
        "y1": 1,
        "x2": 1581,
        "y2": 361
    },
    bottom: 361,
    height: 360,
    left: 1，
    right: 1581，
    top: 1,
    width: 1580
}
```

## selectCell(Function)

选中某个单元格。如果传空，则清除当前选中高亮状态。

```
  /**
   * 选中单元格  和鼠标选中单元格效果一致
   * @param col
   * @param row
   */
  selectCell(col: number, row: number): void
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

## getSelectedCellInfos(Function)

获取已选中的单元格信息，返回结果是二维数组，第一层数组项代表一行，第二层数组每一项即代表该行的一个单元格信息。

```
  /**获取选中区域的每个单元格详情 */
  getSelectedCellInfos(): CellInfo[][] | null;
```

{{ use: CellInfo() }}

## clearSelected(Function)

清除所有单元格的选中状态。

## getCellValue(Function)

获取单元格展示值

```
  /**
   * 获取单元格展示值
   */
  getCellValue(col: number, row: number): FieldData;
```

## getCellOriginValue(Function)

获取单元格展示数据的 format 前的值

```
  /**
   * 获取单元格展示数据的format前的值
   */
  getCellOriginValue(col: number, row: number): FieldData;
```

## getCellRawValue(Function)

获取单元格展示数据源最原始值

```
  /**
   * 获取单元格展示数据源最原始值
   */
  getCellRawValue(col: number, row: number): FieldData;
```

## getCellStyle(Function)

获取某个单元格的样式

```ts
 /**
   * 获取某个单元格的样式 供业务方调用
   * @param col
   * @param row
   */
  getCellStyle(col: number, row: number) => CellStyle
```

## getRecordByCell(Function)

获取该单元格的数据项

```
  /**
   * 根据行列号获取整条数据记录
   * @param  {number} col col index.
   * @param  {number} row row index.
   * @return {object} record.
   */
  getRecordByCell(col: number, row: number)
```

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

** ListTable 专有 **

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

** ListTable 专有 **

```
  /** 获取当前单元格的数据是数据源中的第几条。
   * 如果是树形模式的表格，将返回数组，如[1,2] 数据源中第2条数据中children中的第3条
   * 注：ListTable特有接口 */
  getRecordIndexByCell(col: number, row: number): number | number[]
** ListTable 专有 **
```

## getTableIndexByField(Function)

根据数据源的 field 获取显示到表格中的 index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。

** ListTable 专有 **

```
  /**
   * 根据数据源的field 获取显示到表格中的index 行号或者列号（与转置相关，非转置获取的是行号，转置表获取的是列号）。注：ListTable特有接口
   * @param recordIndex
   */
  getTableIndexByField: (field: FieldDef) => number;
```

## getRecordShowIndexByCell(Function)

获取当前单元格数据在 body 部分的索引，即通过行列号去除表头层级数的索引（与转置相关，非转置获取的是 body 行号，转置表获取的是 body 列号）。

** ListTable 专有 **

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
   * @return {object} record or record array
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

## getScrollTop(Function)

获取当前竖向滚动位置

## getScrollLeft(Function)

获取当前横向滚动位置

## setScrollTop(Function)

设置竖向滚动位置 （会更新渲染界面）

## setScrollLeft(Function)

设置横向滚动位置（会更新渲染界面）

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
   */
  toggleHierarchyState(col: number, row: number)
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

** PivotTable 专有 **

获取表格行头树形结构

```
  /**
   * 获取表格行树状结构
   * @returns
   */
  getLayoutRowTree() : LayouTreeNode[]
```

## getLayoutRowTreeCount(Function)

** PivotTable 专有 **

获取表格行头树形结构的占位的总节点数。

注意：逻辑中区分了平铺和树形层级结构

```
  /**
   * 获取表格行头树形结构的占位的总节点数。
   * @returns
   */
  getLayoutRowTreeCount() : number
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

更新排序状态，PivotTable 专有

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

## setDropDownMenuHighlight(Function)

设置下拉菜单选中状态

```
  setDropDownMenuHighlight(cells: DropDownMenuHighlightInfo[]): void
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

注意：暂时只支持全局设置了 tooltip.renderMode='html'，调用该接口才有效

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
};

```

## updateFilterRules(Function)

更新数据过滤规则

```
/** 更新数据过滤规则 */
updateFilterRules(filterRules: FilterRules) => void
```

use case: 点击图例项后 更新过滤规则 来更新图表

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

导出表格中当前可视区域的图片。

```
  /**
   * 导出表格中当前可视区域的图片
   * @returns base64图片
   */
  exportImg(): string
```

## exportCellImg(Function)

导出某个单元格图片

```
 /**
   * 导出某个单元格图片
   * @returns base64图片
   */
  exportCellImg(col: number, row: number): string
```

## exportCellRangeImg(Function)

导出某一片单元格区域的图片

```
 /**
   * 导出某一片区域的图片
   * @returns base64图片
   */
  exportCellRangeImg(cellRange: CellRange): string
```

## changeCellValue(Function)

更改单元格的 value 值：

```
  /** 设置单元格的value值，注意对应的是源数据的原始值，vtable实例records会做对应修改 */
  changeCellValue: (col: number, row: number, value: string | number | null) => void;
```

## changeCellValues(Function)

批量更改单元格的 value：

```
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   */
  changeCellValues(startCol: number, startRow: number, values: string[][])
```

## getEditor(Function)

获取单元格配置的编辑器

```
  /** 获取单元格配置的编辑器 */
  getEditor: (col: number, row: number) => IEditor;
```

## startEditCell(Function)

开启单元格编辑

```
  /** 开启单元格编辑 */
  startEditCell: (col?: number, row?: number) => void;
```

## completeEditCell(Function)

结束编辑

```
  /** 结束编辑 */
  completeEditCell: () => void;
```

## records

获取当前表格的全部数据

## dataSouce(CachedDataSource)

给 VTable 表格组件实例设置数据源，具体使用可以参考[异步懒加载数据 demo](../demo/performance/async-data)及[教程](../guide/data/async_data)

## addRecords(Function)

添加数据，支持多条数据

** ListTable 专有 **

```
  /**
   * 添加数据 支持多条数据
   * @param records 多条数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecords(records: any[], recordIndex?: number)
```

## addRecord(Function)

添加数据，单条数据

** ListTable 专有 **

```
  /**
   * 添加数据 单条数据
   * @param record 数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecord(record: any, recordIndex?: number)
```

## deleteRecords(Function)

删除数据 支持多条数据

** ListTable 专有 **

```
  /**
   * 删除数据 支持多条数据
   * @param recordIndexs 要删除数据的索引（显示到body中的条目索引）
   */
  deleteRecords(recordIndexs: number[])
```

## updateRecords(Function)

修改数据 支持多条数据

** ListTable 专有 **

```
  /**
   * 修改数据 支持多条数据
   * @param records 修改数据条目
   * @param recordIndexs 对应修改数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
   */
  updateRecords(records: any[], recordIndexs: number[])
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
