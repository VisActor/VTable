---
title: 26. 使用VTable表格组件的透视表时，怎么将指标结果再计算后显示到单独的一列当中？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

使用VTable表格组件的透视表时，怎么将指标结果再计算后显示到单独的一列当中？</br>
## 问题描述

有什么配置可以生成派生指标吗，把聚合之后的指标结果再进行计算，然后展示到指标里面</br>
描述：比如我的行维度是大区-地区，列维度是月份，指标是目标、实际，达成(这个达成的计算为实际/目标)，达成就是我想派生的指标，因为的数据里面没有达成的字段。</br>
问题截图：</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Q0DzbVYWpo7M7HxaJgxcrCVfnKa.gif' alt='' width='1347' height='260'>

## 解决方案 

**最新最好的解决方法：**目前已经有了更好的解决方案，因为VTable又推出了透视表计算字段的功能！！！</br>
**之前旧的解决方法：**</br>
使用VTable官网的透视分析表为例进行类似目标的修改，我们在原有的demo中增加一个指标为`Profit Ratio`，显示的值用`format`函数进行计算，计算逻辑依赖于`Sales`和`Profit`两个指标的值。也就是我们计算了一个利润比，其中`利润比 = 利润 / 销售额`。</br>
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
## 代码示例  

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
## 结果展示 

直接将示例代码中代码粘贴到官网编辑器中即可呈现。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PTqsbSor5oxIYbxC6Ckcg69Unpf.gif' alt='' width='853' height='540'>

## 相关文档

透视分析表用法教程：https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_useage</br>
透视分析表用法demo：https://visactor.io/vtable/demo/table-type/pivot-analysis-table</br>
相关api：https://visactor.io/vtable/option/PivotTable#indicators</br>
github：https://github.com/VisActor/VTable</br>

