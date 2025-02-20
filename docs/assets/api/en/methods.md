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

Corresponding attribute update interface（https://visactor.io/vtable/guide/basic_function/update_option ）:

```
// will not automatically redraw after calling
tableInstance.theme = newTheme;
```

## updateColumns(Function)

Update the configuration information of the columns field of the table, and it will be automatically redrawn after calling

**ListTable Proprietary**

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

Corresponding attribute update interface（https://visactor.io/vtable/guide/basic_function/update_option ）:

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
  /** Display current page number */
  currentPage?: number;
}
```

The basic table and VTable data analysis pivot table support paging, but the pivot combination chart does not support paging.

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

Basic table updates:

The basic table can also set the sorting status to sort the table data. Set sortState to null to clear the sorting status. If not set, the incoming data will be sorted according to the current sorting status.In a scenario where internal sorting is disabled, be sure to clear the current sorting state before invoking the interface.

```
setRecords(
    records: Array<any>,
    option?: { sortState?: SortState | SortState[] | null }
  ): void;
```

Pivot table update:

```
setRecords(records: Array<any>)
```

## setRecordChildren(Function)

**ListTable Proprietary**

In the list table tree display scenario, if you need to dynamically insert data of sub-nodes, you can use this interface. It is not applicable in other situations.

```
/**
* In the tree display scenario, if you need to dynamically insert child node data, you can use this interface. It is not applicable in other situations.
* @param records Set the data of the child nodes of this cell
* @param col needs to set the cell address of the child node
* @param row needs to set the cell address of the child node
* @param recalculateColWidths Whether to automatically recalculate the width of the column after adding data, default value is true. (Case when has set width:auto or autoWidth is necessary to consider this parameter)
*/
setRecordChildren(records: any[], col: number, row: number, recalculateColWidths: boolean = true)
```

## setTreeNodeChildren(Function)

**PivotTable Proprietary**

In the pivot table tree display scenario, if you need to dynamically insert child node data, you can use this interface. It is not applicable in other cases. For lazy loading of node data, please refer to the demo: https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load

```
/**
* In the tree display scenario, if you need to dynamically insert child node data, you can use this interface. It is not applicable in other situations.
* @param children Set to the child nodes of this cell
* @param records The node is expanded to add new data
* @param col needs to set the cell address of the child node
* @param row needs to set the cell address of the child node
*/
  setTreeNodeChildren(children: IHeaderTreeDefine[], records: any[], col: number, row: number)
```

## getDrawRange(Function)

Get the boundRect value of the actual drawn content area of the table
like

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

Select a cell. If empty is passed, the currently selected highlight state will be cleared.

## selectCell(Function)

Select a cell。If empty is passed, the currently selected highlight state will be cleared.

```
 /**
   * The effect of selecting a cell is the same as that of a cell selected by the mouse.
   * @param col
   * @param row
   * @param isShift Whether to add the shift key to the selection
   * @param isCtrl Whether to add the ctrl key to the selection
   * @param makeSelectCellVisible Whether to make the selected cell visible
   * @param skipBodyMerge Whether to ignore merge cells, the default false automatically expands the selection for merge cells
   */
  selectCell(col: number, row: number, isShift?: boolean, isCtrl?: boolean, makeSelectCellVisible?: boolean,skipBodyMerge?: boolean): void
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

{{ use: CellInfo() }}

## clearSelected(Function)

Clear the selection of all cells.

## getCopyValue(Function)

Get the contents of the selected area as the copy content. The return value is a string, with cells separated by `\t` and rows separated by `\n`.

## getCellValue(Function)

Get the cell display value. If used in the customMergeCell function, you need to pass in the skipCustomMerge parameter, otherwise an error will be reported.

```
  /**
   * Get the cell display value
   */
  getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData;
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
   * @return {object} record in ListTable. return Array<any> in PivotTable.
   */
  getRecordByCell(col: number, row: number)
```

## getBodyIndexByTableIndex(Function)

Get the column index and row index in the body part according to the row and column numbers of the table cells

```
  /** Get the column index and row index in the body part based on the row and column numbers of the table cells */
  getBodyIndexByTableIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByBodyIndex(Function)

Get the row and column number of the cell based on the column index and row index of the body part

```
  /** Get the row and column number of the cell based on the column index and row index of the body part */
  getTableIndexByBodyIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByRecordIndex(Function)

Get the index row number or column number displayed in the table based on the index of the data source (Related to transposition, the non-transposition obtains the row number, and the transposed table obtains the column number).

Note: ListTable specific interface

```
  /**
   * Get the index row number or column number displayed in the table based on the index of the data source (Related to transposition, the non-transposition obtains the row number, and the transposed table obtains the column number).

   Note: ListTable specific interface
   * @param recordIndex
   */
  getTableIndexByRecordIndex: (recordIndex: number) => number;
```

## getRecordIndexByCell(Function)

Get the number of data in the current cell in the data source.

If it is a table in tree mode, an array will be returned, such as [1,2], the 3rd item in the children of the 2nd item in the data source.

**ListTable proprietary**

```
  /** Get the number of the data in the current cell in the data source.
   * If it is a table in tree mode, an array will be returned, such as [1,2], the 3rd item in the children of the 2nd item in the data source
   * Note: ListTable specific interface */
  getRecordIndexByCell(col: number, row: number): number | number[]
**ListTable proprietary**
```

## getBodyRowIndexByRecordIndex(Function)

Get the row index that should be displayed in the body based on the data index, with both parameter and return value indices starting from 0. If it is a tree mode table, the parameter supports arrays, such as [1,2].

**ListTable proprietary**

```
  /**
   * Get the row index that should be displayed in the body based on the data index, with both parameter and return value indices starting from 0.
   * @param  {number} index The record index.
   */
  getBodyRowIndexByRecordIndex: (index: number | number[]) => number;

## getTableIndexByField(Function)

Get the index row number or column number displayed in the table according to the field of the data source (Related to transposition, the non-transposition obtains the row number, and the transposed table obtains the column number).

Note: ListTable specific interface

```

/\*\*

- Get the index row number or column number displayed in the table according to the field of the data source (Related to transposition, the non-transposition obtains the row number, and the transposed table obtains the column number).

Note: ListTable specific interface

- @param recordIndex
  \*/
  getTableIndexByField: (field: FieldDef) => number;

```

## getRecordShowIndexByCell(Function)

Get the index of the current cell data in the body part, that is, remove the index of the header level number by the row and column number.(Related to transpose, the non-transpose gets the body row number, and the transpose table gets the body column number)

**ListTable proprietary**

```

/\*_ Get the display index of the current cell in the body part,it is ( row / col )- headerLevelCount. Note: ListTable specific interface _/
getRecordShowIndexByCell(col: number, row: number): number

```

## getCellAddrByFieldRecord(Function)

Get the cell row and column number based on the index and field in the data source.

Note: ListTable specific interface

```

/\*\*

- Get the cell row and column number based on the index and field in the data source. Note: ListTable specific interface
- @param field
- @param recordIndex
- @returns
  \*/
  getCellAddrByFieldRecord: (field: FieldDef, recordIndex: number) => CellAddress;

```

## getCellOriginRecord(Function)

Get the source data item of this cell.

If it is a normal table, the source data object will be returned.

If it is a pivot analysis table (a pivot table with data analysis turned on), an array of source data will be returned.

```

/\*\*

- Get source data based on row and column numbers
- @param {number} col col index.
- @param {number} row row index.
- @return {object} record or record array. ListTable return one record, PivotTable return an array of records.
  \*/
  getCellOriginRecord(col: number, row: number)

```

## getAllCells(Function)

Get all cell context information

```

/\*\*

- :: Obtain information on all cell data
- @param colMaxCount Limit the number of columns to be fetched.
- @param rowMaxCount Limit the number of rows to be fetched.
- @returns CellInfo[][]
  \*/
  getAllCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];

```

## getAllBodyCells(Function)

Get all body cell context information

```

/\*\*

- :: Get all body cell context information
- @param colMaxCount Limit the number of columns to be fetched.
- @param rowMaxCount Limit the number of rows to be fetched.
- @returns CellInfo[][]
  \*/
  getAllBodyCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];

```

## getAllColumnHeaderCells(Function)

Get all list header cell context information

```

/\*\*

- :: Obtain information on all list header cell data
- @returns CellInfo[][]
  \*/
  getAllColumnHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];

```

## getAllRowHeaderCells(Function)

Get all row header cell context information

```

/\*\*

- :: Obtain all row header cell context information
- @returns CellInfo[][]
  \*/
  getAllRowHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];

```

## getCellOverflowText(Function)

Get the text of the cell with omitted text.

```

/\*\*

- :: Obtaining the text content of cells with omitted text
- :: cellTextOverflows stores values for which full text cannot be displayed, for use by toolTip
- @param {number} col column index.
- @param {number} row row index
- @return {string | null}
  \*/
  getCellOverflowText(col: number, row: number) => string | null

```

## getCellRect(Function)

Get the specific position of the cell in the entire table.

```

/\*\*

- Get the range of cells. The return value is Rect type. Regardless of whether it is a merged cell, the coordinates start from 0
- @param {number} col column index
- @param {number} row row index
- @returns {Rect}
  \*/
  getCellRect(col: number, row: number): Rect

```

## getCellRelativeRect(Function)

Get the specific position of the cell in the entire table. Relative position is based on the upper left corner of the table (scroll condition minus scroll value)

```

/\*\*

- The obtained position is relative to the upper left corner of the table display interface. In case of scrolling, if the cell has rolled out of the top of the table, the y of this cell will be a negative value.
- @param {number} col index of column, of the cell
- @param {number} row index of row, of the cell
- @returns {Rect} the rect of the cell.
  \*/
  getCellRelativeRect(col: number, row: number): Rect

```

## getCellRange(Function)

Gets the merge range for the cell

```

/\*\*

- @param {number} col column index
- @param {number} row row index
- @returns {Rect}
  \*/
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

Get the path to the row list header

```

/\*\*

- :: Get the path to the header of the line list
- @param col
- @param row
- @returns ICellHeaderPaths
  \*/
  getCellHeaderPaths(col: number, row: number) => ICellHeaderPaths

```

{{ use: ICellHeaderPaths() }}

## getCellHeaderTreeNodes(Function)

Obtain the header tree node based on the row and column number, which includes the user's custom attributes on the custom tree rowTree and columnTree trees (it is also the node of the internal layout tree, please do not modify it at will after obtaining it).Under normal circumstances, just use getCellHeaderPaths.

```

/\*\*

- Obtain the header tree node based on the row and column number, which includes the user's custom attributes on the custom tree rowTree and columnTree trees (it is also the node of the internal layout tree, please do not modify it at will after obtaining it)
- @param col
- @param row
- @returns ICellHeaderPaths
  \*/
  getCellHeaderTreeNodes(col: number, row: number)=> ICellHeaderPaths

```

## getCellAddress(Function)

Get the row and column number of a piece of data in the body based on the data and field attribute field names. Currently only the basic table ListTable is supported.

```

/\*_
The _ method is used to get the row and column number of a piece of data in the body.

- @param findTargetRecord Calculates the index of a data entry from a data object or a specified function.
- @param field
- @returns
  \*/
  getCellAddress(findTargetRecord: any | ((record: any) => boolean), field: FieldDef) => CellAddress

```

## getCellAddressByHeaderPaths(Function)

For pivot table interfaces, get specific cell addresses based on the header dimension path to be matched.

```

/\*\*

- :: Calculation of cell positions through dimension value paths in table headers
- @param dimensionPaths
- @returns
  \*/
  getCellAddressByHeaderPaths(
  dimensionPaths.
  | {
  colHeaderPaths: IDimensionInfo[].
  rowHeaderPaths: IDimensionInfo[];
  }
  | IDimensionInfo[]
  ) => CellAddress

```

## getScrollTop(Function)

Get the current vertical scroll position

## getScrollLeft(Function)

Get the current horizontal scroll position

## setScrollTop(Function)

Set the vertical scroll position (the rendering interface will be updated)

## setScrollLeft(Function)

Set the horizontal scroll position (the rendering interface will be updated)

## scrollToCell(Function)

Scroll to a specific cell location

```

/\*\*

- :: Scrolling to a specific cell location
- @param cellAddr The cell position to scroll to.
  \*/
  scrollToCell(cellAddr: { col?: number; row?: number })=>void

```

## toggleHierarchyState(Function)

Tree expand and collapse state switch

```

/\*\*

- Header switches level status
- @param col
- @param row
- @param recalculateColWidths Whether to recalculate the column width. Default is true. (Case when has set width:auto or autoWidth is necessary to consider this parameter)
  \*/
  toggleHierarchyState(col: number, row: number,recalculateColWidths: boolean = true)

```

## getHierarchyState(Function)

Get the tree-shaped expanded or collapsed status of a certain cell

```

/\*\*

- Get the collapsed and expanded status of hierarchical nodes
- @param col
- @param row
- @returns
  \*/
  getHierarchyState(col: number, row: number) : HierarchyState | null;

enum HierarchyState {
expand = 'expand',
collapse = 'collapse',
none = 'none'
}

```

## getLayoutRowTree(Function)

**PivotTable Proprietary**

Get the table row header tree structure

```

/\*\*

- Get the table row tree structure
- @returns
  \*/
  getLayoutRowTree() : LayoutTreeNode[]

```

## getLayoutRowTreeCount(Function)

**PivotTable Proprietary**

Get the total number of nodes occupying the table row header tree structure.

Note: The logic distinguishes between flat and tree hierarchies.

```

/\*\*

- Get the total number of nodes occupying the table row header tree structure.
- @returns
  \*/
  getLayoutRowTreeCount() : number

```

## getLayoutColumnTree(Function)

**PivotTable Exclusive**

Get the table column header tree structure

```

/\*\*

- Get the table column header tree structure
- @returns
  \*/
  getLayoutColumnTree() : LayouTreeNode[]

```

## getLayoutColumnTreeCount(Function)

**PivotTable Exclusive**

Get the total number of nodes occupying the table column header tree structure.

```

/\*\*

- Get the total number of nodes occupying the table column header tree structure.
- @returns
  \*/
  getLayoutColumnTreeCount() : number

```

## updateSortState(Function)

Update the sort status, ListTable exclusive

```

/\*\*

- Update sort status
- @param sortState the sorting state to be set
- @param executeSort Whether to execute the internal sorting logic, setting false will only update the icon state
  \*/
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)

```

## updateSortRules(Function)

Pivot table update sorting rules, exclusive to PivotTable

```

/\*\*

- Full update of sorting rules
- @param sortRules
  \*/
  updateSortRules(sortRules: SortRules)

```

## updatePivotSortState(Function)

Update sort status, The vtable itself does not perform sorting logic. PivotTable exclusive

```

/\*\*

- Update sort status
- @param pivotSortStateConfig.dimensions sorting state dimension correspondence; pivotSortStateConfig.order sorting state
  \*/
  updatePivotSortState(pivotSortStateConfig: {
  dimensions: IDimensionInfo[];
  order: SortOrder;
  }[])

```

The table will not be redrawn automatically after updating, and the interface renderWithRecreateCells needs to be configured to refresh

## setDropDownMenuHighlight(Function)

Set the selected state of the drop-down menu. The cell will also display the corresponding icon

```

setDropDownMenuHighlight(dropDownMenuInfo: DropDownMenuHighlightInfo[]): void

```

## showTooltip(Function)

Show tooltip information prompt box

```

/\*\*

- Display tooltip information prompt box
- @param col The column number of the cell where the prompt box is displayed
- @param row The row number of the cell where the prompt box is displayed
- @param tooltipOptions tooltip content configuration
  \*/
  showTooltip(col: number, row: number, tooltipOptions?: TooltipOptions) => void

```

Note: For the time being, it only supports setting tooltip.renderMode='html' globally, and calling this interface is valid

If you want the tooltip to be hover by the mouse, you need to configure the interface tooltip.disappearDelay so that it does not disappear immediately.

Where the TooltipOptions type is:

```

/** Display popup prompt content \*/
export type TooltipOptions = {
/** tooltip content _/
content: string;
/\*\* The position of the tooltip box has priority over referencePosition _/
position?: { x: number; y: number };
/** The reference position of the tooltip box If the position is set, the configuration will not take effect \*/
referencePosition?: {
/** The reference position is set to a rectangular boundary, and the placement is set to specify the orientation at the boundary position*/
rect: RectProps;
/\*\* Specify the orientation at the boundary position */
placement?: Placement;
};
/** Need custom style to specify className dom tooltip to take effect \*/
className?: string;
/** Set the tooltip style _/
style?: {
bgColor?: string;
font?: string;
color?: string;
padding?: number[];
arrowMark?: boolean;
};
/\*\* set tooltip's vanishing time _/
disappearDelay?: number;
};

```

## showDropdownMenu(Function)
Display dropdown menu, the content can be the menu items already set in the option, or display specific dom content. Use [demo](../demo/component/dropdown)
```

/\*\*

- Display dropdown menu
- @param col The column number of the cell where the dropdown menu is displayed
- @param row The row number of the cell where the dropdown menu is displayed
- @param menuOptions The content configuration of the dropdown menu
  \*/
  showDropdownMenu(col: number, row: number, menuOptions?: DropDownMenuOptions) => void;

/** Display dropdown menu settings or display specific dom content \*/
export type DropDownMenuOptions = {
// menuList?: MenuListItem[];
content: HTMLElement | MenuListItem[];
position?: { x: number; y: number };
referencePosition?: {
rect: RectProps;
/** Currently, the dropdown menu icon is aligned to the right, but the specified position is not yet implemented \*/
placement?: Placement;
};
};

```
## updateFilterRules(Function)

Update data filtering rules

```

/\*_ Update data filtering rules _/
updateFilterRules(filterRules: FilterRules) => void

```

use case: For the PivotChart scene, after clicking the legend item, update the filter rules to update the chart

## getFilteredRecords(Function)

Get filtered data

**Exclusive to PivotTable**

## setLegendSelected(Function)

Sets the selection state of the legend.

Note: After setting, if you need to synchronize the state of the chart, you need to use the updateFilterRules interface

```

/\*_ Set the selection state of the legend. After setting, the status of the synchronization chart needs to be used in conjunction with the updateFilterRules interface _/
setLegendSelected(selectedData: (string | number)[])

```

## getChartDatumPosition(Function)

Get the position of a certain primitive on the chart

```

/\*\*

- Get the position of a certain primitive on the chart
- @param datum data corresponding to the primitive
- @param cellHeaderPaths header path of the cell
- @returns The coordinate position of the primitive on the entire table (relative to the visual coordinates of the upper left corner of the table)
  \*/
  getChartDatumPosition(datum:any,cellHeaderPaths:IPivotTableCellHeaderPaths):{x:number,y:number}

```

## exportImg(Function)

Export a picture of the currently visible area in the table.

```

/\*\*

- Export pictures of the currently visible area in the table
- @returns base64 picture
  \*/
  exportImg(): string

```

## exportCellImg(Function)

Export a cell picture

```

/\*\*

- Export a cell picture
- @returns base64 picture
  \*/
  exportCellImg(col: number, row: number, options?: { disableBackground?: boolean; disableBorder?: boolean }): string

```

## exportCellRangeImg(Function)

Export a picture of a certain cell range

```

/\*\*

- Export pictures of a certain area
- @returns base64 picture
  \*/
  exportCellRangeImg(cellRange: CellRange): string

```

## changeCellValue(Function)

Change the value of a cell:

```

/\*_ Set the value of the cell. Note that it corresponds to the original value of the source data, and the vtable instance records will be modified accordingly _/
changeCellValue: (col: number, row: number, value: string | number | null, workOnEditableCell = false) => void;

```

## changeCellValues(Function)

Change the value of cells in batches:

```

/\*\*

- Batch update data of multiple cells
- @param col The starting column number of pasted data
- @param row The starting row number of pasted data
- @param values Data array of multiple cells
  \*/
  changeCellValues(startCol: number, startRow: number, values: string[][])

```

## getEditor(Function)

Get the editor for the cell configuration

```

/\*_ Get the editor of cell configuration _/
getEditor: (col: number, row: number) => IEditor;

```

## startEditCell(Function)

Enable cell editing.

If you want to change the value displayed in the edit box, you can configure the value to set the change

```

/\*_ Enable cell editing _/
startEditCell: (col?: number, row?: number, value?: string | number) => void;

```

## completeEditCell(Function)

End editing

```

/\*_ End editing _/
completeEditCell: () => void;

```

## records

Get all data of the current table

## dataSource(CachedDataSource)

Set the data source for the VTable table component instance. For specific usage, please refer to [Asynchronous data lazy loading demo](../demo/performance/async-data) and [Tutorial](../guide/data/async_data)

## addRecords(Function)

Add data, support multiple pieces of data

**Note: ListTable specific interface**

```

/\*\*

- Add data to support multiple pieces of data
- @param records multiple data
- @param recordIndex The position to be inserted into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default. In the tree (group) structure, recordIndex may be an array, representing the index of each node from the root node.
- If the sorting rule recordIndex is set to be invalid, the sorting logic will be automatically adapted to determine the insertion order.
- recordIndex can be obtained through the interface getRecordShowIndexByCell
  \*/
  addRecords(records: any[], recordIndex?: number | number[])

```

## addRecord(Function)

Add data, single piece of data

**Note: ListTable specific interface**

```

/\*\*

- Add data single data
- @param record data
- @param recordIndex The position to be inserted into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default. In the tree (group) structure, recordIndex may be an array, representing the index of each node from the root node.
- If the sorting rule recordIndex is set to be invalid, the sorting logic will be automatically adapted to determine the insertion order.
- recordIndex can be obtained through the interface getRecordShowIndexByCell
  \*/
  addRecord(record: any, recordIndex?: number | number[])

```

## deleteRecords(Function)

Delete data supports multiple pieces of data

**Note: ListTable specific interface**

```

/\*\*

- Delete data supports multiple pieces of data
- @param recordIndexs The index of the data to be deleted (the entry index displayed in the body), in the tree (group) structure, recordIndex may be an array, representing the index of each node from the root node.
  \*/
  deleteRecords(recordIndexs: number[] | number[][])

```

## updateRecords(Function)

Modify data to support multiple pieces of data

**ListTable proprietary**

```

/\*\*

- Modify data to support multiple pieces of data
- @param records Modify data entries
- @param recordIndexs The index corresponding to the modified data (the index displayed in the body, that is, which row of data in the body part is to be modified), in the tree (group) structure, recordIndex may be an array, representing the index of each node from the root node.
  \*/
  updateRecords(records: any[], recordIndexs: number[] | number[][])

```

## getBodyVisibleCellRange(Function)

Get the display cell range of the table body part

```

/\*_ Get the display cell range of the table body _/
getBodyVisibleCellRange: () => { rowStart: number; colStart: number; rowEnd: number; colEnd: number };

```

## getBodyVisibleColRange(Function)

Get the displayed column number range in the body part of the table

```

/\*_ Get the displayed column number range in the body part of the table _/
getBodyVisibleColRange: () => { colStart: number; colEnd: number };

```

## getBodyVisibleRowRange(Function)

Get the displayed row number range of the table body part

```

/\*_ Get the displayed row number range of the table body _/
getBodyVisibleRowRange: () => { rowStart: number; rowEnd: number };

```

## getAggregateValuesByField(Function)

Get aggregation summary value

```

/\*\*

- Get the aggregate value based on the field
- @param field field name
- Returns an array, including the column number and the aggregate value array of each column
  \*/
  getAggregateValuesByField(field: string | number)

```

**ListTable Proprietary**

## isAggregation(Function)

Determine whether it is an aggregate cell

```

isAggregation(col: number, row: number): boolean

```

**ListTable Proprietary**

## registerCustomCellStyle(Function)

Register a custom style

```

registerCustomCellStyle: (customStyleId: string, customStyle: ColumnStyleOption | undefined | null) => void

```

Custom cell style

- customStyleId: the unique id of the custom style
- customStyle: Custom cell style, which is the same as the `style` configuration in `column`. The final rendering effect is the fusion of the original style of the cell and the custom style.

## arrangeCustomCellStyle(Function)

Assign custom styles

```

arrangeCustomCellStyle: (cellPosition: { col?: number; row?: number; range?: CellRange }, customStyleId: string) => void

```

- cellPosition: cell position information, supports configuration of single cells and cell areas
  - Single cell: `{ row: number, col: number }`
  - Cell range: `{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`
- customStyleId: Custom style id, the same as the id defined when registering the custom style

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

## getRadioState(Function)

Get the selected status of all radio data under a certain field. The order corresponds to the original incoming data records. It does not correspond to the status value of the row displayed in the table.

```

getRadioState(field?: string | number): number | Record<number, boolean | number>

```

## getCellRadioState(Function)

Get the status of a cell radio. If a cell contains multiple radio buttons, the return value is number, which refers to the index of the selected radio in the cell. Otherwise, the return value is boolean.

```

getCellRadioState(col: number, row: number): boolean | number

```

## setCellCheckboxState(Function)

Set the checkbox state of a cell

```

setCellCheckboxState(col: number, row: number, checked: boolean) => void

```

- col: column number
- row: row number
- checked: whether checked

## setCellRadioState(Function)

Set the cell's radio state to selected

```

setCellRadioState(col: number, row: number, index?: number) => void

```

- col: column number
- row: row number
- index: the index of the updated target radio in the cell

## getSwitchState(Function)

Get the selected status of all switch data under a certain field. The order corresponds to the original incoming data records. It does not correspond to the status value of the row displayed in the table.

```

getSwitchState(field?: string | number): Array

```

## getCellSwitchState(Function)

Get the status of a cell switch

```

getCellSwitchState(col: number, row: number): boolean

```

## setCellSwitchState(Function)

Set the switch state of a cell

```

setCellSwitchState(col: number, row: number, checked: boolean) => void

```

- col: column number
- row: row number
- checked: whether checked

## getAllRowsHeight(Function)

get all rows height

```

getAllRowsHeight: () => number;

```

## getAllColsWidth(Function)

get all columns width

```

getAllColsWidth: () => number;

```

## setSortedIndexMap(Function)

Set up a pre-sort index to improve initial sorting performance in scenarios where large amounts of data are sorted.

```

setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

interface ISortedMapItem {
asc?: (number | number[])[];
desc?: (number | number[])[];
normal?: (number | number[])[];
}

```

## getHeaderField(Function)

In **ListTable** can get header's field.
In **PivotTable** get indicatorKey.

```

/\*_get field of header _/
getHeaderField: (col: number, row: number)

```

## getColWidth(Function)

get column width.

```

/\*_get column width _/
getColWidth: (col: number)

```

## getRowHeight(Function)

get row height.

```

/\*_get row height _/
getRowHeight: (row: number)

```

## setColWidth(Function)

set column width.

```

/\*_set column width _/
setColWidth: (col: number, width: number)

```

## setRowHeight(Function)

set row height.

```

/\*_set row height _/
setRowHeight: (row: number, height: number)

```

## cellIsInVisualView(Function)

Determines whether the cell is in the visible area of the cell. If the cell is completely in the visible area, it returns true. If part or all of the cell is outside the visible area, it returns false.

```

cellIsInVisualView(col: number, row: number)

```

## getCellAtRelativePosition(Function)

Gets the cell position relative to the upper left corner of the table.

In the case of scrolling, the cells obtained are those after scrolling. For example, if the currently displayed rows are 100-120, the cell position relative to the upper left corner of the table (10,100) is (first column, 103rd row), assuming the row height is 40px.

```

/\*\*

- Get the cell information corresponding to the screen coordinates, taking scrolling into account
- @param this
- @param relativeX The left x value, relative to the upper left corner of the container, taking into account the scrolling of the grid
- @param relativeY The left y value, relative to the upper left corner of the container, taking into account the scrolling of the grid
- @returns
  \*/
  getCellAtRelativePosition(relativeX: number, relativeY: number): CellAddressWithBound

```

## showMoverLine(Function)

Displays a highlighted line for moving columns or rows

```

/\*\*

- Display the highlight line of the moving column or row If the (col, row) cell is the column header, the highlight column line is displayed; If the (col, row) cell is the row header, the highlight row line is displayed
- @param col Which column in the table header should be highlighted after?
- @param row The row after which the highlighted line is displayed
  \*/
  showMoverLine(col: number, row: number)

```

## hideMoverLine(Function)

Hide the highlight line of the moved column or row

```

/\*\*

- Hide the highlight line of the moved column or row
- @param col
- @param row
  \*/
  hideMoverLine(col: number, row: number)

```

## disableScroll(Function)

Close the scrolling of the table. If you do not want the table content to scroll in the business scenario, you can call this method.

```

/\*_ Turn off scrolling of the table _/
disableScroll() {
this.eventManager.disableScroll();
}

```

## enableScroll(Function)

Enable scrolling of the table

```

/\*_ Enable scrolling of the table _/
enableScroll() {
this.eventManager.enableScroll();
}

```

## setCanvasSize(Function)

Directly set the width and height of the canvas instead of determining the size of the table based on the container width and height

```

/\*_ Directly set the width and height of the canvas instead of determining the size of the table based on the width and height of the container _/
setCanvasSize: (width: number, height: number) => void;

```

## setLoadingHierarchyState(Function)

Set the loading state of the tree expansion and collapse of the cell

```

/\*_ Set the loading state of the tree expansion and collapse of the cell _/
setLoadingHierarchyState: (col: number, row: number) => void;

```

## setPixelRatio(Function)

Sets the pixel ratio of the canvas. The default internal logic is window.devicePixelRatio. If the drawing feels fuzzy, try setting this value higher.

The pixelRatio can be obtained directly from the instance's pixelRatio property.

```

/\*_ Set the canvas pixel ratio _/
setPixelRatio: (pixelRatio: number) => void;

```

```
