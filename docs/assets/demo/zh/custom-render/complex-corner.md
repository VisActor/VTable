---
category: examples
group: Custom
title: 自定义角头单元格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/complex-corner.jpeg
option: PivotTable#corner.customLayout
---

# 自定义角头单元格

在透视表中，有时候有多个维度分析数据，需要把左上角的角落区自定义绘制，可以通过定义 `customMergeCell` 和 `customLayout`。如没有合并整个角头需求，可以不配置 `customMergeCell`。

## 关键配置

- `corner.customLayout` 配置该 API 返回需要渲染的内容

## 代码演示

```javascript livedemo template=vtable
// only use for website
const {createGroup, createText, createLine} = VRender;
// use this for project
// import {createGroup, createText, createLine} from '@visactor/vtable/es/vrender';

const option = {
  autoFillHeight: true,
  rows: ['province', 'city'],
  columns: ['category', 'sub_category'],
  indicators: ['sales', 'number'],
  defaultHeaderColWidth: ['auto', 'auto', 120],
  defaultHeaderRowHeight: ['auto', 90],
  indicatorTitle: '指标名称',
  indicatorsAsCol: false,
  customMergeCell: (col, row, table) => {
    if (col >= 0 && col < 3 && row <= 1) {
      return {
        text: 'merge text',
        range: {
          start: {
            col: 0,
            row: 0
          },
          end: {
            col: 2,
            row: 1
          }
        },
        style: {
          bgColor: '#ECF1F5'
        }
      };
    }
  },
  dataConfig: {
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        subTotalsDimensions: ['province'],
        grandTotalLabel: '行总计',
        subTotalLabel: '小计'
      },
      column: {
        showGrandTotals: true,
        showSubTotals: true,
        subTotalsDimensions: ['category'],
        grandTotalLabel: '列总计',
        subTotalLabel: '小计'
      }
    }
  },
  corner: {
    titleOnDimension: 'row',
    customLayout: args => {
      const { table, row, col, rect } = args;
      const { height, width } = rect ?? table.getCellRect(col, row);
      const container = createGroup({
        height,
        width
      });

      // 定义文本内容的数组
      const texts = [
        { text: '省份', fontSize: 18, x: 30, y: rect.height - 25 },
        { text: '城市', fontSize: 18, x: 105, y: rect.height - 25 },
        { text: '数据', fontSize: 18, x: rect.width - 50, y: rect.height - 35 },
        { text: '子类别', fontSize: 18, x: rect.width - 50, y: rect.height - 85 },
        { text: '类别', fontSize: 18, x: rect.width - 50, y: 18 },
        { text: '指标', fontSize: 16, x: 176, y: rect.height - 20 }
      ];

      // 循环添加文本
      texts.forEach(({ text, fontSize, x, y }) => {
        container.addChild(
          createText({
            text,
            fontSize,
            fontFamily: 'sans-serif',
            fill: 'black',
            x,
            y
          })
        );
      });

      // 定义线段的点
      const linePoints = [
        { x: rect.left, y: rect.top },
        { x: 0, y: 0 },
        { x: rect.width - 40, y: rect.height },
        { x: 0, y: 0 },
        { x: 173, y: rect.height },
        { x: 0, y: 0 },
        { x: 84, y: rect.height },
        { x: 0, y: 0 },
        { x: rect.width, y: rect.height - 90 },
        { x: 0, y: 0 },
        { x: rect.width, y: rect.height - 38 },
        { x: 0, y: 0 }
      ];

      // 添加线段
      container.addChild(
        createLine({
          points: linePoints,
          lineWidth: 1,
          stroke: '#ccc'
        })
      );

      return {
        rootContainer: container,
        renderDefault: false,
        enableCellPadding: false
      };
    }
  },
  records: [
    {
      sales: 891,
      number: 77899999,
      province: '浙江省',
      city: '杭州市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 792,
      number: 2367,
      province: '浙江省',
      city: '绍兴市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 893,
      number: 3877,
      province: '浙江省',
      city: '宁波市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 1094,
      number: 4342,
      province: '浙江省',
      city: '舟山市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 1295,
      number: 5343,
      province: '浙江省',
      city: '杭州市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 496,
      number: 632,
      province: '浙江省',
      city: '绍兴市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 1097,
      number: 7234,
      province: '浙江省',
      city: '宁波市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 998,
      number: 834,
      province: '浙江省',
      city: '舟山市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 766,
      number: 945,
      province: '浙江省',
      city: '杭州市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 990,
      number: 1304,
      province: '浙江省',
      city: '绍兴市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 891,
      number: 1145,
      province: '浙江省',
      city: '宁波市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 792,
      number: 1432,
      province: '浙江省',
      city: '舟山市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 745,
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 843,
      number: 1354,
      province: '浙江省',
      city: '绍兴市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 895,
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 965,
      number: 1634,
      province: '浙江省',
      city: '舟山市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 776,
      number: 1723,
      province: '四川省',
      city: '成都市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 634,
      number: 1822,
      province: '四川省',
      city: '绵阳市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 909,
      number: 1943,
      province: '四川省',
      city: '南充市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 399,
      number: 2330,
      province: '四川省',
      city: '乐山市',
      category: '家具',
      sub_category: '桌子'
    },
    {
      sales: 700,
      number: 2451,
      province: '四川省',
      city: '成都市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 689,
      number: 2244,
      province: '四川省',
      city: '绵阳市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 500,
      number: 2333,
      province: '四川省',
      city: '南充市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 800,
      number: 2445,
      province: '四川省',
      city: '乐山市',
      category: '家具',
      sub_category: '沙发'
    },
    {
      sales: 1044,
      number: 2335,
      province: '四川省',
      city: '成都市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 689,
      number: 245,
      province: '四川省',
      city: '绵阳市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 794,
      number: 2457,
      province: '四川省',
      city: '南充市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 566,
      number: 2458,
      province: '四川省',
      city: '乐山市',
      category: '办公用品',
      sub_category: '笔'
    },
    {
      sales: 865,
      number: 4004,
      province: '四川省',
      city: '成都市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 999,
      number: 3077,
      province: '四川省',
      city: '绵阳市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 999,
      number: 3551,
      province: '四川省',
      city: '南充市',
      category: '办公用品',
      sub_category: '纸张'
    },
    {
      sales: 999,
      number: 352,
      province: '四川省',
      city: '乐山市',
      category: '办公用品',
      sub_category: '纸张'
    }
  ],
  widthMode: 'standard', // 宽度模式：standard 标准模式； adaptive 自动填满容器
  bottomFrozenRowCount: 2,
  rightFrozenColCount: 1,
  dragOrder: {
    dragHeaderMode: 'all'
  }
};

const instance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
```
