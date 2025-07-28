# таблица Scrolling Animation

Vтаблица provides a scrolling animation feature that allows you к прокрутка к a specified таблица area. It supports configuring the duration и easing функция из the animation.

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/прокрутка-animation.gif" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## Scrolling Animation Configuration Options

The `ScrollAnimationOption` is a configuration item для the scrolling animation. Вы можете set it к `true` к включить the по умолчанию animation, или Вы можете configure the animation parameters:
  - `duration`: The duration из the animation в milliseconds.
  - `easing`: The easing функция из the animation. по умолчанию is `linear`. Supports `linear`, `quadIn`, `quadOut`, `quadInOut`, `quadInOut`, `cubicIn`, `cubicOut`, `cubicInOut`, `quartIn`, `quartOut`, `quartInOut`, `quintIn`, `quintOut`, `quintInOut`, `backIn`, `backOut`, `backInOut`, `circIn`, `circOut`, `circInOut`, `bounceOut`, `bounceIn`, `bounceInOut`, `elasticIn`, `elasticOut`, `elasticInOut`, `sineIn`, `sineOut`, `sineInOut`, `expoIn`, `expoOut`, `expoInOut`.

для detailed usвозраст, refer к the [демонстрация](../../демонстрация/animation/прокрутка-animation)

## Scrolling апиs

### scrollToCell

Scrolls к a specified cell.
```
таблицаInstance.scrollToCell({col, row}, ScrollAnimationOption)
```

### scrollToRow

Scrolls к a specified row.
```
таблицаInstance.scrollToRow(row, ScrollAnimationOption)
```

### scrollToCol

Scrolls к a specified column.
```
таблицаInstance.scrollToCol(col, ScrollAnimationOption)
```
