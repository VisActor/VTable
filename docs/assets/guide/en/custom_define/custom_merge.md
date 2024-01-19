# Custom cell merge

## Introduction

The cell custom merging function supports users to customize the area, content, and style of cell merging, which can be used to customize labeling, summary, and other information in tables.

<div style="display: flex; justify-content: center;">
   <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-merge.png" style="flex: 0 0 50%; padding : 10px;">
</div>

The custom sample code is as follows:

```ts
const option = {
   records,
   columns,
   widthMode:'standard',
   bottomFrozenRowCount:1,
   customMergeCell: (col, row, table) => {
     if (col >= 0 && col < table.colCount && row === table.rowCount-1) {
       return {
         text: 'Summary column: This data is a piece of basic personnel information',
         range: {
           start: {
             col: 0,
             row: table.rowCount-1
           },
           end: {
             col: table.colCount-1,
             row: table.rowCount-1
           }
         },
         style:{
           borderLineWidth:[6,1,1,1],
           borderColor:['gray']
         }
       };
     }
   }
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
```

## Instructions

The customMergeCell property needs to pass in a function whose parameters are the row and column index of the current cell and the instance of the current table. The return value is an object. The properties of the object are as follows:

| Attribute name | Type | Description |
| --- | --- | --- |
| text | string | Text content of merged cells |
| range | { start: { col: number, row: number }, end: { col: number, row:number } } | Range of merged cells |
| style | ThemeStyle | The style of merged cells, the same as the ThemeStyle property |
| customRender | ICustomRender | Custom rendering function |
| customLayout | ICustomLayout | custom layout function |

For example, to merge cells with `col` from 0 to 3 and `row` from 0 to 1, you need to add a judgment in the `customMergeCell` function `col >= 0 && col < 4 && row >= 0 && row < 2`, and returns a merged cell object. The range attribute of the object should be `{ start: { col: 0, row: 0 }, end: { col: 3, row: 1 } }`, and the range of conditional judgment is The ranges in the range attribute must be consistent. If there are multiple merged areas, multiple judgments need to be added:

```ts
if (col >= 0 && col < 4 && row >= 0 && row < 2) {
   return {
     text: 'Merge area 1',
     range: {
       start: {
         col: 0,
         row: 0
       },
       end: {
         col: 3,
         row: 1
       }
     }
   };
} else if (col >= 5 && col < 7 && row === 1) {
   return {
     text: 'Merge area 2',
     range: {
       start: {
         col: 5,
         row: 1
       },
       end: {
         col: 6,
         row: 1
       }
     }
   };
}
```

If the style is not configured, the original style of the cell will be used.

## Custom rendering

In addition to configuring text content, custom cell merging can also use custom layout and custom rendering functions. By configuring the `customRender` or `customLayout` properties in the object returned by the `customMergeCell` function, you can achieve custom rendering or custom layout effects in the merged area. For detailed usage of custom rendering or custom layout, please refer to: [Custom rendering](./custom_render) and [Custom layout](./custom_layout).