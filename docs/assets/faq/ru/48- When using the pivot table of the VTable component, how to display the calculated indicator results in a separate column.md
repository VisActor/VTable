---
title: 26. When using the pivot table of the VTable component, how to display the calculated indicator results in a separate column?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

When using the pivot table of the VTable component, how to display the calculated indicator results in a separate column?</br>
## Question Description

Is there any configuration that can generate derived indicators? Calculate the indicator results after aggregation, and then display them in the indicator.</br>
Description: For example, my row dimension is region - area, column dimension is month, and indicator is target, actual, and achievement (this achievement is calculated as actual / target). Achievement is the indicator I want to derive, because there is no achievement field in my data.</br>
Screenshot of the problem:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V0NCbqaOKoJmitxZvkVcZ4cCn1f.gif' alt='' width='1347' height='260'>

## Solution

**The best and latest solution: **There is now a better solution because VTable has launched the feature of Pivot Table calculated fields!!!</br>
**Previous solution:**</br>
Taking the pivot table on the official website of VTable as an example for similar target modifications, we add an indicator called `Profit Ratio` to the original demo, and use the `format` function to calculate the displayed value. The calculation logic depends on the values of the `Sales` and `Profit` indicators. That is, we calculate a profit ratio where `profit ratio = profit / sales`.</br>
```
        {
          indicatorKey: 'Profit Ratio',
          title: 'Profit Ratio',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: (value,col,row,table) => {
            const sales=table.getCellOriginValue(col-2,row);
            const profit=table.getCellOriginValue(col-1,row);
            const ratio= profit/sales;
            var percentage = ratio * 100;
            return percentage.toFixed(2) + "%";
          }
        }</br>
```
## Code Examples

```
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
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
        },
        {
          indicatorKey: 'Profit Ratio',
          title: 'Profit Ratio',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: (value,col,row,table) => {
            const sales=table.getCellOriginValue(col-2,row);
            const profit=table.getCellOriginValue(col-1,row);
            const ratio= profit/sales;
            var percentage = ratio * 100;
            return percentage.toFixed(2) + "%";
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
        ]
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });</br>
```
## Result Display

Just paste the code in the example code directly into the official editor to display it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Wxc7bfIQfoLb29xabyjc1ov4n6c.gif' alt='' width='853' height='540'>

## Related documents

Tutorial on pivot table usage: [https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_useage](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Ftable_type%2FPivot_table%2Fpivot_table_useage)</br>
Demo of pivot table usage: [https://visactor.io/vtable/demo/table-type/pivot-analysis-table](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Ftable-type%2Fpivot-analysis-table)</br>
Related API: [https://visactor.io/vtable/option/PivotTable#indicators](https%3A%2F%2Fvisactor.io%2Fvtable%2Foption%2FPivotTable%23indicators)</br>
github：https://github.com/VisActor/VTable</br>

