# Invert Highlight Plugin

VTable provides Invert Highlight plugin, which can highlight the specified area after deselection.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/invert-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## Invert Highlight Plugin Configuration

- `InvertHighlightPlugin`  Invert Highlight Plugin, can configure the following parameters:
  - `fill` invert highlight background color
  - `opacity` invert highlight opacity
- `setInvertHighlightRange` set highlight range

```js
const highlightPlugin = new InvertHighlightPlugin(tableInstance, {});

highlightPlugin.setInvertHighlightRange({
  start: {
    col: 0,
    row: 6
  },
  end: {
    col: 5,
    row: 6
  }
});
```

For specific usage, please refer to [demo](../../demo/interaction/head-highlight)

## Invert Highlight Plugin API

### setInvertHighlightRange

Set highlight range.

```ts
setInvertHighlightRange(range: {
  start: {
    col: number;
    row: number;
  };
  end: {
    col: number;
    row: number;
  };
}): void;
```