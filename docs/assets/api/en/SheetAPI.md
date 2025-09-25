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
  exportSheetToFile: (fileType: 'csv' | 'xlsx') => void
```

### importFileToSheet(Function)

Import a file to the current sheet

```
  importFileToSheet: () => void
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

Sheet event list, you can listen to the required events according to the actual needs, to achieve customized business.
### Usage
Specific usage:

```
  import { WorkSheetEventType } from '@visactor/vtable-sheet';
  
  // Use WorkSheet instance to listen to events
  worksheet.on(WorkSheetEventType.CELL_CLICK, (args) => {
    console.log('Cell selected:', args);
  });
 
```

Supported event types:

```
export enum WorkSheetEventType {
  // Cell event
  CELL_CLICK = 'cell-click',
  CELL_VALUE_CHANGED = 'cell-value-changed',

  // Selection range event
  SELECTION_CHANGED = 'selection-changed',
  SELECTION_END = 'selection-end'
}
```
**If you want to listen to the events of the VTable component, you can get the instance of VTable through the interface, and then listen to the events through the instance**
Specific usage:
```
  const tableInstance = sheetInstance.activeWorkSheet.tableInstance;// Get the instance of the active sheet
  tableInstance.on('mousedown_cell', (args) => console.log(CLICK_CELL, args));
```

### CELL_CLICK

Cell click event

Event return parameters:

```
{
  /** Row index */
  row: number;
  /** Column index */
  col: number;
  /** Cell content */
  value?: CellValue;
  /** Cell DOM element */
  cellElement?: HTMLElement;
  /** Original event object */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```

### CELL_VALUE_CHANGED

Cell value change event

Event return parameters:

```
{
  /** Row index */
  row: number;
  /** Column index */
  col: number;
  /** New value */
  newValue: CellValue;
  /** Old value */
  oldValue: CellValue;
  /** Cell DOM element */
  cellElement?: HTMLElement;
  /** Whether caused by user operation */
  isUserAction?: boolean;
  /** Whether caused by formula calculation */
  isFormulaCalculation?: boolean;
}
```

### SELECTION_CHANGED

Selection range change event

Event return parameters:

```
{
  /** Selection range */
  ranges?: Array<{
    start: {
      row: number;
      col: number;
    };
    end: {
      row: number;
      col: number;
    };
  }>;
  /** Selected cell data */
  cells?: Array<
    Array<{
      row: number;
      col: number;
      value?: CellValue;
    }>
  >;
  /** Original event object */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```

### SELECTION_END

Selection end event (triggered when drag selection is completed)

  Event return parameters:

```
{
  /** Selection range */
  ranges?: Array<{
    start: {
      row: number;
      col: number;
    };
    end: {
      row: number;
      col: number;
    };
  }>;
  /** Selected cell data */
  cells?: Array<
    Array<{
      row: number;
      col: number;
      value?: CellValue;
    }>
  >;
  /** Original event object */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```
