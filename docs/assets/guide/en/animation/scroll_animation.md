# Table Scrolling Animation

VTable provides a scrolling animation feature that allows you to scroll to a specified table area. It supports configuring the duration and easing function of the animation.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scroll-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## Scrolling Animation Configuration Options

The `ScrollAnimationOption` is a configuration item for the scrolling animation. You can set it to `true` to enable the default animation, or you can configure the animation parameters:
  - `duration`: The duration of the animation in milliseconds.
  - `easing`: The easing function of the animation. Default is `linear`. Supports `linear`, `quadIn`, `quadOut`, `quadInOut`, `quadInOut`, `cubicIn`, `cubicOut`, `cubicInOut`, `quartIn`, `quartOut`, `quartInOut`, `quintIn`, `quintOut`, `quintInOut`, `backIn`, `backOut`, `backInOut`, `circIn`, `circOut`, `circInOut`, `bounceOut`, `bounceIn`, `bounceInOut`, `elasticIn`, `elasticOut`, `elasticInOut`, `sineIn`, `sineOut`, `sineInOut`, `expoIn`, `expoOut`, `expoInOut`.

For detailed usage, refer to the [demo](../../demo/animation/scroll-animation)

## Scrolling APIs

### scrollToCell

Scrolls to a specified cell.
```
tableInstance.scrollToCell({col, row}, ScrollAnimationOption)
```

### scrollToRow

Scrolls to a specified row.
```
tableInstance.scrollToRow(row, ScrollAnimationOption)
```

### scrollToCol

Scrolls to a specified column.
```
tableInstance.scrollToCol(col, ScrollAnimationOption)
```
