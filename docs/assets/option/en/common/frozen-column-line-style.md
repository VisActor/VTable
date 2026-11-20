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
