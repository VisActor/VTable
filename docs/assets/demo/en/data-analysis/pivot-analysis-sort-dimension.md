---
category: examples
group: data-analysis
title: Sort Dimension
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-sort-dimension.png
link: '../guide/table_type/Pivot_table/pivot_table_dataAnalysis'
option: PivotTable#dataConfig.sortRules
---

# Sort dimension values of pivot analysis table

The pivot table is sorted according to the dimension value of a certain dimension. SortRules can be configured in dataConfig. Multiple sorting rules can be configured. The one configured first has a higher priority.

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `enableDataAnalysis` turns on pivot data analysis
- `dataConfig` configures data rules, optional configuration items
## Code demo

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
records:data,
  "rows": [
      {
         "dimensionKey": "Category",
          "title": "Category",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
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
                  "indicatorKey": "Quantity",
                  "title": "Quantity",
                  "width": "auto",
                  "showSort": false,
                  "headerStyle":{
                    fontWeight: "normal",
                  },
                   style:{
                    padding:[16,28,16,28],
                    color(args){
                      if(args.dataValue>=0)
                      return 'black';
                      return 'red'
                    }
                   }
              },
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
              },
              {
                  "indicatorKey": "Profit",
                  "title": "Profit",
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
      },
      {
        sortField: 'Sub-Category',
        sortBy: ['Chairs', 'Tables','Labels', 'Art', 'Paper', 'Appliances']
      }
    ],
  },
  enableDataAnalysis: true,
  widthMode:'standard'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
