---
category: examples
group: Style
title: 样式
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/style.png
order: 5-1
link: '/guide/theme_and_style/style'
---

# 样式

在这个例子中，通过配置headerStyle和style分别配置了表头和body的样式。透视表列维度Category相同的全部置为相同背景色，指标中的Quantity，Sales和Profit分别设置不同的字体颜色。

## 关键配置

-`headerStyle` 配置某个维度的表头样式

-`style` 配置某个维度或者指标body部分的样式

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_pivot.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
        parentElement: document.getElementById(CONTAINER_ID),
        records: data,
        "rowTree": [{
            "dimensionKey": "230517143221047",
            "value": "Aberdeen"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Abilene"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Akron"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Albuquerque"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Alexandria"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Allen"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Allentown"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Altoona"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Amarillo"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Anaheim"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Andover"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Ann Arbor"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Antioch"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Apopka"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Apple Valley"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Appleton"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Arlington"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Arlington Heights"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Arvada"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Asheville"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Athens"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Atlanta"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Atlantic City"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Auburn"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Aurora"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Austin"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Avondale"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bakersfield"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Baltimore"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bangor"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bartlett"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bayonne"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Baytown"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Beaumont"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bedford"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Belleville"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bellevue"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bellingham"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bethlehem"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Beverly"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Billings"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bloomington"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Boca Raton"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Boise"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bolingbrook"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bossier City"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bowling Green"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Boynton Beach"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Bozeman"
          },
          {
            "dimensionKey": "230517143221047",
            "value": "Brentwood"
          }
        ],
        "columnTree": [{
            "dimensionKey": "230517143221023",
            "value": "Office Supplies",
            "children": [{
                "indicatorKey": "230517143221042"
              },
              {
                "indicatorKey": "230517143221040"
              },
              {
                "indicatorKey": "230517143221041"
              }
            ]
          },
          {
            "dimensionKey": "230517143221023",
            "value": "Technology",
            "children": [{
                "indicatorKey": "230517143221042"
              },
              {
                "indicatorKey": "230517143221040"
              },
              {
                "indicatorKey": "230517143221041"
              }
            ]
          },
          {
            "dimensionKey": "230517143221023",
            "value": "Furniture",
            "children": [{
                "indicatorKey": "230517143221042"
              },
              {
                "indicatorKey": "230517143221040"
              },
              {
                "indicatorKey": "230517143221041"
              }
            ]
          }
        ],
        "rows": [{
          "dimensionKey": "230517143221047",
          "dimensionTitle": "City",
          "headerStyle": {
            "textStick": true,
            "bgColor": "#356b9c",
            "color": "#00ffff"
          },
          "width": "auto",
        }, ],
        "columns": [{
          "dimensionKey": "230517143221023",
          "dimensionTitle": "Category",
          "headerStyle": {
            "textStick": true,
            "bgColor":(arg) => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(
                arg.col,
                arg.row,
              );
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies'
              )
                {return '#bd422a';}
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology'
              )
                {return '#ff9900';}
              return 'gray';
            }
          },
          "width": "auto",
        },
      {
          "dimensionKey": "230517143221023",
          "dimensionTitle": "Category",
          "headerStyle": {
            "textStick": true,
            "bgColor":(arg) => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(
                arg.col,
                arg.row,
              );
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                {return '#bd422a';}
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology'
              )
                {return '#ff9900';}
              return 'gray';
            }
          },
          "width": "auto",
        }, ],
        "indicators": [{
            "indicatorKey": "230517143221042",
            "caption": "Quantity",
            "width": "auto",
            "showSort": false,
            "style":{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                  return 'black';
                return 'red'
              },
              "fontWeight": 'bold',
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if (
                    cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies'
                )
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology'
                )
                  {return '#ff9900';}
                return 'gray';
              }
            },
            "headerStyle": {
              "color": 'black',
              fontWeight: "normal",
              "textStick": true,
              "fontWeight": 'bold',
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology')
                  {return '#ff9900';}
                return 'gray';
              }
            },
            "format":(rec)=>{return '$'+Number(rec['230517143221042']).toFixed(2)},
          },
          {
            "indicatorKey": "230517143221040",
            "caption": "Sales",
            "width": "auto",
            "showSort": false,
            "style":{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                  return 'black';
                return 'blue'
              },
              fontWeight: "normal",
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology')
                  {return '#ff9900';}
                return 'gray';
              }
            },
            "headerStyle": {
              "textStick": true,
              "color": 'blue',
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology')
                  {return '#ff9900';}
                return 'gray';
              }
            },
             "format":(rec)=>{return '$'+Number(rec['230517143221040']).toFixed(2)},
          },
          {
            "indicatorKey": "230517143221041",
            "caption": "Profit",
            "width": "auto",
            "showSort": false,
            "style":{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                  return 'black';
                return 'white'
              },
              fontWeight: "normal",
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if(arg.dataValue<0)
                  return 'purple';
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology')
                  {return '#ff9900';}
                return 'gray';
              }
            },
            "headerStyle": {
              "color": 'white',
              "textStick": true,
              "bgColor":(arg) => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(
                  arg.col,
                  arg.row,
                );
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies')
                  {return '#bd422a';}
                if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology')
                  {return '#ff9900';}
                return 'gray';
              }
            },
             "format":(rec)=>{return '$'+Number(rec['230517143221041']).toFixed(2)},
          }
        ],
        "corner": {
          "titleOnDimension": "row",
          "headerStyle": {
            "textStick": true,
            "bgColor": "#356b9c",
            "color": "#00ffff"
          }
        },
        widthMode: 'standard'
      };
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
