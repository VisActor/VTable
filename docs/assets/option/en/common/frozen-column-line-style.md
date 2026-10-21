{{ target: common-frozen-column-line-style }}

#${prefix} frozenColumnLine(Object)

Frozen Column Effect

##${prefix} shadow(Object)

Frozen Column Shadow Effect

###${prefix} width(number)
Shadow Overall Width

###${prefix} startColor(string)
Start Color

###${prefix} endColor(string)
End Color

###${prefix} visible(string)

Shadow Visible Time, default is `always`.

- always: always show
- scrolling: show when scrolling
- overflow: show only at frozen boundaries with body content hidden beyond that edge. The left shadow appears after scrolling away from the start; the right shadow appears while content remains to the right. Shadows persist after scrolling stops and disappear at the corresponding edge. No shadow is shown without frozen columns or horizontal body overflow.

###${prefix} skipMergedCells(boolean)

Skip merged cells crossing a frozen-column boundary. Defaults to `false`.

When enabled, the shadow is omitted within each cross-boundary merged cell and resumes below it. Supports multiple gaps, left and right frozen columns, and merged cells in the top, body and bottom frozen regions. Merges contained entirely on one side of the boundary keep the original shadow. Shadow width, colors and visibility are unchanged.

```js
theme: VTable.themes.DEFAULT.extends({
  frozenColumnLine: { shadow: { skipMergedCells: true } }
})
```
