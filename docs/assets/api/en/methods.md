{{ target: table-methods }}

# Methods

## updateOption(Function)

Update table configuration items, which will be automatically redrawn after being called.

```ts
  /**
   *Update options currently only support full updates
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions) => void
```
If you need to update a single configuration item, please refer to the other `update**` interfaces below

## updateTheme(Function)

Update the table theme and it will be automatically redrawn after calling it.

```ts
  /**
   * Update theme
   * @param theme
   */
  updateTheme(theme: ITableThemeDefine) => void
```
use:
```
tableInstance.updateTheme(newTheme)
```
Corresponding attribute update interface（https://visactor.io/vtable/guide/basic_function/update_option）:
```
// will not automatically redraw after calling
tableInstance.theme = newTheme;
```
## updateColumns(Function)

Update the configuration information of the columns field of the table, and it will be automatically redrawn after calling

```ts
  /**
   * Update the columns field configuration information of the table
   * @param columns
   */
  updateColumns(columns: ColumnsDefine) => void
```
use:
```
tableInstance. updateColumns(newColumns)
```
Corresponding attribute update interface（https://visactor.io/vtable/guide/basic_function/update_option）:
```
// will not automatically redraw after calling
tableInstance.columns = newColumns;
```
## updatePagination(Function)

Update page number configuration information, and it will be automatically redrawn after calling

```ts
  /**
   * Update page number
   * @param pagination The information of the page number to be modified
   */
  updatePagination(pagination: IPagination): void;
```
IPagination type define:
```
/**
 *Paging configuration
 */
export interface IPagination {
  /** The total number of data, this data in the pivot table will be automatically added without user input */
  totalCount?: number;
  /** Display number of data items per page */
  perPageCount: number;
  /** Display number of items per page */
  currentPage?: number;
}
```
The basic table and VTable data analysis pivot table (enableDataAnalysis=true) support paging, but the pivot combination chart does not support paging.

Note! The perPageCount in the pivot table will be automatically corrected to an integer multiple of the number of indicators.

## renderWithRecreateCells(Function)
Re-collect the cell objects and re-render the table. Use scenarios such as:

Refresh after batch updating multiple configuration items:
```
tableInstance.theme = newThemeObj;
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight;
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells();
```

## release(Function)

destroy form instance

## on(Function)

listen event

## off(Function)

unlisten event

## onVChartEvent(Function)

Listen to VChart chart events

## offVChartEvent(Function)

Unlisten to VChart chart events

## setRecords(Function)

Set the table data interface, which can be called as an update interface.

## selectCell(Function)

Select a cell

```
  /**
   * The effect of selecting a cell is the same as that of a cell selected by the mouse.
   * @param col
   * @param row
   */
  selectCell(col: number, row: number): void
```

## selectCells(Function)

Select one or more cell ranges

```
  /**
   * Select a cell area, and you can set multiple areas to be selected at the same time
   * @param cellRanges: CellRange[]
   */
  selectCells(cellRanges: CellRange[]): void
```

## getSelectedCellInfos(Function)
Get the selected cell information, and the returned result is a two-dimensional array. The first-level array item represents a row, and each item of the second-level array represents a cell information of the row.

```
  /**Get details of each cell in the selected area */
  getSelectedCellInfos(): CellInfo[][] | null;
```

## getCellValue(Function)

Get cell display value

```
  /**
   * Get the cell display value
   */
  getCellValue(col: number, row: number): FieldData;
```

## getCellOriginValue(Function)

Get the value before the format of the cell display data

```
  /**
   * Get the value before the format of the cell display data
   */
  getCellOriginValue(col: number, row: number): FieldData;
```

## getCellRawValue(Function)

Get the original value of the cell display data source

```
  /**
   * Get the original value of the cell display data source
   */
  getCellRawValue(col: number, row: number): FieldData;
```

## getCellStyle(Function)

Getting the style of a cell

```ts
 /**
   * :: Getting the style of a cell for business calls
   * @param col
   * @param row
   */
  getCellStyle(col: number, row: number) => CellStyle
```
## getRecordByCell(Function)

Get the data item of this cell

```
  /**
   * Get the entire data record based on the row and column number
   * @param {number} col col index.
   * @param {number} row row index.
   * @return {object} record.
   */
  getRecordByCell(col: number, row: number)
```
## getTableIndexByRecordIndex(Function)
Get the index row number or column number displayed in the table based on the index of the data source (related to transposition). Note: ListTable specific interface

```
  /**
   * Get the index row number or column number displayed in the table based on the index of the data source (related to transposition). Note: ListTable specific interface
   * @param recordIndex
   */
  getTableIndexByRecordIndex: (recordIndex: number) => number;
```

## getTableIndexByField(Function)
Get the index row number or column number displayed in the table according to the field of the data source (related to transposition). Note: ListTable specific interface
```
  /**
   * Get the index row number or column number displayed in the table according to the field of the data source (related to transposition). Note: ListTable specific interface
   * @param recordIndex
   */
  getTableIndexByField: (field: FieldDef) => number;
```
## getCellAddrByFieldRecord(Function)

Get the cell row and column number based on the index and field in the data source. Note: ListTable specific interface
```
  /**
   * Get the cell row and column number based on the index and field in the data source. Note: ListTable specific interface
   * @param field
   * @param recordIndex
   * @returns
   */
  getCellAddrByFieldRecord: (field: FieldDef, recordIndex: number) => CellAddress;
```
## getCellOriginRecord(Function)

Get the source data item of this cell.

If it is a normal table, the source data object will be returned.

If it is a pivot analysis table (a pivot table with data analysis turned on), an array of source data will be returned.

```
  /**
   * Get source data based on row and column numbers
   * @param {number} col col index.
   * @param {number} row row index.
   * @return {object} record or record array
   */
  getCellOriginRecord(col: number, row: number)
```

## getAllCells(Function)

Get all cell context information

```
  /**
   * :: Obtain information on all cell data
   * @param colMaxCount Limit the number of columns to be fetched.
   * @param rowMaxCount Limit the number of rows to be fetched.
   * @returns CellInfo[][]
   */
  getAllCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllBodyCells(Function)

Get all body cell context information

```
  /**
   * :: Get all body cell context information
   * @param colMaxCount Limit the number of columns to be fetched.
   * @param rowMaxCount Limit the number of rows to be fetched.
   * @returns CellInfo[][]
   */
  getAllBodyCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllColumnHeaderCells(Function)

Get all list header cell context information

```
  /**
   * :: Obtain information on all list header cell data
   * @returns CellInfo[][]
   */
  getAllColumnHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllRowHeaderCells(Function)

Get all row header cell context information

```
  /**
   * :: Obtain all row header cell context information
   * @returns CellInfo[][]
   */
  getAllRowHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getCellOverflowText(Function)

Get the text of the cell with omitted text.

```
  /**
   * :: Obtaining the text content of cells with omitted text
   * :: cellTextOverflows stores values for which full text cannot be displayed, for use by toolTip
   * @param {number} col column index.
   * @param {number} row row index
   * @return {string | null}
   */
  getCellOverflowText(col: number, row: number) => string | null
```

## getCellHeaderPaths(Function)

Get the path to the row list header

```
  /**
   * :: Get the path to the header of the line list
   * @param col
   * @param row
   * @returns ICellHeaderPaths
   */
  getCellHeaderPaths(col: number, row: number) => ICellHeaderPaths
```

{{ use: ICellHeaderPaths() }}

## getCellAddress(Function)

Get the row and column number of a piece of data in the body based on the data and field attribute field names. Currently only the basic table ListTable is supported.

```
  /**
   The * method is used to get the row and column number of a piece of data in the body.
   * @param findTargetRecord Calculates the index of a data entry from a data object or a specified function.
   * @param field
   * @returns
   */
  getCellAddress(findTargetRecord: any | ((record: any) => boolean), field: FieldDef) => CellAddress
```

## getCellAddressByHeaderPaths(Function)

For pivot table interfaces, get specific cell addresses based on the header dimension path to be matched.

```
  /**
   * :: Calculation of cell positions through dimension value paths in table headers
   * @param dimensionPaths
   * @returns
   */
  getCellAddressByHeaderPaths(
    dimensionPaths.
      | {
          colHeaderPaths: IDimensionInfo[].
          rowHeaderPaths: IDimensionInfo[];
        }
      | IDimensionInfo[]
  ) => CellAddress
```
## getCheckboxState(Function)
Get the selected status of all data in the checkbox under a certain field. The order corresponds to the original incoming data records. It does not correspond to the status value of the row displayed in the table.
```
getCheckboxState(field?: string | number): Array
```

## getCellCheckboxState(Function)
Get the status of a cell checkbox
```
getCellCheckboxState(col: number, row: number): Array
```

## scrollToCell(Function)

Scroll to a specific cell location

```
  /**
   * :: Scrolling to a specific cell location
   * @param cellAddr The cell position to scroll to.
   */
  scrollToCell(cellAddr: { col?: number; row?: number })=>void
```
## toggleHierarchyState(Function)
Tree expand and collapse state switch
```
 /**
   * Header switches level status
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number)
```
## getHierarchyState(Function)
Get the tree-shaped expanded or collapsed status of a certain cell
```
  /**
   * Get the collapsed and expanded status of hierarchical nodes
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
## getLayouRowTree(Function)
** PivotTable Proprietary **

Get the table row header tree structure
```
  /**
   * Get the table row tree structure
   * @returns
   */
  getLayouRowTree() : LayoutTreeNode[]
```

## getLayouRowTreeCount(Function)
** PivotTable Proprietary **

Get the total number of nodes occupying the table row header tree structure.

Note: The logic distinguishes between flat and tree hierarchies.
```
  /**
   * Get the total number of nodes occupying the table row header tree structure.
   * @returns
   */
  getLayouRowTreeCount() : number
```

## updateSortState(Function)

Update the sort status, ListTable exclusive

```
  /**
   * Update sort status
   * @param sortState the sorting state to be set
   * @param executeSort Whether to execute the internal sorting logic, setting false will only update the icon state
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)
```

## updatePivotSortState(Function)

Update sort status, PivotTable exclusive

```
  /**
   * Update sort status
   * @param pivotSortStateConfig.dimensions sorting state dimension correspondence; pivotSortStateConfig.order sorting state
   */
  updateSortState(pivotSortStateConfig: {
      dimensions: IDimensionInfo[];
      order: SortOrder;
    }[])
```

## setDropDownMenuHighlight(Function)

Set the selected state of the drop-down menu

```
  setDropDownMenuHighlight(cells: DropDownMenuHighlightInfo[]): void
```

## showTooltip(Function)

Show tooltip information prompt box

```
  /**
   * Display tooltip information prompt box
   * @param col The column number of the cell where the prompt box is displayed
   * @param row The row number of the cell where the prompt box is displayed
   * @param tooltipOptions tooltip content configuration
   */
  showTooltip(col: number, row: number, tooltipOptions?: TooltipOptions) => void
```

Note: For the time being, it only supports setting tooltip.renderMode='html' globally, and calling this interface is valid

Where the TooltipOptions type is:

```
/** Display popup prompt content */
export type TooltipOptions = {
  /** tooltip content */
  content: string;
  /** The position of the tooltip box has priority over referencePosition */
  position?: { x: number; y: number };
  /** The reference position of the tooltip box If the position is set, the configuration will not take effect */
  referencePosition?: {
    /** The reference position is set to a rectangular boundary, and the placement is set to specify the orientation at the boundary position*/
    rect: RectProps;
    /** Specify the orientation at the boundary position */
    placement?: Placement;
  };
  /** Need custom style to specify className dom tooltip to take effect */
  className?: string;
  /** Set the tooltip style */
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

Update data filtering rules

```
/** Update data filtering rules */
updateFilterRules(filterRules: FilterRules) => void
```

use case: After clicking the legend item, update the filter rules to update the chart

## setLegendSelected(Function)

Sets the selection state of the legend.

Note: After setting, if you need to synchronize the state of the chart, you need to use the updateFilterRules interface

```
/** Set the selection state of the legend. After setting, the status of the synchronization chart needs to be used in conjunction with the updateFilterRules interface */
  setLegendSelected(selectedData: (string | number)[])
```

## getChartDatumPosition(Function)

Get the position of a certain primitive on the chart

```
/**
   * Get the position of a certain primitive on the chart
   * @param datum data corresponding to the primitive
   * @param cellHeaderPaths header path of the cell
   * @returns The coordinate position of the primitive on the entire table (relative to the visual coordinates of the upper left corner of the table)
   */
  getChartDatumPosition(datum:any,cellHeaderPaths:IPivotTableCellHeaderPaths):{x:number,y:number}
```

## exportImg(Function)

Export a picture of the currently visible area in the table.

```
  /**
   * Export pictures of the currently visible area in the table
   * @returns base64 picture
   */
  exportImg(): string
```

## exportCellImg(Function)

Export a cell picture

```
 /**
   * Export a cell picture
   * @returns base64 picture
   */
  exportCellImg(col: number, row: number): string
```

## exportCellRangeImg(Function)

Export a picture of a certain cell range

```
 /**
   * Export pictures of a certain area
   * @returns base64 picture
   */
  exportCellRangeImg(cellRange: CellRange): string
```

## changeCellValue(Function)
Change the value of a cell:

```
  /** Set the value of the cell. Note that it corresponds to the original value of the source data, and the vtable instance records will be modified accordingly */
  changeCellValue: (col: number, row: number, value: string | number | null) => void;
```

## getEditor(Function)

Get the editor for the cell configuration

```
  /** Get the editor of cell configuration */
  getEditor: (col: number, row: number) => IEditor;
```

## startEditCell(Function)

Enable cell editing

```
  /** Enable cell editing */
  startEditCell: (col?: number, row?: number) => void;
```

## completeEditCell(Function)

End editing

```
  /** End editing */
  completeEditCell: () => void;
```

## records

Get all data of the current table

## dataSouce(CachedDataSource)
Set the data source for the VTable table component instance. For specific usage, please refer to [Asynchronous data lazy loading demo](../demo/performance/async-data) and [Tutorial](../guide/data/async_data)

## addRecords(Function)

 Add data, support multiple pieces of data

**  Note: ListTable specific interface ** 

```
  /**
   * Add data to support multiple pieces of data
   * @param records multiple data
   * @param recordIndex The position to be inserted into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default.
   * If the sorting rule recordIndex is set to be invalid, the sorting logic will be automatically adapted to determine the insertion order.
   * recordIndex can be obtained through the interface getRecordShowIndexByCell
   */
  addRecords(records: any[], recordIndex?: number)
```

## addRecord(Function)

 Add data, single piece of data

**  Note: ListTable specific interface ** 

```
  /**
   * Add data single data
   * @param record data
   * @param recordIndex The position to be inserted into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default.
   * If the sorting rule recordIndex is set to be invalid, the sorting logic will be automatically adapted to determine the insertion order.
   * recordIndex can be obtained through the interface getRecordShowIndexByCell
   */
  addRecord(record: any, recordIndex?: number)
```

## deleteRecords(Function)

Delete data supports multiple pieces of data

**  Note: ListTable specific interface ** 

```
  /**
   * Delete data supports multiple pieces of data
   * @param recordIndexs The index of the data to be deleted (the entry index displayed in the body)
   */
  deleteRecords(recordIndexs: number[])
```

## getRecordShowIndexByCell(Function)

Get the index of the current cell data in the body part, that is, remove the index of the header level number by the row and column number.

** ListTable proprietary **
```
  /** Get the display index of the current cell in the body part (row/col-headerLevelCount). Note: ListTable specific interface */
  getRecordShowIndexByCell(col: number, row: number): number
```