---
category: examples
group: Business
title: 销售热图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/color-level.png
order: 9-1
---

# 销售热图

该示例展示如何根据色阶配置函数改变背景色来实现一张销售热力图。

## 关键配置

- `indicators[x].style.bgColor` 配置某个指标内容的背景色

## 代码演示

```javascript livedemo template=vtable
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
const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  columnResizeType: 'all',
  records: [
    {
      220922103859011: '936196.0161590576',
      220922103859014: '东北',
      220922103859015: "技术",
    },
    {
      220922103859011: '824673.0542612076',
      220922103859014: '东北',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '920698.4041175842',
      220922103859014: '东北',
      220922103859015: "家具",
    },
    {
      220922103859011: '1466575.628829956',
      220922103859014: '中南',
      220922103859015: "技术",
    },
    {
      220922103859011: '1270911.2654294968',
      220922103859014: '中南',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '1399928.2008514404',
      220922103859014: '中南',
      220922103859015: "家具",
    },
    {
      220922103859011: '1599653.7198867798',
      220922103859014: '华东',
      220922103859015: "技术",
    },
    {
      220922103859011: '1408628.5947360992',
      220922103859014: '华东',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '1676224.1276245117',
      220922103859014: '华东',
      220922103859015: "家具",
    },
    {
      220922103859011: '781743.5634155273',
      220922103859014: '华北',
      220922103859015: "技术",
    },
    {
      220922103859011: '745813.5155878067',
      220922103859014: '华北',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '919743.9351348877',
      220922103859014: '华北',
      220922103859015: "家具",
    },
    {
      220922103859011: '230956.3768310547',
      220922103859014: '西北',
      220922103859015: "技术",
    },
    {
      220922103859011: '267870.7928543091',
      220922103859014: '西北',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '316212.42824935913',
      220922103859014: '西北',
      220922103859015: "家具",
    },
    {
      220922103859011: '453898.2000274658',
      220922103859014: '西南',
      220922103859015: "技术",
    },
    {
      220922103859011: '347692.57691955566',
      220922103859014: '西南',
      220922103859015: "办公用品",
    },
    {
      220922103859011: '501533.7320175171',
      220922103859014: '西南',
      220922103859015: "家具",
    },
  ],
  rowTree: [
      {
        dimensionKey: '220922103859014',
        value: "东北",
      },
      {
        dimensionKey: '220922103859014',
        value: "中南",
      },
      {
        dimensionKey: '220922103859014',
        value: "华东",
      },
      {
        dimensionKey: '220922103859014',
        value: "华北",
      },
      {
        dimensionKey: '220922103859014',
        value: "西北",
      },
      {
        dimensionKey: '220922103859014',
        value: "西南",
      },
    ],
    columnTree: [
      {
        dimensionKey: '220922103859015',
        value: '技术',
        children: [
          {
            indicatorKey: "220922103859011",
          },
        ],
      },
      {
        dimensionKey: '220922103859015',
        value: '办公用品',
        children: [
          {
            indicatorKey: "220922103859011",
          },
        ],
      },
      {
        dimensionKey: '220922103859015',
        value: '家具',
        children: [
          {
            indicatorKey: "220922103859011",
          },
        ],
      },
    ],
  rows:[
    {
        dimensionKey: '220922103859014',
        dimensionTitle: '地区',
        width: 'auto',
        showSort: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false,
    },
  ],
  columns:[
    {
        dimensionKey: '220922103859015',
        dimensionTitle: '类别',
        headerStyle: {
          textAlign: "right",
        },
        showSort: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false,
      },
  ],
  indicators: [
          {
            indicatorKey: '220922103859011',
            width: 200,
            showSort: false,
            format(rec){
              return Math.round(rec['220922103859011']);
            },
            style: {
              color: "white",
              bgColor: (args) => {
                return getColor(100000,2000000,args.dataValue)
              },
            },
          },
        ],
  corner: {
      titleOnDimension: 'none',
      headerStyle: {
        textStick: true,
      },
    },
  hideIndicatorName: true,
  theme: {
    defaultStyle:{
      borderLineWidth: 0,
    },
  },
};

const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
