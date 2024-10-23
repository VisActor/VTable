# 表格滚动动画

VTable 提供滚动动画功能，滚动到指定表格区域，支持配置动画的时长、缓动函数。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scroll-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## 滚动动画配置项

`ScrollAnimationOption`滚动动画的配置项，可以配置true开启默认动画，也可以配置动画的参数：
  - `duration`   动画时长，单位 ms
  - `easing`  动画缓动函数，默认为 `linear`，支持 `linear`, `quadIn`, `quadOut`, `quadInOut`, `quadInOut`, `cubicIn`, `cubicOut`, `cubicInOut`, `quartIn`, `quartOut`, `quartInOut`, `quintIn`, `quintOut`, `quintInOut`, `backIn`, `backOut`, `backInOut`, `circIn`, `circOut`, `circInOut`, `bounceOut`, `bounceIn`, `bounceInOut`, `elasticIn`, `elasticOut`, `elasticInOut`, `sineIn`, `sineOut`, `sineInOut`, `expoIn`, `expoOut`, `expoInOut`

具体使用参考[demo](../../demo/animation/scroll-animation)

## 滚动API

### scrollToCell

滚动到指定单元格。
```
tableInstance.scrollToCell({col, row}, ScrollAnimationOption)
```

### scrollToRow

滚动到指定行。
```
tableInstance.scrollToRow(row, ScrollAnimationOption)
```

### scrollToCol

滚动到指定列。
```
tableInstance.scrollToCol(col, ScrollAnimationOption)
```
