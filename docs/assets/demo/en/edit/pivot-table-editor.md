---
category: examples
group: edit
title: pivot table edit data
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table-editor.gif
link: edit/edit_cell
option: PivotTable#editor
---

# pivot table edit data

Pivot table editing data, this example enters editing mode when the mouse is clicked.

## Key Configurations

- `VTable.register.editor` registration editor
- `editor` sets the editor registration name
- `editCellTrigger` sets the time to enter editing interaction

## Code demo

```javascript livedemo template=vtable
// Need to introduce the plug-in package @visactor/vtable-editors when using it
// import * as VTable_editors from '@visactor/vtable-editors';
//Normal usage const input_editor = new VTable.editors.InputEditor();
//VTable.editors is renamed to VTable_editors in the official website editor
let tableInstance;
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input-editor', input_editor);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      dataConfig: {
        sortRules: [
          {
            sortField: 'Category',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ],
        totals: {
          row: {
            showSubTotals: true,
            subTotalsDimensions: ['Category'],
            subTotalLabel: 'subtotal'
          }
        }
      },
      editor: 'input-editor',
      editCellTrigger: 'click',
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    tableInstance.on('change_cell_value', arg => {
      console.log(arg);
    });
    window['tableInstance'] = tableInstance;
  });
```
