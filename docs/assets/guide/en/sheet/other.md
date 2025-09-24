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
