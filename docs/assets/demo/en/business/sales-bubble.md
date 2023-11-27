---
category: examples
group: table-type
title: Pivot analysis table
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table.png
link: '../guide/table_type/Pivot_table/pivot_table_dataAnalysis'
option: PivotTable#enableDataAnalysis
---

# Pivot analysis table

Pivot analysis table

## Key Configurations

- `PivotTable`
- `columns` 
- `rows`
- `indicators`
- `enableDataAnalysis` turns on pivot data analysis
- `dataConfig` configures data rules, optional configuration items
##  Code demo

```javascript livedemo template=vtable

let  tableInstance;
   fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
records:data,
  "rows": [
      {
         "dimensionKey": "Sub-Category",
          "title": "Sub-Catogery",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
  ],
  "columns": [
      {
         "dimensionKey": "Region",
          "title": "Region",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
       {
         "dimensionKey": "Segment",
          "title": "Segment",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
  ],
  "indicators": [
              {
                  "indicatorKey": "Sales",
                  "title": "Sales",
                  "width": "auto",
                  "showSort": false,
                  "headerStyle":{
                    fontWeight: "normal",
                  },
                  "format":(rec)=>{return '$'+Number(rec).toFixed(2)},
                  style:{
                    padding:[16,28,16,28],
                    color(args){
                      if(args.dataValue>=0)
                      return 'black';
                      return 'red'
                    }
                   }
              }
          ],
  "corner": {
      "titleOnDimension": "row",
      "headerStyle": {
          "textStick": true
      }
  },
  dataConfig: {
    sortRules: [
      {
        sortField: 'Category',
        sortBy: ['Office Supplies', 'Technology','Furniture']
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
  hideIndicatorName: true,
  enableDataAnalysis: true,
  widthMode:'standard'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
