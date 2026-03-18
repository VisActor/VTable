# Advanced Features

This chapter introduces some other usages of VTable-Sheet, including cell merging, frozen rows and columns, custom themes and styles, etc. Since VTable-Sheet is based on VTable, VTable configuration options can also be used in VTable-Sheet.

## Cell Merging

VTable-Sheet supports merging cells, which can be set in the configuration:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      // Other configurations...
      cellMerge: [
        {
          text: 'Merged Cell',  // Text displayed after merging
          range: {
            start: {
              col: 0,  // Starting column index
              row: 0   // Starting row index
            },
            end: {
              col: 2,  // Ending column index
              row: 1   // Ending row index
            },
            isCustom: true  // Mark as custom merge
          }
        },
        // Multiple merge regions can be defined
        {
          text: 'Another Merged Region',
          range: {
            start: { col: 3, row: 3 },
            end: { col: 4, row: 5 },
            isCustom: true
          }
        }
      ]
    }
  ]
});
```

## Frozen Rows and Columns

You can set frozen rows and columns in the table, keeping specific rows or columns visible when scrolling:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      // Freeze the first row and first 2 columns
      frozenRowCount: 1,
      frozenColCount: 2,
      // Other configurations...
    }
  ]
});
```

## Undo / Redo (History)

VTable-Sheet provides workbook-level undo/redo, including:
- edits inside a single sheet (cell value changes, row/column operations, resize, header drag, merge/unmerge, filter/sort, etc.)
- sheet management operations (add/remove/rename/reorder sheets)

### UI

Undo/redo buttons are enabled by default. When `mainMenu.show` is `true`, the buttons appear on the menu bar; otherwise a standalone undo/redo control is rendered at the top-left.

```ts
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  undoRedo: { show: true },
  sheets: [/* ... */]
});
```

To hide the undo/redo UI:

```ts
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  undoRedo: { show: false },
  sheets: [/* ... */]
});
```

### Shortcuts

- Ctrl/Cmd + Z: undo
- Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: redo

### Customizing history depth

VTable-Sheet uses the `HistoryPlugin` internally to record table-level operations and aggregates them into a workbook history stack. You can customize `HistoryPlugin` via `VTablePluginModules`:

```ts
import { HistoryPlugin } from '@visactor/vtable-plugins';

const sheetInstance = new VTableSheet(document.getElementById('container'), {
  VTablePluginModules: [
    {
      module: HistoryPlugin,
      moduleOptions: {
        maxHistory: 200,
        enableCompression: false
      }
    }
  ],
  sheets: [/* ... */]
});
```
