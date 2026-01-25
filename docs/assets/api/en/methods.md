{{ target: table-methods }}

# Methods

## updateOption(Function)

Update table configuration options, automatically redraws after calling.

```ts
  /**
   * Update options, currently only supports full update
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions, updateConfig?: { clearColWidthCache?: boolean; clearRowHeightCache?: boolean }) => void
```

updateConfig can control the update configuration. By default, it clears column width cache and row height cache. If you don't need to clear the cache, you can pass { clearColWidthCache: false, clearRowHeightCache: false }.

If you need to update a single configuration item, please refer to other `update**` interfaces below

## updateTheme(Function)

Update table theme, automatically redraws after calling

```ts
  /**
   * Update theme
   * @param theme
   */
  updateTheme(theme: ITableThemeDefine) => void
```

Usage:

```
tableInstance.updateTheme(newTheme)
```

Corresponding property update interface (see tutorial: https://visactor.io/vtable/guide/basic_function/update_option):

```
// Will not automatically redraw after calling
tableInstance.theme = newTheme;
```

## updateColumns(Function)

Update table columns field configuration information, automatically redraws after calling.

**ListTable specific**

```ts
  /**
   * Update table columns field configuration information
   * @param columns
   * @param options Configuration options (optional)
   * @param options.clearColWidthCache Whether to clear column width adjustment cache, default is false. When set to true
   * , it will clear the width cache of manually adjusted columns and redistribute all column widths
   *
   */
  updateColumns(columns: ColumnsDefine, options?: { clearColWidthCache?: boolean }) => void
```

Usage:

```
tableInstance.updateColumns(newColumns)

tableInstance.updateColumns(newColumns, { clearColWidthCache: true })
```

Corresponding property update interface (see tutorial: https://visactor.io/vtable/guide/basic_function/update_option):

```
// Will not automatically redraw after calling
tableInstance.columns = newColumns;
```

## updatePagination(Function)

Update pagination configuration information, automatically redraws after calling.

```ts
  /**
   * Update pagination
   * @param pagination Information to modify pagination
   */
  updatePagination(pagination: IPagination): void;
```

Where the types are:

```
/**
 * Pagination configuration
 */
export interface IPagination {
  /** Total number of data items, in pivot tables this data will be automatically added and doesn't need user input*/
  totalCount?: number;
  /** Number of data items displayed per page */
  perPageCount: number;
  /** Current page number */
  currentPage?: number;
}
```

Basic tables and VTable data analysis pivot tables support pagination, pivot combination charts do not support pagination.

Note! In pivot tables, perPageCount will be automatically corrected to an integer multiple of the number of indicators.

## renderWithRecreateCells(Function)

Reorganize the cell object tree and re-render the table, usage scenarios include:

Refresh after batch updating multiple configuration items:

```
tableInstance.theme = newThemeObj;
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight;
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells();
```

## release(Function)

Destroy table instance

## on(Function)

Listen to table events, execute callback function when specified event is triggered.

```ts
/**
 * Listen to events
 * @param type Event type, optional values refer to TABLE_EVENT_TYPE
 * @param listener Event listener function
 * @returns Event listener ID, can be used with off method to remove listener
 */
on<TYPE extends keyof TableEventHandlersEventArgumentMap>(
  type: TYPE,
  listener: TableEventListener<TYPE>
): EventListenerId
```

**Parameter description:**

- `type`: Event type, such as `'click_cell'`, `'scroll'`, `'selected_cell'`, etc.
- `listener`: Event handler function, receives event parameter object

**Usage examples:**

```javascript
// Listen to cell click event
const listenerId = tableInstance.on('click_cell', event => {
  console.log('Clicked cell:', event.col, event.row);
  console.log('Cell data:', event.value);
});

// Listen to scroll event
tableInstance.on('scroll', event => {
  console.log('Scroll position:', event.scrollLeft, event.scrollTop);
});

// Listen to selection state change
tableInstance.on('selected_cell', event => {
  console.log('Selected cell ranges:', event.ranges);
});
```

**Common event types:**

- `click_cell`: Cell click event
- `dblclick_cell`: Cell double-click event
- `scroll`: Table scroll event
- `selected_cell`: Cell selection event
- `selected_clear`: Clear selection event
- `resize_column`: Column width adjustment event
- `resize_row`: Row height adjustment event

**Event parameter descriptions:**

- `click_cell` event parameters: `{ col: number, row: number, value: any, event: MouseEvent }`
- `scroll` event parameters: `{ scrollLeft: number, scrollTop: number, event: WheelEvent }`
- `selected_cell` event parameters: `{ ranges: CellRange[], cells: CellAddress[] }`

## off(Function)

Remove event listeners, supports two methods: by listener ID or by event type + listener function.

```ts
/**
 * Remove event listener
 * @param id Event listener ID (ID returned by on method)
 */
off(id: EventListenerId): void;

/**
 * Remove event listener
 * @param type Event type
 * @param listener Event listener function
 */
off(type: string, listener: TableEventListener): void;
```

**Parameter description:**

- `id`: Event listener ID returned by on method
- `type`: Event type (corresponds to the type parameter in on method)
- `listener`: Event handler function to be removed

**Usage examples:**

```javascript
// Method 1: Remove by listener ID
const listenerId = tableInstance.on('click_cell', handleClick);
tableInstance.off(listenerId);

// Method 2: Remove by event type and function
function handleClick(event) {
  console.log('Cell clicked');
}
tableInstance.on('click_cell', handleClick);
tableInstance.off('click_cell', handleClick);

// Remove all event listeners of specified type
function handleScroll1(event) {
  /* ... */
}
function handleScroll2(event) {
  /* ... */
}
tableInstance.on('scroll', handleScroll1);
tableInstance.on('scroll', handleScroll2);
// Need to remove each listener separately
tableInstance.off('scroll', handleScroll1);
tableInstance.off('scroll', handleScroll2);
```

## onVChartEvent(Function)

Listen to VChart chart events, used to listen to chart component events embedded in the table.

```ts
/**
 * Listen to VChart chart events
 * @param type Chart event type, such as 'mouseover', 'click', etc.
 * @param callback Event handler function
 */
onVChartEvent(type: string, callback: AnyFunction): void;

/**
 * Listen to VChart chart events (with query conditions)
 * @param type Chart event type
 * @param query Query condition object, used to filter specific chart elements
 * @param callback Event handler function
 */
onVChartEvent(type: string, query: any, callback: AnyFunction): void;
```

**Parameter description:**

- `type`: Chart event type, such as `'mouseover'`, `'click'`, `'legend_item_click'`, etc.
- `query`: Optional query condition, used to filter specific chart elements (such as specific series, dimensions, etc.)
- `callback`: Event handler function, receives chart event parameters

**Usage examples:**

```javascript
// Listen to chart mouse hover event
tableInstance.onVChartEvent('mouseover', event => {
  console.log('Mouse hovering over chart:', event);
});

// Listen to specific series click event
tableInstance.onVChartEvent('click', { seriesId: 'series1' }, event => {
  console.log('Clicked series1:', event.data);
});

// Listen to legend item click event
tableInstance.onVChartEvent('legend_item_click', event => {
  console.log('Legend item clicked:', event.item);
});
```

## offVChartEvent(Function)

Remove VChart chart event listeners.

```ts
/**
 * Remove VChart chart event listener
 * @param type Chart event type
 * @param callback Event handler function to be removed (optional)
 */
offVChartEvent(type: string, callback?: AnyFunction): void;
```

**Parameter description:**

- `type`: Chart event type
- `callback`: Specific event handler function to be removed. If not provided, removes all listeners of this type

**Usage examples:**

```javascript
// Define event handler function
function handleChartClick(event) {
  console.log('Chart clicked:', event);
}

// Add listener
tableInstance.onVChartEvent('click', handleChartClick);

// Remove specified listener function
tableInstance.offVChartEvent('click', handleChartClick);

// Remove all listener functions of a certain type
tableInstance.offVChartEvent('mouseover');
```

## setRecords(Function)

Set table data interface, can be used as an update interface.

Basic table update:

Basic tables can simultaneously set sort state to sort table data, setting sortState to null clears the current sort state, if not set, the incoming data will be sorted according to the current sort state. If internal sorting is disabled, be sure to clear the current sort state before calling this interface.

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

**ListTable specific**

In basic table tree display scenarios, if you need to dynamically insert child node data, you can use this interface in coordination, not applicable in other cases

```
  /**
   * @param records Data to set to the cell's child nodes
   * @param col Cell address where child nodes need to be set
   * @param row Cell address where child nodes need to be set
   * @param recalculateColWidths Whether to recalculate column widths after adding data, default is true. (Only necessary to consider this parameter when setting width:auto or autoWidth)
   */
  setRecordChildren(records: any[], col: number, row: number, recalculateColWidths: boolean = true)
```

## setTreeNodeChildren(Function)

**PivotTable specific**

In pivot table tree display scenarios, if you need to dynamically insert child node data, you can use this interface in coordination, not applicable in other cases. For lazy loading of node data, refer to demo: https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load

```
  /**
   * In tree display scenarios, if you need to dynamically insert child node data, you can use this interface in coordination, not applicable in other cases
   * @param children Child nodes to set to this cell
   * @param records New data after this node is expanded
   * @param col Cell address where child nodes need to be set
   * @param row Cell address where child nodes need to be set
   */
  setTreeNodeChildren(children: IHeaderTreeDefine[], records: any[], col: number, row: number)
```

## getDrawRange(Function)

Get the boundRect value of the table's actual drawing content area, returning the actual position and size information of the table content on the canvas.

```ts
/**
 * Get the boundRect value of the table's actual drawing content area
 * @returns Returns an object containing boundary information
 */
getDrawRange(): Rect
```

**Return value description:**
Returns an object containing boundary information, structured as follows:

```javascript
{
    "bounds": {
        "x1": 1,      // Left boundary coordinate
        "y1": 1,      // Top boundary coordinate
        "x2": 1581,   // Right boundary coordinate
        "y2": 361     // Bottom boundary coordinate
    },
    left: 1,      // Left boundary
    top: 1,       // Top boundary
    right: 1581,  // Right boundary
    bottom: 361,  // Bottom boundary
    width: 1580,  // Content width
    height: 360   // Content height
}
```

**Usage scenarios:**

- Get the exact position and size of table content
- Calculate the layout of table content on the canvas
- Used for custom drawing or overlay positioning

## selectCell(Function)

Select a cell. If passed empty, clears the current selection highlight state.

```
   /**
   * Select cell, same effect as mouse selecting cell
   * @param col
   * @param row
   * @param isShift Whether shift key is pressed
   * @param isCtrl Whether ctrl key is pressed
   * @param makeSelectCellVisible Whether to make the selected cell visible
   * @param skipBodyMerge Whether to ignore merged cells, default false automatically expands selection range for merged cells
   */
  selectCell(col: number, row: number, isShift?: boolean, isCtrl?: boolean, makeSelectCellVisible?: boolean,skipBodyMerge?: boolean): void
```

## selectCells(Function)

Select one or more cell areas

```
  /**
   * Select cell areas, can set multiple areas to be selected simultaneously
   * @param cellRanges: CellRange[]
   */
  selectCells(cellRanges: CellRange[]): void
```

Where:
{{ use: CellRange() }}

## selectRow(Function)

Select entire row, supports single selection, multiple selection, and range selection modes.

```ts
/**
 * Select entire row
 * @param rowIndex Row index (starting from 0)
 * @param isCtrl Whether Ctrl key is pressed, for multiple selection mode
 * @param isShift Whether Shift key is pressed, for range selection mode
 */
selectRow(rowIndex: number, isCtrl?: boolean, isShift?: boolean): void
```

**Parameter description:**

- `rowIndex`: Row index to be selected, starting from 0
- `isCtrl`: Whether to use Ctrl key multiple selection mode. When true, retains previous selections and adds new row
- `isShift`: Whether to use Shift key range selection mode. When true, extends from last selection to current row

**Usage examples:**

```javascript
// Single select row (clears previous selections)
tableInstance.selectRow(2);

// Ctrl+click effect: Multiple row selection
tableInstance.selectRow(2, true); // Select row 3
tableInstance.selectRow(5, true); // Keep row 3 selected, simultaneously select row 6

// Shift+click effect: Range selection
tableInstance.selectRow(2); // First select row 3
tableInstance.selectRow(5, false, true); // Select all rows from row 3 to row 6
```

## selectCol(Function)

Select entire column, supports single selection, multiple selection, and range selection modes.

```ts
/**
 * Select entire column
 * @param colIndex Column index (starting from 0)
 * @param isCtrl Whether Ctrl key is pressed, for multiple selection mode
 * @param isShift Whether Shift key is pressed, for range selection mode
 */
selectCol(colIndex: number, isCtrl?: boolean, isShift?: boolean): void
```

**Parameter description:**

- `colIndex`: Column index to be selected, starting from 0
- `isCtrl`: Whether to use Ctrl key multiple selection mode. When true, retains previous selections and adds new column
- `isShift`: Whether to use Shift key range selection mode. When true, extends from last selection to current column

**Usage examples:**

```javascript
// Single select column (clears previous selections)
tableInstance.selectCol(1);

// Ctrl+click effect: Multiple column selection
tableInstance.selectCol(1, true); // Select column 2
tableInstance.selectCol(3, true); // Keep column 2 selected, simultaneously select column 4

// Shift+click effect: Range selection
tableInstance.selectCol(1); // First select column 2
tableInstance.selectCol(3, false, true); // Select all columns from column 2 to column 4
```

## getSelectedCellInfos(Function)

Get information about selected cells, the return result is a two-dimensional array, the first layer array items represent a row, and each item in the second layer represents a cell information in that row.

```
  /**Get details of each cell in the selected area */
  getSelectedCellInfos(): CellInfo[][] | null;
```

{{ use: CellInfo() }}

## clearSelected(Function)

Clear the selection state of all cells, equivalent to calling `selectCell()` without parameters.

```ts
/**
 * Clear the selection state of all cells
 */
clearSelected(): void
```

**Usage examples:**

```javascript
// Select some cells
tableInstance.selectCell(2, 3);
tableInstance.selectRow(5, true);

// Clear all selection states
tableInstance.clearSelected();

// Verify if cleared
const selectedInfos = tableInstance.getSelectedCellInfos();
console.log(selectedInfos); // null
```

**Related methods:**

- `selectCell()`: Select single cell
- `selectCells()`: Select multiple cell areas
- `getSelectedCellInfos()`: Get information about currently selected cells

## getBodyColumnDefine(Function)

Get table column configuration by index

```
  /**
   * Get table column configuration by index
   */
  getBodyColumnDefine(col: number, row: number): ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber;

```

## getCopyValue(Function)

Get the content of the selected area as copy content. The return value is a string, with cells separated by `\t` and rows separated by `\n`.

## getCellValue(Function)

Get the display value of the cell, returns the formatted display value. If used in customMergeCell function, you need to pass the skipCustomMerge parameter, otherwise it will cause an error.

```ts
/**
 * Get cell display value
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @param skipCustomMerge Whether to skip custom merge cell logic, default is false
 * @returns Returns the formatted cell display value
 */
getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData;
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0
- `skipCustomMerge`: Whether to skip custom merge cell logic, needs to be set to true when used in customMergeCell function

**Return value description:**

- Returns the formatted cell display value (string or number)
- If the cell doesn't exist or is empty, may return null or undefined

**Usage examples:**

```javascript
// Get the display value of the cell at row 3, column 2
const cellValue = tableInstance.getCellValue(1, 2);
console.log('Cell display value:', cellValue);

// Use in custom merge cell function
function customMergeCell(col, row) {
  const value = tableInstance.getCellValue(col, row, true); // Must pass true
  // ...custom merge logic
}
```

**Notes:**

- Returns the formatted display value, not the original data
- To get original data, please use getCellOriginValue or getCellRawValue methods

## getCellOriginValue(Function)

Get the original value of cell display data before formatting, i.e., the original data value that has not been processed by the formatting function.

```ts
/**
 * Get the value of cell display data before formatting
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @returns Returns the unformatted original data value
 */
getCellOriginValue(col: number, row: number): FieldData;
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0

**Return value description:**

- Returns the unformatted original data value
- Different from getCellValue(), this value has not been processed by the format function in column configuration

**Usage examples:**

```javascript
// Get the original data value of the cell at row 3, column 2
const originValue = tableInstance.getCellOriginValue(1, 2);
console.log('Original data value:', originValue);

// Compare values before and after formatting
const displayValue = tableInstance.getCellValue(1, 2); // Formatted display value
const originValue = tableInstance.getCellOriginValue(1, 2); // Original data value
console.log('Display value:', displayValue, 'Original value:', originValue);
```

**Differences from related methods:**

- `getCellValue()`: Returns the formatted display value
- `getCellOriginValue()`: Returns the original value before formatting
- `getCellRawValue()`: Returns the most original value from the data source (including nested data)

## getCellRawValue(Function)

Get the most original value of the cell display data source, i.e., the most original data directly obtained from the data source records without any processing.

```ts
/**
 * Get the most original value of the cell display data source
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @returns Returns the most original value from the data source
 */
getCellRawValue(col: number, row: number): FieldData;
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0

**Return value description:**

- Returns the most original data directly obtained from the data source records
- For nested data structures, returns the complete nested object
- Not affected by any formatting or transformation functions

**Usage examples:**

```javascript
// Get the most original data value of the cell at row 3, column 2
const rawValue = tableInstance.getCellRawValue(1, 2);
console.log('Most original data value:', rawValue);

// Comparison of three value retrieval methods
const displayValue = tableInstance.getCellValue(1, 2); // Formatted display value: "$1,234.56"
const originValue = tableInstance.getCellOriginValue(1, 2); // Original data value: 1234.56
const rawValue = tableInstance.getCellRawValue(1, 2); // Most original value: { price: 1234.56, currency: "USD" }
```

**Applicable scenarios:**

- Need to access complete data object structure
- Perform data debugging and validation
- Get specific properties of nested data objects

## getCellStyle(Function)

Get the style object of a cell, containing all style properties of that cell.

```ts
/**
 * Get the style of a cell for business use
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @returns Returns the cell style object
 */
getCellStyle(col: number, row: number): CellStyle
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0

**Return value description:**
Returns an object containing all style properties of the cell, may include:

- `color`: Text color
- `bgColor`: Background color
- `fontSize`: Font size
- `fontFamily`: Font family
- `textAlign`: Text alignment
- `textBaseline`: Text baseline
- `lineHeight`: Line height
- `fontWeight`: Font weight
- And other style properties

**Usage examples:**

```javascript
// Get the style of the cell at row 3, column 2
const cellStyle = tableInstance.getCellStyle(1, 2);
console.log('Cell style:', cellStyle);

// Make conditional judgments based on style
const style = tableInstance.getCellStyle(col, row);
if (style.bgColor === '#ff0000') {
  console.log('This cell background is red');
}
```

**Notes:**

- Returns the calculated final style, including the merged result of theme, column configuration, cell custom styles, etc.
- If the cell has no special styles, returns the default style object

## getRecordByCell(Function)

Get the complete data record corresponding to the cell based on row and column numbers. The returned data structure varies for different types of tables.

```ts
/**
 * Get the complete data record based on row and column numbers
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @return {object} ListTable returns single record object, PivotTable returns record array
 */
getRecordByCell(col: number, row: row): any | any[]
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0

**Return value description:**

- **ListTable**: Returns the single data record (object) corresponding to the cell
- **PivotTable**: Returns the record array corresponding to the cell (because pivot table cells may contain multiple aggregated data)
- **Header cells**: May return null or header-related information

**Usage examples:**

```javascript
// ListTable example
const record = tableInstance.getRecordByCell(1, 2);
console.log('Data record of this cell:', record);
// Output: { name: "Zhang San", age: 25, department: "Technology Department" }

// PivotTable example
const records = tableInstance.getRecordByCell(1, 2);
console.log('Data record array of this cell:', records);
// Output: [{ product: "Phone", sales: 1000 }, { product: "Computer", sales: 500 }]

// Access specific fields in the record
const record = tableInstance.getRecordByCell(col, row);
if (record && record.name) {
  console.log('Name:', record.name);
}
```

**Notes:**

- For ListTable, returns a single data object
- For PivotTable, returns a data array (because pivot table cells may aggregate multiple data)
- If the specified row and column numbers are out of range, may return null or undefined
- The data structure returned by header cells is different from data cells

## getBodyIndexByTableIndex(Function)

Get the column index and row index in the body part based on the row and column numbers of the table cell

```
  /** Get the column index and row index in the body part based on the row and column numbers of the table cell */
  getBodyIndexByTableIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByBodyIndex(Function)

Get the cell's row and column numbers based on the column index and row index in the body part

```
  /** Get the cell's row and column numbers based on the column index and row index in the body part */
  getTableIndexByBodyIndex: (col: number, row: number) => CellAddress;
```

## getTableIndexByRecordIndex(Function)

Get the row number or column number displayed in the table based on the index of the data source (related to transpose, non-transpose gets the row number, transpose table gets the column number).

**ListTable specific**

```
  /**
   * Get the row number or column number displayed in the table based on the index of the data source (related to transpose, non-transpose gets the row number, transpose table gets the column number).

   Note: ListTable specific interface
   * @param recordIndex
   */
  getTableIndexByRecordIndex: (recordIndex: number) => number;
```

## getRecordIndexByCell(Function)

Get which data item in the data source the current cell's data is.

If it's a tree mode table, will return an array, like [1,2] the 3rd item in the children of the 2nd data item in the data source.

**ListTable specific**

```
  /** Get which data item in the data source the current cell's data is.
   * If it's a tree mode table, will return an array, like [1,2] the 3rd item in the children of the 2nd data item in the data source
   * Note: ListTable specific interface */
  getRecordIndexByCell(col: number, row: number): number | number[]
**ListTable specific**
```

## getBodyRowIndexByRecordIndex(Function)

Get which row in the body should be displayed based on the data index, both parameter and return value indexes start from 0. If it's a tree mode table, the parameter supports arrays, like [1,2]

**ListTable specific**

```
  /**
   * Get which row should be displayed in the body based on the data index, both parameter and return value indexes start from 0
   * @param  {number} index The record index.
   */
  getBodyRowIndexByRecordIndex: (index: number | number[]) => number;
```

## getTableIndexByField(Function)

Get the row number or column number displayed in the table based on the field of the data source (related to transpose, non-transpose gets the row number, transpose table gets the column number).

**ListTable specific**

```
  /**
   * Get the row number or column number displayed in the table based on the field of the data source (related to transpose, non-transpose gets the row number, transpose table gets the column number). Note: ListTable specific interface
   * @param recordIndex
   */
  getTableIndexByField: (field: FieldDef) => number;
```

## getRecordShowIndexByCell(Function)

Get the index of the current cell data in the body part, i.e., the index obtained by removing the header level count through row and column numbers (related to transpose, non-transpose gets the body row number, transpose table gets the body column number).

**ListTable specific**

```
  /** Get the display index of the current cell in the body part, i.e., (row / col) - headerLevelCount. Note: ListTable specific interface */
  getRecordShowIndexByCell(col: number, row: number): number
```

## getCellAddrByFieldRecord(Function)

Get the cell's row and column numbers based on the index and field in the data source.

Note: ListTable specific interface

```
  /**
   * Get the cell's row and column numbers based on the index and field in the data source. Note: ListTable specific interface
   * @param field
   * @param recordIndex
   * @returns
   */
  getCellAddrByFieldRecord: (field: FieldDef, recordIndex: number) => CellAddress;
```

## getCellOriginRecord(Function)

Get the source data item of the cell.

If it's a regular table, will return the source data object.

If it's a pivot analysis table (pivot table with data analysis enabled), will return an array of source data.

```
  /**
   * Get source data based on row and column numbers
   * @param  {number} col col index.
   * @param  {number} row row index.
   * @return {object} record or record array.  ListTable return one record, PivotTable return an array of records.
   */
  getCellOriginRecord(col: number, row: number)
```

## getAllCells(Function)

Get all cell context information

```
  /**
   * Get all cell data information
   * @param colMaxCount Limit the maximum number of columns to get
   * @param rowMaxCount Limit the maximum number of rows to get
   * @returns CellInfo[][]
   */
  getAllCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllBodyCells(Function)

Get all body cell context information

```
  /**
   * Get all body cell context information
   * @param colMaxCount Limit the maximum number of columns to get
   * @param rowMaxCount Limit the maximum number of rows to get
   * @returns CellInfo[][]
   */
  getAllBodyCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllColumnHeaderCells(Function)

Get all column header cell context information

```
  /**
   * Get all column header cell data information
   * @returns CellInfo[][]
   */
  getAllColumnHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getAllRowHeaderCells(Function)

Get all row header cell context information

```
  /**
   * Get all row header cell context information
   * @returns CellInfo[][]
   */
  getAllRowHeaderCells(colMaxCount?: number, rowMaxCount?: number) => CellInfo[][];
```

## getCellOverflowText(Function)

Get the text content of cells with omitted text

```
  /**
   * Get the text content of cells with omitted text
   * cellTextOverflows stores values that cannot display full text, for toolTip use
   * @param  {number} col column index.
   * @param  {number} row row index
   * @return {string | null}
   */
  getCellOverflowText(col: number, row: number) => string | null
```

## getCellRect(Function)

Get the specific position of the cell in the entire table.

```
/**
   * Get the range of the cell, return value is Rect type. Does not consider whether it's a merged cell, coordinates start from 0
   * @param {number} col column index
   * @param {number} row row index
   * @returns {Rect}
   */
  getCellRect(col: number, row: number): Rect
```

## getCellRelativeRect(Function)

Get the specific position of the cell in the entire table. The relative position is based on the top-left corner of the table (subtract scroll values when scrolling)

```
/**
   * The position obtained is relative to the top-left corner of the table display interface, considering scrolling. If the cell has scrolled above the table, the y of this cell will be negative
   * @param {number} col index of column, of the cell
   * @param {number} row index of row, of the cell
   * @returns {Rect} the rect of the cell.
   */
  getCellRelativeRect(col: number, row: number): Rect
```

## getCellRange(Function)

Get the merged range of the cell

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

Get the path of row and column headers

```
  /**
   * Get the path of row and column headers
   * @param col
   * @param row
   * @returns ICellHeaderPaths
   */
  getCellHeaderPaths(col: number, row: number)=> ICellHeaderPaths
```

{{ use: ICellHeaderPaths() }}

## getCellRowHeaderFullPaths(Function)

Get the full path of the row header，solve the problem of getting the correct row header path when there are merged cells.

**PivotTable Proprietary**

```
  /**
   * Get the full path of the row header
   * @param col
   * @returns
   */
  getCellRowHeaderFullPaths(col: number) => IDimensionInfo[]
```

## getCellHeaderTreeNodes(Function)

Get the header tree node based on row and column numbers, containing the user's custom attributes on the custom trees rowTree and columnTree (also internal layout tree nodes, please do not modify after obtaining). Generally, getCellHeaderPaths is sufficient.

```
  /**
   * Get the header tree node based on row and column numbers, containing the user's custom attributes on the custom trees rowTree and columnTree (also internal layout tree nodes, please do not modify after obtaining)
   * @param col
   * @param row
   * @returns ICellHeaderPaths
   */
  getCellHeaderTreeNodes(col: number, row: number)=> ICellHeaderPaths
```

## getCellAddress(Function)

Get the row and column numbers of a data item in the body based on the data and field attribute field name. Currently only supports basic table ListTable

```
  /**
   * Method is suitable for getting the row and column numbers of a data item in the body
   * @param findTargetRecord Calculate data item index through data object or specified function
   * @param field
   * @returns
   */
  getCellAddress(findTargetRecord: any | ((record: any) => boolean), field: FieldDef) => CellAddress
```

## getCellAddressByHeaderPaths(Function)

Interface for pivot tables, get the specific cell address based on the header dimension path to be matched

```
  /**
   * Calculate cell position through header dimension value path
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

Get the current vertical scroll position, returning the vertical scroll distance of the table content.

```ts
/**
 * Get the current vertical scroll position
 * @returns Vertical scroll distance (pixel value)
 */
getScrollTop(): number
```

**Return value description:**

- Returns the vertical scroll distance of the table content, in pixels
- If the table has not scrolled vertically, returns 0

**Usage examples:**

```javascript
const scrollTop = tableInstance.getScrollTop();
console.log('Current vertical scroll position:', scrollTop, 'px');

// Listen to scroll events to get scroll position
tableInstance.on('scroll', event => {
  console.log('Vertical scroll position:', tableInstance.getScrollTop());
  console.log('Horizontal scroll position:', tableInstance.getScrollLeft());
});
```

## getScrollLeft(Function)

Get the current horizontal scroll position, returning the scroll distance of the table content in the horizontal direction.

```ts
/**
 * Get the current horizontal scroll position
 * @returns Horizontal scroll distance (pixel value)
 */
getScrollLeft(): number
```

**Return value description:**

- Returns the scroll distance of the table content in the horizontal direction, in pixels
- If the table has not scrolled horizontally, returns 0

**Usage examples:**

```javascript
const scrollLeft = tableInstance.getScrollLeft();
console.log('Current horizontal scroll position:', scrollLeft, 'px');
```

## setScrollTop(Function)

Set the vertical scroll position, will immediately update the rendering interface to display the content at the specified position in the visible area.

```ts
/**
 * Set vertical scroll position (will update rendering interface)
 * @param scrollTop Vertical scroll distance (pixel value)
 */
setScrollTop(scrollTop: number): void
```

**Parameter description:**

- `scrollTop`: Vertical scroll distance to be set, in pixels
- Valid value range: 0 to (total table height - visible area height)

**Usage examples:**

```javascript
// Scroll to top
tableInstance.setScrollTop(0);

// Scroll to specified position (e.g., 200 pixels)
tableInstance.setScrollTop(200);

// Scroll to bottom
const totalHeight = tableInstance.getAllRowsHeight();
const visibleHeight = tableInstance.getDrawRange().height;
tableInstance.setScrollTop(totalHeight - visibleHeight);
```

**Notes:**

- Will immediately update the rendering interface after setting
- If the set value is out of range, it will be automatically adjusted to the valid range

## setScrollLeft(Function)

Set the horizontal scroll position, will immediately update the rendering interface to display the content at the specified position in the visible area.

```ts
/**
 * Set horizontal scroll position (will update rendering interface)
 * @param scrollLeft Horizontal scroll distance (pixel value)
 */
setScrollLeft(scrollLeft: number): void
```

**Parameter description:**

- `scrollLeft`: Horizontal scroll distance to be set, in pixels
- Valid value range: 0 to (total table width - visible area width)

**Usage examples:**

```javascript
// Scroll to far left
tableInstance.setScrollLeft(0);

// Scroll to specified position (e.g., 300 pixels)
tableInstance.setScrollLeft(300);

// Scroll to far right
const totalWidth = tableInstance.getAllColsWidth();
const visibleWidth = tableInstance.getDrawRange().width;
tableInstance.setScrollLeft(totalWidth - visibleWidth);
```

**Notes:**

- Will immediately update the rendering interface after setting
- If the set value is out of range, it will be automatically adjusted to the valid range

## scrollToCell(Function)

Scroll to a specific cell position.
col or row can be empty, if empty, it means only move in x direction or y direction.

```
  /**
   * Scroll to a specific cell position
   * @param cellAddr The cell position to scroll to
   */
  scrollToCell(cellAddr: { col?: number; row?: number })=>void
```

## toggleHierarchyState(Function)

Tree expand/collapse state toggle

```
/**
   * Header toggle hierarchy state
   * @param col
   * @param row
   * @param recalculateColWidths Whether to recalculate column widths, default is true. (Only necessary to consider this parameter when setting width:auto or autoWidth)
   */
  toggleHierarchyState(col: number, row: number,recalculateColWidths: boolean = true)
```

## getHierarchyState(Function)

Get the tree expand or collapse state of a cell

```
  /**
   * Get the collapsed/expanded state of hierarchy nodes
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

**PivotTable specific**

Get the table row header tree structure

```
  /**
   * Get the table row tree structure
   * @returns
   */
  getLayoutRowTree() : LayouTreeNode[]
```

## getLayoutRowTreeCount(Function)

**PivotTable specific**

Get the total number of placeholder nodes in the table row header tree structure.

Note: The logic distinguishes between flat and tree hierarchy structures

```
  /**
   * Get the total number of placeholder nodes in the table row header tree structure.
   * @returns
   */
  getLayoutRowTreeCount() : number
```

## getLayoutColumnTree(Function)

**PivotTable specific**

Get the table column header tree structure

```
  /**
   * Get the table column header tree structure
   * @returns
   */
  getLayoutColumnTree() : LayouTreeNode[]
```

## getLayoutColumnTreeCount(Function)

**PivotTable specific**

Get the total number of placeholder nodes in the table column header tree structure.

```
  /**
   * Get the total number of placeholder nodes in the table column header tree structure.
   * @returns
   */
  getLayoutColumnTreeCount() : number
```

## updateSortState(Function)

Update sort state, ListTable specific

```
  /**
   * Update sort state
   * @param sortState The sort state to be set
   * @param executeSort Whether to execute internal sort logic, setting false will only update the icon state
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)
```

## updateSortRules(Function)

Update sort rules for pivot table, PivotTable specific

```
  /**
   * Fully update sort rules
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules)
```

## updatePivotSortState(Function)

Update sort state, vtable itself does not execute sort logic. PivotTable specific.

```
  /**
   * Update sort state
   * @param pivotSortStateConfig.dimensions Sort state dimension correspondence; pivotSortStateConfig.order Sort state
   */
  updatePivotSortState(pivotSortStateConfig: {
      dimensions: IDimensionInfo[];
      order: SortOrder;
    }[])
```

Will not automatically redraw the table after update, need to configure the renderWithRecreateCells interface to refresh

## setDropDownMenuHighlight(Function)

Set the dropdown menu selection state, and the corresponding icon will also be displayed in the cell

```
  setDropDownMenuHighlight(dropDownMenuInfo: DropDownMenuHighlightInfo[]): void
```

## showTooltip(Function)

Display tooltip information prompt box

```
  /**
   * Display tooltip information prompt box
   * @param col Column number of the cell displaying the tooltip
   * @param row Row number of the cell displaying the tooltip
   * @param tooltipOptions Tooltip content configuration
   */
  showTooltip(col: number, row: number, tooltipOptions?: TooltipOptions) => void
```

Note: Currently only supports calling this interface when tooltip.renderMode='html' is set globally.

If you want the tooltip to be hoverable by mouse, you need to configure the tooltip.disappearDelay interface to prevent it from disappearing immediately.

Where the TooltipOptions type is:

```
/** Display popup prompt content */
export type TooltipOptions = {
  /** tooltip content */
  content: string;
  /** tooltip box position, priority higher than referencePosition */
  position?: { x: number; y: number };
  /** tooltip box reference position, this configuration doesn't take effect if position is set */
  referencePosition?: {
    /** Set reference position as a rectangular boundary, set placement to specify the position relative to the boundary*/
    rect: RectProps;
    /** Specify the position relative to the boundary */
    placement?: Placement;
  };
  /** Need custom style to specify className for dom tooltip to take effect */
  className?: string;
  /** Set tooltip style */
  style?: {
    bgColor?: string;
    font?: string;
    color?: string;
    padding?: number[];
    arrowMark?: boolean;
  };
  /** Set tooltip disappearance time */
  disappearDelay?: number;
};

```

## showDropdownMenu(Function)

Display dropdown menu, the display content can be menu items already set in option, or display specified dom content. Use [demo](../demo/component/dropdown)

```
  /**
   * Display dropdown menu
   * @param col Column number of the cell displaying the dropdown menu
   * @param row Row number of the cell displaying the dropdown menu
   * @param menuOptions Dropdown menu content configuration
   */
  showDropdownMenu(col: number, row: number, menuOptions?: DropDownMenuOptions) => void;

  /** Display dropdown menu settings or display specified dom content */
  export type DropDownMenuOptions = {
    // menuList?: MenuListItem[];
    content: HTMLElement | MenuListItem[];
    position?: { x: number; y: number };
    referencePosition?: {
      rect: RectProps;
      /** Currently dropdown menu is right-aligned icon, specified position not yet implemented */
      placement?: Placement;
    };
  };
```

## updateFilterRules(Function)

Update data filtering rules

```
/** Update data filtering rules */
updateFilterRules(filterRules: FilterRules) => void
```

use case: For pivot chart scenarios, update filtering rules after clicking legend items to update the chart

To PivotTable，this interface has the following signature:

```
  /**
   * Update data filtering rules
   * @param filterRules Filter rules
   * @param isResetTree Whether to reset the table header tree structure. When true, the table header tree structure will be reset, when false, the table header tree structure will remain unchanged
   */
  updateFilterRules(filterRules: FilterRules, isResetTree: boolean = false) => void
```

## getFilteredRecords(Function)

Get filtered data

**ListTable, PivotTable specific**

## setLegendSelected(Function)

Set the selection state of the legend.

Note: After setting, if you need to synchronize the chart state, you need to use it in conjunction with the updateFilterRules interface

```
/** Set the selection state of the legend. After setting, to synchronize the chart state, you need to use it in conjunction with the updateFilterRules interface */
  setLegendSelected(selectedData: (string | number)[])
```

## getChartDatumPosition(Function)

Get the position of a graphic element on the chart

```
/**
   * Get the position of a graphic element on the chart
   * @param datum Data corresponding to the graphic element
   * @param cellHeaderPaths Header path of the cell
   * @returns Coordinate position of the graphic element on the entire table (relative to the top-left corner visual coordinates of the table)
   */
  getChartDatumPosition(datum:any,cellHeaderPaths:IPivotTableCellHeaderPaths): {x:number,y:number}
```

## exportImg(Function)

Export the image of the current visible area in the table, return the base64 encoded image string.

```ts
/**
 * Export the image of the current visible area in the table
 * @returns base64 encoded image string
 */
exportImg(): string
```

**Return value description:**

- Returns the base64 encoded image string of the current visible area table content
- Image format is PNG
- Only includes table content within the current visible area

**Usage examples:**

```javascript
// Export image of current visible area
const base64Image = tableInstance.exportImg();
console.log('Exported base64 image:', base64Image);

// Create image element to display exported image
const img = document.createElement('img');
img.src = base64Image;
document.body.appendChild(img);

// Download image
const link = document.createElement('a');
link.download = 'table-screenshot.png';
link.href = base64Image;
link.click();
```

**Notes:**

- Only exports content in the current visible area, excluding hidden scrolled parts
- The returned base64 string can be directly used as the src attribute of an image
- Image quality depends on the current table's rendering settings and pixel ratio

## exportCellImg(Function)

Export the image of a specified cell, can control whether to include background and borders.

```ts
/**
 * Export a single cell image
 * @param col Column index (starting from 0)
 * @param row Row index (starting from 0)
 * @param options Export options configuration
 * @returns base64 encoded image string
 */
exportCellImg(col: number, row: number, options?: { disableBackground?: boolean; disableBorder?: boolean }): string
```

**Parameter description:**

- `col`: Column index, starting from 0
- `row`: Row index, starting from 0
- `options`: Optional export configuration
  - `disableBackground`: Whether to disable background, default is false
  - `disableBorder`: Whether to disable border, default is false

**Return value description:**

- Returns the base64 encoded image string of the specified cell
- Image format is PNG

**Usage examples:**

```javascript
// Export single cell image (including background and borders)
const cellImage = tableInstance.exportCellImg(1, 2);

// Export cell image (without background)
const cellImageNoBg = tableInstance.exportCellImg(1, 2, {
  disableBackground: true
});

// Export cell image (without border)
const cellImageNoBorder = tableInstance.exportCellImg(1, 2, {
  disableBorder: true
});

// Export cell image (text content only)
const cellImageContentOnly = tableInstance.exportCellImg(1, 2, {
  disableBackground: true,
  disableBorder: true
});
```

**Notes:**

- Can precisely control the style elements of the exported image
- Suitable for scenarios where cell content needs to be embedded into other documents or reports
- The returned base64 string can be directly used as the src attribute of an image

## exportCellRangeImg(Function)

Export the image of a specified cell area, supports exporting rectangular areas composed of multiple consecutive cells.

```ts
/**
 * Export the image of a certain area
 * @param cellRange The cell area range to be exported
 * @returns base64 encoded image string
 */
exportCellRangeImg(cellRange: CellRange): string
```

**Parameter description:**

- `cellRange`: The cell area range to be exported, including start and end positions
  - `start`: Start cell position `{ col: number, row: number }`
  - `end`: End cell position `{ col: number, row: number }`

**Return value description:**

- Returns the base64 encoded image string of the specified cell area
- Image format is PNG
- Includes content, styles, and borders of all cells in the area

**Usage examples:**

```javascript
// Export area from row 1, column 1 to row 3, column 4
const cellRange = {
  start: { col: 0, row: 0 }, // Row 1, column 1
  end: { col: 3, row: 2 } // Row 3, column 4
};
const rangeImage = tableInstance.exportCellRangeImg(cellRange);

// Export single cell (area start and end are the same)
const singleCellRange = {
  start: { col: 1, row: 2 }, // Row 3, column 2
  end: { col: 1, row: 2 } // Same cell
};
const singleCellImage = tableInstance.exportCellRangeImg(singleCellRange);

// Export entire row
const rowRange = {
  start: { col: 0, row: 5 }, // Row 6, column 1
  end: { col: tableInstance.colCount - 1, row: 5 } // Row 6, last column
};
const rowImage = tableInstance.exportCellRangeImg(rowRange);
```

**Notes:**

- The area must be rectangular, determined by start and end positions
- Includes complete styles (background, borders, text, etc.) of all cells in the area
- Suitable for exporting specific parts of the table, such as reports, statistical areas, etc.
- The returned base64 string can be directly used as the src attribute of an image

## changeCellValue(Function)

Change the value of the cell:

```
  /**
   * Set the value of the cell, note that it corresponds to the original value of the source data, vtable instance records will be modified accordingly
   * @param col Starting column number of the cell
   * @param row Starting row number of the cell
   * @param value Changed value
   * @param workOnEditableCell Whether to only change editable cells
   * @param triggerEvent Whether to trigger change_cell_value event when the value changes
   */
  changeCellValue: (col: number, row: number, value: string | number | null, workOnEditableCell = false, triggerEvent = true) => void;
```

## changeCellValues(Function)

Batch change the values of cells:

```
  /**
   * Batch update data for multiple cells
   * @param col Starting column number for pasting data
   * @param row Starting row number for pasting data
   * @param values Data array for multiple cells
   * @param workOnEditableCell Whether to only change editable cells
   * @param triggerEvent Whether to trigger change_cell_value event when values change
   */
  changeCellValues(startCol: number, startRow: number, values: string[][], workOnEditableCell = false, triggerEvent=true) => Promise<boolean[][]>;
```

## getEditor(Function)

Get the editor configured for the cell

```
  /** Get the editor configured for the cell */
  getEditor: (col: number, row: number) => IEditor;
```

## startEditCell(Function)

Start cell editing.

If you want to change the value displayed in the edit box, you can configure value to set the change

```
  /** Start cell editing */
  startEditCell: (col?: number, row?: number, value?: string | number) => void;
```

## completeEditCell(Function)

End editing

```
  /** End editing */
  completeEditCell: () => void;
```

## cancelEditCell(Function)

Cancel editing without saving any changes

```
  /** Cancel editing */
  cancelEditCell: () => void;
```

## records

Get all data of the current table

## dataSource(CachedDataSource)

Set the data source for the VTable table component instance, for specific usage please refer to [async lazy loading data demo](../demo/performance/async-data) and [tutorial](../guide/data/async_data)

## addRecords(Function)

Add data, supports multiple data items

**ListTable specific**

```
  /**
   * Add data, supports multiple data items
   * @param records Multiple data items
   * @param recordIndex The position to insert into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default. In tree (grouping) structures, recordIndex may be an array, representing the index position of each level from the root node for that node.
   * If sorting rules are set, recordIndex is invalid, and the insertion order will be automatically determined according to the sorting logic.
   * recordIndex can be obtained through the getRecordShowIndexByCell interface
   */
  addRecords(records: any[], recordIndex?: number|number[])
```

## addRecord(Function)

Add data, single data item

**ListTable specific**

```
  /**
   * Add data, single data item
   * @param record Data
   * @param recordIndex The position to insert into the data source, starting from 0. If recordIndex is not set, it will be appended to the end by default. In tree (grouping) structures, recordIndex may be an array, representing the index position of each level from the root node for that node.
   * If sorting rules are set, recordIndex is invalid, and the insertion order will be automatically determined according to the sorting logic.
   * recordIndex can be obtained through the getRecordShowIndexByCell interface
   */
  addRecord(record: any, recordIndex?: number|number[])
```

## deleteRecords(Function)

Delete data, supports multiple data items

**ListTable specific**

```
  /**
   * Delete data, supports multiple data items
   * @param recordIndexs Index of data to be deleted (entry index displayed in body), in tree (grouping) structures, recordIndex may be an array, representing the index position of each level from the root node for that node.
   */
  deleteRecords(recordIndexs: number[]|number[][])
```

## updateRecords(Function)

Modify data, supports multiple data items

**ListTable specific**

```
  /**
   * Modify data, supports multiple data items
   * @param records Modified data items
   * @param recordIndexs Corresponding index of modified data (index displayed in body, i.e., which row of data in the body part to modify), in tree (grouping) structures, recordIndex may be an array, representing the index position of each level from the root node for that node.
   */
  updateRecords(records: any[], recordIndexs: number[]|number[][])
```

## getBodyVisibleCellRange(Function)

Get the display cell range of the table body part

```
  /** Get the display cell range of the table body part */
  getBodyVisibleCellRange: () => { rowStart: number; colStart: number; rowEnd: number; colEnd: number };
```

## getBodyVisibleColRange(Function)

Get the display column number range of the table body part

```
  /** Get the display column number range of the table body part */
  getBodyVisibleColRange: () => { colStart: number; colEnd: number };
```

## getBodyVisibleRowRange(Function)

Get the display row number range of the table body part

```
  /** Get the display row number range of the table body part */
  getBodyVisibleRowRange: () => { rowStart: number; rowEnd: number };
```

## getAggregateValuesByField(Function)

Get aggregated summary values

```
  /**
   * Get aggregated values by field
   * @param field Field name
   * Returns array, including column numbers and aggregated value arrays for each column
   */
  getAggregateValuesByField(field: string | number)
```

**ListTable specific**

## isAggregation(Function)

Determine if it's an aggregation cell

```
  isAggregation(col: number, row: number): boolean
```

**ListTable specific**

## registerCustomCellStyle(Function)

Register custom styles

```
registerCustomCellStyle: (customStyleId: string, customStyle: ColumnStyleOption | undefined | null) => void
```

Custom cell styles

- customStyleId: Unique id for custom style
- customStyle: Custom cell style, same as `style` configuration in `column`, the final presentation effect is the fusion of the original cell style and custom style

## arrangeCustomCellStyle(Function)

Assign custom styles

```
arrangeCustomCellStyle: (cellPosition: { col?: number; row?: number; range?: CellRange }, customStyleId: string) => void
```

- cellPosition: Cell position information, supports configuring single cells and cell areas
  - Single cell: `{ row: number, col: number }`
  - Cell area: `{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`
- customStyleId: Custom style id, same as the id defined when registering custom styles

## getCheckboxState(Function)

Get the selection state of all checkbox data under a field, the order corresponds to the original input data records, not the state value of the table display row

```
getCheckboxState(field?: string | number): Array
```

## getCellCheckboxState(Function)

Get the state of a checkbox in a specific cell

```
getCellCheckboxState(col: number, row: number): Array
```

## getRadioState(Function)

Get the selection state of all radio data under a field, the order corresponds to the original input data records, not the state value of the table display row

```
getRadioState(field?: string | number): number | Record<number, boolean | number>
```

## getCellRadioState(Function)

Get the state of a radio in a specific cell, if a cell contains multiple radio buttons, the return value is number, indicating the index of the selected radio in that cell, otherwise the return value is boolean

```
getCellRadioState(col: number, row: number): boolean | number
```

## setCellCheckboxState(Function)

Set the checkbox state of the cell

```
setCellCheckboxState(col: number, row: number, checked: boolean) => void
```

- col: Column number
- row: Row number
- checked: Whether selected

## setCellRadioState(Function)

Set the radio state of the cell to selected state

```
setCellRadioState(col: number, row: number, index?: number) => void
```

- col: Column number
- row: Row number
- index: Index of the target radio to be updated in the cell

## getSwitchState(Function)

Get the selection state of all switch data under a field, the order corresponds to the original input data records, not the state value of the table display row

```
getSwitchState(field?: string | number): Array
```

## getCellSwitchState(Function)

Get the state of a switch in a specific cell

```
getCellSwitchState(col: number, row: number): boolean
```

## setCellSwitchState(Function)

Set the switch state of the cell

```
setCellSwitchState(col: number, row: number, checked: boolean) => void
```

- col: Column number
- row: Row number
- checked: Whether selected

## getAllRowsHeight(Function)

Get the height of all rows in the table

```
getAllRowsHeight: () => number;
```

## getAllColsWidth(Function)

Get the width of all columns in the table

```
getAllColsWidth: () => number;
```

## getColsWidths(Function)

Get the width list of all columns in the table

```
getColsWidths: () => number[];
```

## setSortedIndexMap(Function)

Set pre-sorted index, used in scenarios with large data volumes for sorting, to improve initial sorting performance

```
setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}
```

## getHeaderField(Function)

In **ListTable**, it means getting the field corresponding to the header.
In **PivotTable**, it means getting the corresponding indicatorKey.

```
  /**Get the field corresponding to the header */
  getHeaderField: (col: number, row: number)
```

## getColWidth(Function)

Get column width

```
  /**Get column width */
  getColWidth: (col: number)
```

## getRowHeight(Function)

Get row height

```
  /**Get row height */
  getRowHeight: (row: number)
```

## setColWidth(Function)

Set column width

```
  /**Set column width */
  setColWidth: (col: number, width: number)
```

## setRowHeight(Function)

Set row height

```
  /**Set row height */
  setRowHeight: (row: number, height: number)
```

## cellIsInVisualView(Function)

Determine if the cell is in the visible area of the cell, returns true only if the cell is completely in the visible area, returns false if partially or completely outside the visible area

```
  cellIsInVisualView(col: number, row: number)
```

## getCellAtRelativePosition(Function)

Get the cell position corresponding to the coordinates relative to the top-left corner of the table.

When there is scrolling, the obtained cell is after scrolling. For example, if the currently displayed rows are 100-120, getting the cell position relative to the table top-left corner (10,100) would be (first column, row 103), assuming a row height of 40px.

```
  /**
   * Get cell information corresponding to screen coordinates, considering scrolling
   * @param this
   * @param relativeX Left x value, relative to the top-left corner of the container, scrolling has been considered
   * @param relativeY Left y value, relative to the top-left corner of the container, scrolling has been considered
   * @returns
   */
  getCellAtRelativePosition(relativeX: number, relativeY: number): CellAddressWithBound
```

## showMoverLine(Function)

Display the highlight marker line for moving columns or rows

```
  /**
   * Display the highlight line for moving columns or rows. If the (col, row) cell is a column header, display the highlight column line; if the (col, row) cell is a row header, display the highlight row line
   * @param col Which column after the header to display the highlight line
   * @param row Which row after the header to display the highlight line
   */
  showMoverLine(col: number, row: number)
```

## hideMoverLine(Function)

Hide the highlight line for moving columns or rows

```
  /**
   * Hide the highlight line for moving columns or rows
   * @param col
   * @param row
   */
  hideMoverLine(col: number, row: number)
```

## disableScroll(Function)

Disable table scrolling, if you don't want table content to scroll in business scenarios, you can call this method.

```
  /** Disable table scrolling */
  disableScroll() {
    this.eventManager.disableScroll();
  }
```

## enableScroll(Function)

Enable table scrolling

```
  /** Enable table scrolling */
  enableScroll() {
    this.eventManager.enableScroll();
  }
```

## setCanvasSize(Function)

Directly set the width and height of the canvas, not determining the table size based on container width and height

```
  /** Directly set the width and height of the canvas, not determining the table size based on container width and height */
  setCanvasSize: (width: number, height: number) => void;
```

## setLoadingHierarchyState(Function)

Set the cell's tree expand/collapse state to loading, note that you need to manually register the loading icon before use.

```
// Register loading icon
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading', // Define the name of the icon, will be used as the cache key internally
  positionType: VTable.TYPES.IconPosition.absoluteRight, // Specify position, can be before or after text, or absolutely positioned on the left/right side of the cell
  marginLeft: 0, // Left content spacing, takes effect in specific position types
  marginRight: 4, // Right content spacing, takes effect in specific position types
  visibleTime: 'always', // Display timing, 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // Hot zone size
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});

/** Set the cell's tree expand/collapse state to loading */
setLoadingHierarchyState: (col: number, row: number) => void;
```

## setPixelRatio(Function)

Set the pixel ratio of the canvas, the internal logic default value is window.devicePixelRatio. If the drawn content feels blurry, you can try setting this value higher.

Get pixelRatio canvas pixel ratio can be directly obtained through the pixelRatio property of the instance.

```
  /** Set the pixel ratio of the canvas */
  setPixelRatio: (pixelRatio: number) => void;
```

## setTranslate(Function)

Set the offset of the table

```
  /** Set the offset of the table */
  setTranslate: (x: number, y: number) => void;
```

## expandAllTreeNode(Function)

Expand all tree nodes (including headers and data rows).

**ListTable specific**

```ts
  /**
   * Expand all tree nodes (including headers and data rows).
   */
  expandAllTreeNode(): void
```

Usage:

```ts
// Expand all nodes
tableInstance.expandAllTreeNode();
```

## collapseAllTreeNode(Function)

Collapse all tree nodes (including headers and data rows).

**ListTable specific**

```ts
  /**
   * Collapse all tree nodes (including headers and data rows).
   */
  collapseAllTreeNode(): void
```

Usage:

```ts
// Collapse all nodes
tableInstance.collapseAllTreeNode();
```

## expandAllForRowTree(Function)

Expand all row header tree nodes.

**PivotTable specific**

```ts
  /**
   * Expand all row header tree nodes.
   */
  expandAllForRowTree(): void
```

Usage:

```ts
// Expand all row header tree nodes
tableInstance.expandAllForRowTree();
```

## collapseAllForRowTree(Function)

Collapse all row header tree nodes.

**PivotTable specific**

```ts
  /**
   * Collapse all row header tree nodes
   */
  collapseAllForRowTree(): void
```

Usage:

```ts
// Collapse all row header tree nodes
tableInstance.collapseAllForRowTree();
```

## expandAllForColumnTree(Function)

Expand all column header tree nodes.

**PivotTable specific**

```ts
  /**
   * Expand all column header tree nodes
   */
  expandAllForColumnTree(): void
```

Usage:

```ts
// Expand all column header tree nodes
tableInstance.expandAllForColumnTree();
```

## collapseAllForColumnTree(Function)

Collapse all column header tree nodes.

**PivotTable specific**

```ts
  /**
   * Collapse all column header tree nodes
   */
  collapseAllForColumnTree(): void
```

Usage:

```ts
// Collapse all column header tree nodes
tableInstance.collapseAllForColumnTree();
```

## updateCellContent(Function)

Update the content of a single cell. This interface only refreshes the content of the scenegraph node, not rendering. The render() interface will not actively update the content of the scenegraph node.

```ts
  /**
   * Update the content of a single cell
   */
  updateCellContent: (col: number, row: number) => void;
```
## updateCellContentRange(Function)

Update the content of a range of cells. This interface only refreshes the content of the scenegraph node, not rendering. The render() interface will not actively update the content of the scenegraph node.

```ts
  /**
   * Update the content of a range of cells
   */
  updateCellContentRange: (startCol: number, startRow: number, endCol: number, endRow: number) => void;
```

## updateCellContentRanges(Function)

Update the content of a range of cells. This interface only refreshes the content of the scenegraph node, not rendering. The render() interface will not actively update the content of the scenegraph node.

```ts
  /**
   * Update the content of a range of cells
   */
  updateCellContentRanges: (ranges: CellRange[]) => void;
```