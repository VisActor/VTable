# Header Highlight Plugin

VTable provides Header Highlight plugin, which can highlight the corresponding header (row header and column header) after selecting a cell.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## Header Highlight Plugin Configuration

- `HeaderHighlightPlugin`  Header Highlight, can configure the following parameters:
  - `columnHighlight` whether highlight the column
  - `rowHighlight` whether highlight the row
  - `colHighlightBGColor` the background color of the column highlight
  - `rowHighlightBGColor` the background color of the row highlight
  - `colHighlightColor` the color of the column highlight
  - `rowHighlightColor` the color of the row highlight

```js
const highlightPlugin = new HeaderHighlightPlugin(tableInstance, {});
```

For specific usage, please refer to [demo](../../demo/interaction/head-highlight)
