# Render table in an existing canvas

## Configure canvas properties

By default, VTable creates a canvas element and renders the table in it. If you need to render the table in an existing canvas, you need to configure the canvas properties.

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

Where `canvas` is the existing canvas element, and `viewBox` is used to define the rendering area of VTable in the canvas.

## Advanced configuration

If you need to further configure the rendering of the table in the canvas (such as scaling, translation, etc.), you can call the `setViewBoxTransform` API.

```ts
// Scale by 0.5, translate by (100, 100)
instance.setViewBoxTransform(0.5, 0, 0, 0.5, 100, 100);
```

`setViewBoxTransform` accepts a set of matrix parameters to define the rendering transformation of the table in the canvas. The meaning of the matrix parameters is as follows:

- a, b, c, d: scaling and rotation matrix
- e, f: translation matrix
