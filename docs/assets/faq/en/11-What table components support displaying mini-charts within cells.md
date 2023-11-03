# What table components support displaying mini-charts within cells?

## Question Description

I would like to have a separate column in the sales statistics table to display mini-line charts that reflect the displayed growth trends, similar to the daily candlestick list in stock charts.

![](/vtable/faq/11-0.png)

## Solution

VTable can configure the columnType as "sparkline" to display cells as mini-charts. The specific style of the mini-charts can be set using **sparklineSpec**. The advantage is that the integration of charts and tables creates a seamless experience without a sense of detachment, providing optimal performance and user experience.

## Code Example

```javascript

```

## Results

[Online demo](https://codesandbox.io/s/vtable-list-table-jw8yr8?file=/src/index.ts)

![result](/vtable/faq/11-1.png)

## Quote

- [Sparkline Tutorial](https://visactor.io/vtable/guide/cell_type/sparkline)
- [Custom cell layout demo](https://visactor.io/vtable/demo/cell-type/multi-type)
- [Related api](https://visactor.io/vtable/option/ListTable-columns-sparkline#cellType)
- [github](https://github.com/VisActor/VTable)
