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

更新表格的columns字段配置信息，调用后会自动重绘。

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

更新页码配置信息

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
基本表格和VTable数据分析透视表(enableDataAnalysis=true)支持分页，透视组合图不支持分页。

注意! 透视表中perPageCount会自动修正为指标数量的整数倍。
## renderWithRecreateCells(Function)
重新单元格对象集合并重新渲染表格，使用场景如：

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
## selectCell(Function)

选中某个单元格

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

## getCellAddress(Function)

根据数据和 field 属性字段名称获取 body 中某条数据的行列号

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

## scrollToCell(Function)

滚动到具体某个单元格位置

```
  /**
   * 滚动到具体某个单元格位置
   * @param cellAddr 要滚动到的单元格位置
   */
  scrollToCell(cellAddr: { col?: number; row?: number })=>void
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

## updatePivotSortState(Function)

更新排序状态，PivotTable 专有

```
  /**
   * 更新排序状态
   * @param pivotSortStateConfig.dimensions 排序状态维度对应关系；pivotSortStateConfig.order 排序状态
   */
  updateSortState(pivotSortStateConfig: {
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
  getChartDatumPosition(datum:any,cellHeaderPaths:IPivotTableCellHeaderPaths):{x:number,y:number}
```
