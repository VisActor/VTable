# VTable Sheet Component

VTable Sheet is a powerful Excel-like spreadsheet component based on VTable. It provides Excel-like features including multiple sheets, formulas, cell styling, and more.

## Features

- Multiple sheet support
- Formula calculation is a completely self-developed formula calculation engine
- Cell formatting
- Cell merging
- Sheet operations (add, rename, delete)
- Formula bar with auto-completion
- And more...

## Installation

```bash
npm install @visactor/vtable-sheet
```

## Usage

```typescript
import VTableSheet from '@visactor/vtable-sheet';

// Create a new VTableSheet instance
const vtableSheet = new VTableSheet(container, {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      columnCount: 10,
      rowCount: 20,
      data: [],
      active: true
    }
  ],
  showFormulaBar: true,
  showSheetTab: true
});
```

## Configuration

VTableSheet accepts the following configuration options:

```typescript
interface IVTableSheetOptions {
  /** Sheet list */
  sheets: ISheetDefine[];
  /** Whether to show toolbar */
  showToolbar?: boolean;
  /** Whether to show formula bar */
  showFormulaBar?: boolean;
  /** Whether to show sheet tab bar */
  showSheetTab?: boolean;
  /** Plugins */
  VTablePluginModules?: {
    module: any;
    moduleOptions?: any;
    disabled?: boolean;
  }[];
  /** Main menu */
  mainMenu?: {
    show?: boolean;
    items?: MainMenuItem[];
  };
  /** Theme */
  theme?: IThemeDefine;
  /** Default row height */
  defaultRowHeight?: number;
  /** Default column width */
  defaultColWidth?: number;
}
```

## Working with Formulas

VTableSheet supports Excel-like formulas, which is a completely self-developed formula calculation engine.

### Formula Storage and Persistence

When saving the sheet configuration, formulas are automatically saved in the sheet definition. 
This allows for persisting and loading formulas when the sheet is re-initialized.

The formula data is stored in the `formulas` property of each sheet definition as a map 
of cell references (A1 notation) to formula strings:

```typescript
{
  sheetKey: 'sheet1',
  sheetTitle: 'Sheet 1',
  // ... other sheet properties
  formulas: {
    'A1': '=SUM(B1:B5)',
    'C1': '=AVERAGE(D1:D10)',
    // ... more formulas
  }
}
```

### Saving Sheet Configuration

To save the current state of all sheets including formulas:

```typescript
const config = vtableSheet.saveToConfig();
console.log(config);
```

This will produce a complete configuration object that can be used to recreate the sheet later.

### Loading Sheet with Formulas

When initializing VTableSheet with a saved configuration that includes formulas, the formulas
will be automatically loaded and evaluated:

```typescript
const savedConfig = {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      data: [["Value", 10], ["Value", 20]],
      formulas: {
        'C1': '=SUM(B1:B2)'
      }
    }
  ]
};

const vtableSheet = new VTableSheet(container, savedConfig);
```

## API Reference

### Methods

- `saveToConfig()`: Saves the current state of all sheets to a configuration object.
- `getActiveSheet()`: Gets the currently active worksheet.
- `activateSheet(sheetKey: string)`: Activates the specified sheet.
- `addSheet(sheet: ISheetDefine)`: Adds a new sheet.
- `removeSheet(sheetKey: string)`: Removes a sheet.
- And more...

## Example

```typescript
// Create a VTableSheet with a formula
const vtableSheet = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      columnCount: 5,
      rowCount: 10,
      data: [
        ["Item", "Value"], 
        ["A", 10],
        ["B", 20],
        ["C", 30]
      ],
      formulas: {
        'B5': '=SUM(B2:B4)'
      }
    }
  ]
});

// Later, save the state including any user-entered formulas
const savedState = vtableSheet.saveToConfig();
localStorage.setItem('spreadsheet-state', JSON.stringify(savedState));
```
