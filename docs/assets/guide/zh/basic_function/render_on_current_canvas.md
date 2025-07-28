# 在已有的 canvas 中渲染表格

## 配置 canvas 属性

VTable 默认会创建一个 canvas 元素，并且将表格渲染在该 canvas 中。如果需要在已有的 canvas 中渲染表格，需要配置 canvas 属性。

```ts
const canvas = document.getElementById('currentCanvas');
const option = {
  // ......
  canvas,
  viewBox: {
    x1: 0,
    x2: 800,
    y1: 0,
    y2: 800
  }
};
// const instance = new VTable.PivotChart(option);
const instance = new VTable.ListTable(option);
window.tableInstance = instance;
```

其中 canvas 为已有的 canvas 元素，viewBox 用于定义 VTable 在该 canvas 中的渲染区域。

## 进阶配置

如果需要进一步配置表格在 canvas 中的渲染(如缩放、平移等)，可以调用`setViewBoxTransform` API。

```ts
// 缩放 0.5 倍，平移 (100, 100)
instance.setViewBoxTransform(0.5, 0, 0, 0.5, 100, 100);
```

`setViewBoxTransform` 接受一组矩阵参数，用于定义表格在 canvas 中的渲染变换。矩阵参数的含义如下：

- a, b, c, d: 缩放和旋转矩阵
- e, f: 平移矩阵
