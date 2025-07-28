---
category: examples
group: compilation
title: Display Dimension Names in Pivot Table Corner
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table-corner-title.png
link: table_type/Pivot_table/pivot_table_useage
option: PivotTable#corner
---

# Display Dimension Names in Pivot Table Corner

Set the corner title display content basis to `'all'`, and the corner cell content will be a concatenation of row dimension names and column dimension names.

`titleOnDimension` corner title display content basis:

- `'column'` Column dimension name as corner cell content
- `'row'` Row dimension name as corner cell content
- `'none'` Corner cell content is empty
- `'all'` Corner cell content is a concatenation of row dimension names and column dimension names

## Key Configuration

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `corner.titleOnDimension` Corner title display content basis

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <PivotTable :options="tableOptions" />
  `,
  data() {
    return {
      tableOptions: {}
    };
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
      .then(res => res.json())
      .then(data => {
        this.tableOptions = {
          records: data,
          rows: [
            {
              dimensionKey: 'Category',
              title: 'Category',
              headerStyle: {
                textStick: true,
                bgColor(arg) {
                  if (arg.dataValue === 'Row Totals') {
                    return '#ff9900';
                  }
                  return '#ECF1F5';
                }
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
              sort: true,
              headerStyle: {
                fontWeight: 'normal'
              },
              style: {
                padding: [16, 28, 16, 28],
                color(args) {
                  if (args.dataValue >= 0) return 'black';
                  return 'red';
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                    return '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                    return '#ff9900';
                  }
                  return undefined;
                }
              }
            },
            {
              indicatorKey: 'Sales',
              title: 'Sales',
              width: 'auto',
              sort: true,
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
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                    return '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                    return '#ff9900';
                  }
                  return undefined;
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
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                    return '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                    return '#ff9900';
                  }
                  return undefined;
                }
              }
            }
          ],
          corner: {
            titleOnDimension: 'all'
          },
          widthMode: 'standard'
        };
      });
  }
});

app.component('PivotTable', VueVTable.PivotTable);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
