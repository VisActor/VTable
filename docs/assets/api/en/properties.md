{{ target: table-properties }}

# Properties

List of table instance properties, containing readable and writable configuration properties. Note: Some properties are read-only, direct assignment will not trigger table redraw, you must use the corresponding update method to take effect.

## records

The data source array of the table, containing all data records to be displayed. This is a **read-only property** used to get the current table data, direct assignment modification is not supported.

**Type:** `Array<any>`

```javascript
// ✅ Correct: Use setRecords method to update data
tableInstance.setRecords([
  { name: 'Zhang San', age: 25, department: 'Technology Department' },
  { name: 'Li Si', age: 30, department: 'Marketing Department' }
]);

```

**Notes:**
- `records` property is **read-only**, direct assignment will not trigger table redraw
- To update data, you must use the `setRecords()` method
- `setRecords()` will handle the complete process of data sorting, state updates, layout recalculation, etc.

## rowCount

The total number of rows in the table, including headers and data rows. This is a read-only property representing the total number of rows in the current table.

**Type:** `number`

**Usage examples:**
```javascript
const totalRows = tableInstance.rowCount;
console.log('Total table rows:', totalRows);

// Iterate through all rows
for (let row = 0; row < tableInstance.rowCount; row++) {
  for (let col = 0; col < tableInstance.colCount; col++) {
    const value = tableInstance.getCellValue(col, row);
    console.log(`Cell[${col},${row}]:`, value);
  }
}
```

**Notes:**
- Includes header rows and data rows
- For pivot tables, includes row header levels
- Is dynamically calculated and automatically updates as data changes

## colCount

The total number of columns in the table, including row headers and data columns. This is a read-only property representing the total number of columns in the current table.

**Type:** `number`

**Usage examples:**
```javascript
const totalCols = tableInstance.colCount;
console.log('Total table columns:', totalCols);

// Check if column index is valid
function isValidCell(col, row) {
  return col >= 0 && col < tableInstance.colCount &&
         row >= 0 && row < tableInstance.rowCount;
}

// Get data from the last column
const lastCol = tableInstance.colCount - 1;
for (let row = 0; row < tableInstance.rowCount; row++) {
  const value = tableInstance.getCellValue(lastCol, row);
  console.log(`Last column row ${row}:`, value);
}
```

**Notes:**
- Includes row header columns and data columns
- For pivot tables, includes column header levels
- Is dynamically calculated and automatically updates as column configuration changes

## rowHeaderLevelCount

Number of row header levels

## columnHeaderLevelCount

Number of column header levels

## frozenColCount

Number of frozen columns

## frozenRowCount

Number of frozen rows

## rightFrozenColCount

Number of right frozen columns

## bottomFrozenRowCount

Number of bottom frozen rows

## theme

The table theme configuration object, controlling the overall appearance of the table, including colors, fonts, borders, etc. Read-only property.

**Type:** `ITableThemeDefine`

**Usage examples:**
```javascript
// Get current theme
const currentTheme = tableInstance.theme;
console.log('Current theme configuration:', currentTheme);

// Use updateTheme method (automatic refresh)
tableInstance.updateTheme({
  headerStyle: {
    bgColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold'
  },
  bodyStyle: {
    bgColor: '#ffffff',
    fontSize: 12
  }
}); // Recommended way, automatically handles refresh
```

**Important notes:**
- ⚠️ **Or use the `updateTheme()` method, it will automatically handle refresh**
- Theme configuration contains multiple levels: table level, column level, cell level
- Modifying the theme will affect the overall appearance of the entire table

## widthMode

The width mode of the table, controlling how column widths are calculated and adjusted.

**Type:** `'standard' | 'adaptive' | 'autoWidth'`

**Default value:** `'standard'`

**Mode descriptions:**
- `'standard'`: Standard mode, uses configured column width or default column width
- `'adaptive'`: Adaptive mode, table width automatically adapts to container width
- `'autoWidth'`: Auto width mode, column width automatically adjusts based on content

**Usage examples:**
```javascript
// Get current width mode
const currentMode = tableInstance.widthMode;
console.log('Current width mode:', currentMode);

// Set width mode (requires manual refresh to take effect)
tableInstance.widthMode = 'adaptive';
tableInstance.renderWithRecreateCells(); // Must manually refresh!

// When batch updating multiple configurations, refresh uniformly at the end
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight';
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // Unified refresh
```

**Important notes:**
- ⚠️ **Direct assignment will not automatically trigger table redraw**
- ⚠️ **Must manually call `renderWithRecreateCells()` method to take effect**
- Different modes will affect column width calculation methods
- In 'autoWidth' mode, column width automatically adjusts based on the longest content
- It is recommended to refresh uniformly after batch updating configurations to avoid repeated rendering

## heightMode

The height mode of the table, controlling how row heights are calculated and adjusted.

**Type:** `'standard' | 'adaptive' | 'autoHeight'`

**Default value:** `'standard'`

**Mode descriptions:**
- `'standard'`: Standard mode, uses configured row height or default row height
- `'adaptive'`: Adaptive mode, table height automatically adapts to container height
- `'autoHeight'`: Auto height mode, row height automatically adjusts based on content

**Usage examples:**
```javascript
// Get current height mode
const currentMode = tableInstance.heightMode;
console.log('Current height mode:', currentMode);

// Set height mode (requires manual refresh to take effect)
tableInstance.heightMode = 'adaptive';
tableInstance.renderWithRecreateCells(); // Must manually refresh!

// When batch updating multiple configurations, refresh uniformly at the end
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight';
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // Unified refresh
```

**Important notes:**
- ⚠️ **Direct assignment will not automatically trigger table redraw**
- ⚠️ **Must manually call `renderWithRecreateCells()` method to take effect**
- Different modes will affect row height calculation methods
- In 'autoHeight' mode, row height automatically adjusts based on content
- It is recommended to refresh uniformly after batch updating configurations to avoid repeated rendering

## autoWrapText

Controls whether text in the table automatically wraps. When set to true, text content exceeding column width will automatically wrap to the next line.

**Type:** `boolean`

**Default value:** `false`

**Usage examples:**
```javascript
// Get current auto wrap setting
const currentWrap = tableInstance.autoWrapText;
console.log('Current auto wrap:', currentWrap);

// Set auto wrap (requires manual refresh to take effect)
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // Must manually refresh!

// Use updateAutoWrapText method (automatic refresh)
tableInstance.updateAutoWrapText(true); // Recommended way, automatically handles refresh

// When batch updating multiple configurations, refresh uniformly at the end
tableInstance.autoWrapText = true;
tableInstance.heightMode = 'autoHeight'; // Usually used with auto height mode
tableInstance.renderWithRecreateCells(); // Unified refresh
```

**Important notes:**
- ⚠️ **Direct assignment will not automatically trigger table redraw**
- ⚠️ **Must manually call `renderWithRecreateCells()` method to take effect**
- ⚠️ **Or use the `updateAutoWrapText()` method, it will automatically handle refresh**
- After enabling, it will affect row height calculation
- Usually used with `heightMode = 'autoHeight'` for best results
- For tables containing long text, enabling this feature can improve readability

## columns

The table column configuration array, defining display properties, data fields, styles, and other configuration information for each column. This is a **read-only property** used to get the current column configuration, direct assignment modification is not supported.

**Type:** `ColumnsDefine[]`

**Access examples:**
```javascript
// Get current column configuration (read-only access)
const currentColumns = tableInstance.columns;
console.log('Current column configuration:', currentColumns);
console.log('Number of columns:', currentColumns.length);
```

```javascript
// ✅ Correct: Use updateColumns method to update column configuration
tableInstance.updateColumns([
  {
    field: 'name',
    title: 'Name',
    width: 100,
    sort: true
  },
  {
    field: 'age',
    title: 'Age',
    width: 80,
    sort: true
  }
]);

```

**Notes:**
- `columns` property is **read-only**, direct assignment will not trigger table redraw
- To update column configuration, you must use the `updateColumns()` method
- `updateColumns()` will handle the complete process of layout recalculation, scene graph reconstruction, etc.
- Directly modifying the returned array will not affect table display

## transpose

Controls whether the table is displayed transposed. When set to true, rows and columns will swap positions, original columns become rows, and original rows become columns.

**Type:** `boolean`

**Default value:** `false`

**Usage examples:**
```javascript
// Get current transpose status
const isTransposed = tableInstance.transpose;
console.log('Is transposed:', isTransposed);

// Enable transpose
tableInstance.transpose = true;

// Disable transpose
tableInstance.transpose = false;

// Toggle transpose status
tableInstance.transpose = !tableInstance.transpose;
```

**Notes:**
- After modification, it will completely change the table's display structure
- Will affect all row and column related operations
- Special attention should be paid to dimension changes when used in pivot tables

## rowHierarchyType

Controls the display mode of row hierarchy structure in pivot tables, supporting both flat and tree modes. Read-only property.

**Type:** `'grid' | 'tree'`

**Default value:** `'grid'`

**PivotTable specific**

**Mode descriptions:**
- `'grid'`: Flat mode, all hierarchy structures are displayed expanded at the same level
- `'tree'`: Tree mode, hierarchy structures are displayed in tree structure, supporting expand/collapse

**Usage examples:**
```javascript
// Get current hierarchy structure type
const hierarchyType = tableInstance.rowHierarchyType;
console.log('Row hierarchy structure type:', hierarchyType);
```

**Notes:**
- Only valid in pivot tables
- In tree mode, needs to be used with expand/collapse functionality

## scrollLeft

The position of the table's horizontal scrollbar, representing the pixel distance the table content scrolls in the horizontal direction. This is a read-write property that can be directly assigned to set the scroll position.

**Type:** `number`

**Default value:** `0`

**Usage examples:**
```javascript
// Get current horizontal scroll position
const currentScrollLeft = tableInstance.scrollLeft;
console.log('Current horizontal scroll position:', currentScrollLeft);

// Set horizontal scroll position (supports direct assignment)
tableInstance.scrollLeft = 200; // Scroll to 200 pixel position

// Scroll to far right
const maxScrollLeft = tableInstance.getAllColsWidth() - tableInstance.tableNoFrameWidth;
tableInstance.scrollLeft = maxScrollLeft;

// Use scrollTo method (recommended way)
tableInstance.scrollTo({ col: 5, row: 0 }); // Scroll to column 6
```

**Important notes:**
- ✅ **Supports direct assignment**, assignment will automatically trigger table redraw
- The value unit is pixels, representing the scroll distance
- Can be used with `scrollToCell` or `scrollTo` methods
- When setting values out of range, they will be automatically adjusted to valid range


## scrollTop

The position of the table's vertical scrollbar, representing the pixel distance the table content scrolls in the vertical direction. This is a read-write property that can be directly assigned to set the scroll position.

**Type:** `number`

**Default value:** `0`

**Usage examples:**
```javascript
// Get current vertical scroll position
const currentScrollTop = tableInstance.scrollTop;
console.log('Current vertical scroll position:', currentScrollTop);

// Set vertical scroll position (supports direct assignment)
tableInstance.scrollTop = 150; // Scroll to 150 pixel position

// Scroll to bottom
const maxScrollTop = tableInstance.getAllRowsHeight() - tableInstance.tableNoFrameHeight;
tableInstance.scrollTop = maxScrollTop;

// Use scrollTo method (recommended way)
tableInstance.scrollTo({ col: 0, row: 10 }); // Scroll to row 11
```

**Important notes:**
- ✅ **Supports direct assignment**, assignment will automatically trigger table redraw
- The value unit is pixels, representing the scroll distance
- Can be used with `scrollToCell` or `scrollTo` methods
- When setting values out of range, they will be automatically adjusted to valid range


## pixelRatio

The pixel ratio of the canvas, controlling the display clarity of the table on high DPI screens. Read-only property.

**Type:** `number`

**Default value:** `window.devicePixelRatio || 1`

**Usage examples:**
```javascript
// Get current pixel ratio
const currentPixelRatio = tableInstance.pixelRatio;
console.log('Current pixel ratio:', currentPixelRatio);

// Set pixel ratio to improve display clarity (supports direct assignment)
tableInstance.setPixelRatio(2); // Set to 2x pixel ratio

// Adjust automatically based on device
const dpr = window.devicePixelRatio || 1;
tableInstance.setPixelRatio(dpr);

// Refresh uniformly when batch updating configurations
const originalPixelRatio = tableInstance.pixelRatio;
tableInstance.setPixelRatio(1.5);
```

**Important notes:**
- The larger the value, the clearer the display, but the greater the performance consumption
- Usually set to `window.devicePixelRatio` for best display effect, if browser is zoomed, need to set to the pixel ratio after browser zoom
- After modification, it will affect the rendering quality of the entire table
- On high DPI devices like Retina screens, it is recommended to set to 2 or higher
