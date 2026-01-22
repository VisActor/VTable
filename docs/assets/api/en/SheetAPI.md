{{ target: sheet-api }}

# Sheet API

## Methods

VTableSheet instance supports the following methods:

### activateSheet(Function)

Activate the specified sheet

```
  activateSheet: (sheetKey: string) => void
```

### addSheet(Function)

Add a new sheet

```
  addSheet: (sheet: ISheetDefine) => void
```

### removeSheet(Function)

Remove the specified sheet

```
  removeSheet: (sheetKey: string) => void
```

### getSheetCount(Function)

Get the number of sheets

```
  getSheetCount: () => number
```

### getSheet(Function)

Get the definition of the specified sheet

```
  getSheet: (sheetKey: string) => ISheetDefine | null
```

### getAllSheets(Function)

Get all sheet definitions

```
  getAllSheets: () => ISheetDefine[]
```

### getActiveSheet(Function)

Get the currently active WorkSheet instance

```
  getActiveSheet: () => WorkSheet | null
```

### saveToConfig(Function)

Save all data as a configuration

```
  saveToConfig: () => IVTableSheetOptions
```

### exportSheetToFile(Function)

Export the current sheet to a file

```
  exportSheetToFile: (fileType: 'csv' | 'xlsx', allSheets: boolean = true) => void
```

### importFileToSheet(Function)

Import a file to the current sheet

```
  /** clearExisting Whether to clear existing sheets (default true means replace mode). Set false to append mode */
  importFileToSheet: (options: { clearExisting?: boolean } = { clearExisting: true }) => void
```

### exportData(Function)

  Export the data of the specified sheet

```
  exportData: (sheetKey: string) => any[][]
```

### exportAllData(Function)

Export the data of all sheets

```
  exportAllData: () => any[][]
```

### resize(Function)

Adjust the size of the table

```
  resize: () => void
```

### release(Function)

Release resources

```
  release: () => void
```

### getContainer(Function)

Get the container element

```
  getContainer: () => HTMLElement
```

### getFormulaManager(Function)

Get the formula manager

```
  getFormulaManager: () => FormulaManager
```


## Events

The list of table events, you can listen to the events you need to implement the custom business according to actual needs.
### Usage
VTableSheet provides a unified event system, supporting two types of event listening:

 1. Listen to VTable table events
Use the `onTableEvent` method to listen to the events of the underlying VTable instance.

This method listens to the events of the VTable instance, the type and the VTable supported type are completely unified, and the sheetKey property is attached to the VTable event return parameters, which is convenient for business processing.:

```typescript
import * as VTable from '@visactor/vtable';

// Listen to the cell click event
sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CLICK_CELL, (event) => {
  console.log('The cell was clicked', event.sheetKey, event.row, event.col);
});

// Listen to the cell value change event
sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, (event) => {
  console.log('The cell value was changed:', event.value, 'Position:', event.row, event.col);
});
```

 2. Listen to the spreadsheet level events
Use the `on` method to listen to the events of the spreadsheet level:

```typescript
import { VTableSheetEventType } from '@visactor/vtable-sheet';

// Listen to the formula calculation event
sheetInstance.on(VTableSheetEventType.FORMULA_ADDED, (event) => {
  console.log('The formula was added', event.sheetKey);
});

// Listen to the sheet switch event
sheetInstance.on(VTableSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log('The sheet was activated', event.sheetKey, event.sheetTitle);
});
```


### Complete event type enumeration

```typescript
export enum VTableSheetEventType {

  // ===== 数据操作事件 =====
  DATA_LOADED = 'data_loaded',

  // ===== 工作表生命周期事件 =====
  ACTIVATED = 'activated',

  // ===== 电子表格生命周期 =====
  SPREADSHEET_READY = 'spreadsheet_ready',
  SPREADSHEET_DESTROYED = 'spreadsheet_destroyed',
  SPREADSHEET_RESIZED = 'spreadsheet_resized',

  // ===== Sheet 管理事件 =====
  SHEET_ADDED = 'sheet_added',
  SHEET_REMOVED = 'sheet_removed',
  SHEET_RENAMED = 'sheet_renamed',
  SHEET_ACTIVATED = 'sheet_activated',
  SHEET_DEACTIVATED = 'sheet_deactivated',
  SHEET_MOVED = 'sheet_moved',
  SHEET_VISIBILITY_CHANGED = 'sheet_visibility_changed',

  // ===== 导入导出事件 =====
  IMPORT_START = 'import_start',
  IMPORT_COMPLETED = 'import_completed',
  IMPORT_ERROR = 'import_error',
  EXPORT_START = 'export_start',
  EXPORT_COMPLETED = 'export_completed',
  EXPORT_ERROR = 'export_error',


  // ===== 公式相关事件 =====
  FORMULA_CALCULATE_START = 'formula_calculate_start',
  FORMULA_CALCULATE_END = 'formula_calculate_end',
  FORMULA_ERROR = 'formula_error',
  FORMULA_DEPENDENCY_CHANGED = 'formula_dependency_changed',
  FORMULA_ADDED = 'formula_added',
  FORMULA_REMOVED = 'formula_removed',
}
```
