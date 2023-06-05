---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 项目进度表

该示例通过设置背景色来展示整体排期高亮，又根据项目工期长短来生成整行背景色，通过色阶视觉效果来加强对总工期较长项目的关注。

## 关键配置

-`theme.bgColor` 通过函数定义方式根据条件设置背景色

## 代码演示

```ts
function getColor(min, max, n) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') return 'rgb(255,255,255)';
  const c = (n - min) / (max - min)+0.1;
  const red = (1 - c) * 200+55;
  const green = (1 - c) * 200+55;
  return `rgb(${red},${green},255)`;
}
const records = [
  {
    'projectName': '项目一',
    "startTime": "2023/5/1",
    "endTime": "2023/5/10",
    "estimateDays": 10,
    "date1":1,
    "date2":1,
    "date3":1,
    "date4":1,
    "date5":1,
    "date6":1,
    "date7":1,
    "date8":1,
    "date9":1,
    "date10":1
  },
  {
    'projectName': '项目二',
    "startTime": "2023/5/1",
    "endTime": "2023/5/5",
    "estimateDays": 5,
    "date1":1,
    "date2":1,
    "date3":1,
    "date4":1,
    "date5":1,
  },
  {
    'projectName': '项目三',
    "startTime": "2023/5/7",
    "endTime": "2023/5/8",
    "estimateDays": 3,
    "date6":1,
    "date7":1,
    "date8":1,
  },
  {
    'projectName': '项目四',
    "startTime": "2023/5/11",
    "endTime": "2023/5/12",
    "estimateDays": 2,
    "date11":1,
    "date12":1,
  },
  {
    'projectName': '项目五',
    "startTime": "2023/5/0",
    "endTime": "2023/5/10",
    "estimateDays": 2,
    "date9":1,
    "date10":1,
  },
   {
    'projectName': '项目六',
    "startTime": "2023/5/11",
    "endTime": "2023/5/15",
    "estimateDays": 5,
    "date11":1,
    "date12":1,
    "date13":1,
    "date14":1,
    "date15":1,
  },
  {
    'projectName': '项目七',
    "startTime": "2023/5/16",
    "endTime": "2023/5/19",
    "estimateDays": 4,
    "date16":1,
    "date17":1,
    "date18":1,
    "date19":1,
  },
     {
    'projectName': '项目八',
    "startTime": "2023/5/13",
    "endTime": "2023/5/15",
    "estimateDays": 3,
    "date13":1,
    "date14":1,
    "date15":1,
  },
  {
    'projectName': '项目九',
    "startTime": "2023/5/20",
    "endTime": "2023/5/21",
    "estimateDays": 2,
    "date20":1,
    "date21":1,
  },
  {
    'projectName': '项目十',
    "startTime": "2023/5/16",
    "endTime": "2023/5/21",
    "estimateDays": 6,
    "date16":1,
    "date17":1,
    "date18":1,
    "date19":1,
    "date20":1,
    "date21":1,
  }
];
const columns =[
    {
        "field": "projectName",
        "caption": "项目名称",
        "width": "auto",
        "style":{
          color:'#ff689d',
          fontWeight:'bold'
        }
    },
    {
        "field": "startTime",
        "caption": "开始时间",
        "width": "auto",
    },
    {
        "field": "endTime",
        "caption": "结束时间",
        "width": "auto"
    },
    {
        "field": "estimateDays",
        "caption": "工期（天）",
        "width": "auto",
        "style":{
          color:'red'
        }
    },
    {
        "caption": "时间段:2023/5/1-2023/5/15",
        "headerStyle":{
          textAlign:'center'
        },
        "columns":[
          {
            "caption": "周一",
            "width": "auto",
             "columns":[
              {
                "field": "date1",
                "caption": "1",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周二",
            "width": "auto",
             "columns":[
              {
                "field": "date2",
                "caption": "2",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周三",
            "width": "auto",
             "columns":[
              {
                "field": "date3",
                "caption": "3",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周四",
            "width": "auto",
             "columns":[
              {
                "field": "date4",
                "caption": "4",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周五",
            "width": "auto",
             "columns":[
              {
                "field": "date5",
                "caption": "5",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周六",
            "width": "auto",
             "columns":[
              {
                "field": "date6",
                "caption": "6",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周日",
            "width": "auto",
             "columns":[
              {
                "field": "date7",
                "caption": "7",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "caption": "周一",
            "width": "auto",
             "columns":[
              {
                "field": "date8",
                "caption": "8",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周二",
            "width": "auto",
             "columns":[
              {
                "field": "date9",
                "caption": "9",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周三",
            "width": "auto",
             "columns":[
              {
                "field": "date10",
                "caption": "10",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周四",
            "width": "auto",
             "columns":[
              {
                "field": "date11",
                "caption": "11",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周五",
            "width": "auto",
             "columns":[
              {
                "field": "date12",
                "caption": "12",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周六",
            "width": "auto",
             "columns":[
              {
                "field": "date13",
                "caption": "13",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周日",
            "width": "auto",
             "columns":[
              {
                "field": "date14",
                "caption": "14",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周一",
            "width": "auto",
             "columns":[
              {
                "field": "date15",
                "caption": "15",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
          {
            "caption": "周二",
            "width": "auto",
             "columns":[
              {
                "field": "date16",
                "caption": "16",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周三",
            "width": "auto",
             "columns":[
              {
                "field": "date17",
                "caption": "17",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周四",
            "width": "auto",
             "columns":[
              {
                "field": "date18",
                "caption": "18",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周五",
            "width": "auto",
             "columns":[
              {
                "field": "date19",
                "caption": "19",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周六",
            "width": "auto",
             "columns":[
              {
                "field": "date20",
                "caption": "20",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
           {
            "caption": "周日",
            "width": "auto",
             "columns":[
              {
                "field": "date21",
                "caption": "21",
                "width": "auto",
                "fieldFormat":()=>{return ''}
              },
             ]
          },
        ]
    }
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records,
  columns,
  widthMode: 'standard',
  hover:{
    highlightMode: 'cross'
  },
  theme:VTable.themes.ARCO.extends({
    headerStyle:{
      bgColor:'#08aff1',
      color:'#FFF',
      hover:{
        inlineColumnBgColor:'blue'
      }
    },
    bodyStyle:{
       hover:{
        cellBgColor:'',
        inlineColumnBgColor:'',
        inlineRowBgColor(args){
          if(args.col===0)
            return  'blue';
          return ''
        }
      },
      bgColor(args){
        const {table,row,col}=args;
        if(table.getCellOriginValue(col,row)===1)
        return '#ffc200';

        return getColor(2,15,table.getCellOriginValue(3,row))
      }
    }
  })
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
