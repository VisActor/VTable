---
category: examples
group: table-type pivot-table
title: 样式
cover:
---

# 2018年QS中国大学数学专业排名Mathematics

在这个例子中，通过配置headerStyle和style分别配置了表头和body的样式。透视表列维度Category相同的全部置为相同背景色，指标中的Quantity，Sales和Profit分别设置不同的字体颜色。数据来源：https://www.university-list.net/zhongguo/paiming/dx-100034.html

## 关键配置

-`headerStyle` 配置某个维度的表头样式

-`style` 配置某个维度或者指标body部分的样式

## 代码演示

```ts
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
const records =[
  {
    "世界排名": "20",
    "大学": "Peking University 北京大学",
    "国家/地区": "中国",
    "综合评分": "85.3",
    "学术声誉": "84.1",
    "雇主评价": "90",
    "论文平均引用率": "84.6",
    "H指数": "83.5",
     "排名提升": 1
}, {
    "世界排名": "26",
    "大学": "Tsinghua University 清华大学",
    "国家/地区": "中国",
    "综合评分": "83.8",
    "学术声誉": "80.8",
    "雇主评价": "89.3",
    "论文平均引用率": "79.6",
    "H指数": "88.3",
     "排名提升": 2
}, {
    "世界排名": "51-100",
    "大学": "Zhejiang University 浙江大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "63.7",
    "雇主评价": "75.4",
    "论文平均引用率": "81.2",
    "H指数": "85.4",
     "排名提升": 1
}, {
    "世界排名": "51-100",
    "大学": "Fudan University 复旦大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "73.3",
    "雇主评价": "78.4",
    "论文平均引用率": "84.2",
    "H指数": "78.6",
     "排名提升": -1
}, {
    "世界排名": "51-100",
    "大学": "Shanghai Jiao Tong University 上海交通大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "68",
    "雇主评价": "80.6",
    "论文平均引用率": "84.1",
    "H指数": "87.2",
     "排名提升": 3
}, {
    "世界排名": "101-150",
    "大学": "University of Science and Technology of China 中国科学技术大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "64",
    "雇主评价": "67.9",
    "论文平均引用率": "80.8",
    "H指数": "79.4",
     "排名提升": 2
}, {
    "世界排名": "151-200",
    "大学": "Sun Yat-sen University 中山大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "55.1",
    "雇主评价": "69.2",
    "论文平均引用率": "82.7",
    "H指数": "74.7",
     "排名提升": -1
}, {
    "世界排名": "151-200",
    "大学": "Nanjing University 南京大学",
    "国家/地区": "中国",
    "综合评分": "",
    "学术声誉": "55.4",
    "雇主评价": "73.9",
    "论文平均引用率": "83.4",
    "H指数": "77.1",
    "排名提升": -1
  }
];

const columns =[
    {
        "field": "世界排名",
        "caption": "世界排名",
        "width": "auto"
    },
    {
        "field": "大学",
        "caption": "大学",
        "width": "auto"
    },
    {
        "field": "国家/地区",
        "caption": "国家/地区",
        "width": "auto"
    },
    {
        "field": "综合评分",
        "caption": "综合评分",
        "width": "auto",
        columnType: 'progressbar',
        style:{
          barColor:'orange',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "学术声誉",
        "caption": "学术声誉",
        "width": "auto",
        columnType: 'progressbar',
        style:{
          // barColor:'green',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "论文平均引用率",
        "caption": "论文平均引用率",
        "width": "auto",
        columnType: 'progressbar',
        style:{
          barColor:'#2283C6',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "H指数",
        "caption": "H指数",
        "width": "auto",
        columnType: 'progressbar', 
        style:{
          barColor:'#BCBD22',
          barHeight:'90%',
          barBottom:'5%',
        }
    },
    {
        "field": "排名提升",
        "caption": "排名提升【非真实】",
        "width": "auto",
        columnType: 'progressbar',
        barType:'negative',
        max:4,
        min:-2,
        fieldFormat(){
          return '';
        },
        style:{
          barAxisColor:'black',
          barHeight:'90%',
          barBottom:'5%',

          showBarMark:true,

          barPositiveColor:'rgba(255,0,0,0.5)',
          barNegativeColor:'rgba(0,255,0,0.5)',

          barMarkPositiveColor:'red',
          barMarkNegativeColor:'green',
        }
    },
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records,
  columns,
  widthMode:'standard'
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    
```

## 相关教程

[性能优化](link)
