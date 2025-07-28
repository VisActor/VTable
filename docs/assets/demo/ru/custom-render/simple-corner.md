---
category: examples
group: Custom
title: Custom simple corner
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/simple-corner.jpeg
option: ListTable-columns-text#customRender.elements
---

In a pivot table, sometimes it is necessary to implement a slanted header. This can be achieved by customizing `customRender` or `customLayout` in the `corner` area.

```js
option = {
  // ...other config...
  corner: {
    titleOnDimension: 'row',
      headerStyle: {
      textStick: true
    },
    customLayout: (args) => {
      const {table, row, col, rect} = args;
      const {height, width} = rect ?? table.getCellRect(col, row);
      const container = createGroup({
        height,
        width,
      });
      // .... other fun call

      return {
        rootContainer: container,
        renderDefault: false,
        enableCellPadding: false,
      };
    }
  }
}
```

## Code Sample

```javascript livedemo template=vtable
// only use for website
const {createGroup, createText, createLine} = VRender;
// use this for project
// import {createGroup, createText, createLine} from '@visactor/vtable/es/vrender';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        },
        customLayout: (args) => {
          const {table, row, col, rect} = args;
          const {height, width} = rect ?? table.getCellRect(col, row);
          const container = createGroup({
            height,
            width,
          });

          // 定义文本内容的数组
          const texts = [
            {text: 'Type', fontSize: 18, x: 40, y: rect.height - 30},
            {text: 'Data', fontSize: 18, x: rect.width - 60, y: 20},
          ];

          // add corner text
          texts.forEach(({text, fontSize, x, y}) => {
            container.addChild(
              createText({
                text,
                fontSize,
                fontFamily: 'sans-serif',
                fill: 'black',
                x,
                y,
              })
            );
          });

          // define the point
          const linePoints = [
            {x: 0, y: 0},
            {x: rect.width, y: rect.height}
          ];

          // add line
          container.addChild(
            createLine({
              points: linePoints,
              lineWidth: 1,
              stroke: '#ccc',
            })
          );

          return {
            rootContainer: container,
            renderDefault: false,
            enableCellPadding: false,
          };
        }
      },
      rows: [
        {
          dimensionKey: 'City',
          title: 'City',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Category',
          title: 'Category',
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
      dataConfig: {
        sortRules: [
          {
            sortField: 'Category',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
