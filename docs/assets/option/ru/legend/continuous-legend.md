{{ target: компонент-continuous-легенда }}

<!-- иконкаtinuousлегендаSpec -->

#${prefix} поле(строка)

необязательный, declare the associated mapping поле.

#${prefix} scale(строка)

необязательный, continuous легенда associated mapping scale id (this scale needs к be generated through the [global scale](todo) configuration, that is, `spec.scales`). If не specified, it will автоmatically match according к the легенда тип.

#${prefix} slidable(логический) = true

включить ползунок interaction.

#${prefix} defaultSelected(массив)

Set the по умолчанию selected легенда items when the легенда is initialized. Elements в the массив correspond к the по умолчанию filtered данные range, such as `[0, 100]` which means filtering данные с values between 0 и 100.

#${prefix} rail(объект)

Configuration для the ползунок rail.

##${prefix} ширина(число)

The ширина из the sliding rail.

##${prefix} высота(число)

The высота из the sliding rail.

##${prefix} style(объект)

Style configuration для the sliding rail.

{{ use: graphic-rect(
  prefix = '##' + ${prefix}
) }}

#${prefix} handler(объект)

Configuration для the sliding handle.

##${prefix} видимый(логический) = true

Whether к display the sliding handle. Displayed по по умолчанию.

##${prefix} style(объект)

Style configuration для the sliding handle.

{{ use: graphic-symbol(
  prefix = '##' + ${prefix}
) }}

#${prefix} track(объект)

Style settings для the selected area из the ползунок.

##${prefix} style(объект)

Style configuration для the selected area из the ползунок.

{{ use: graphic-rect(
  prefix = '##' + ${prefix}
) }}

#${prefix} startText(объект)

Configuration для the легенда rail's лево текст.

##${prefix} видимый(логический) = false

Whether к display the лево текст из the легенда rail.

##${prefix} текст(строка)

The content из the лево текст из the легенда rail.

##${prefix} space(число) = 6

The space between the лево текст из the легенда rail и the ползунок.

##${prefix} style(объект)

Style configuration для the лево текст из the легенда rail.

{{ use: graphic-текст(
  prefix = '##' + ${prefix}
) }}

#${prefix} endText(объект)

Configuration для the легенда rail's право текст.

##${prefix} видимый(логический) = false

Whether к display the право текст из the легенда rail.

##${prefix} текст(строка)

The content из the право текст из the легенда rail.

##${prefix} space(число) = 6

The space between the право текст из the легенда rail и the ползунок.

##${prefix} style(объект)

Style configuration для the право текст из the легенда rail.

{{ use: graphic-текст(
  prefix = '##' + ${prefix}
) }}

#${prefix} handlerText(объект)

Configuration для the текст на the ползунок handle.

##${prefix} видимый(логический) = false

Whether к display the текст на the ползунок handle.

##${prefix} precision(число)

The decimal precision из the данные display, по умолчанию 0, no decimal point.

##${prefix} formatter(функция)

Formatting функция для данные display. The функция is defined as: `(текст: строка) => строка`.

##${prefix} space(число) = 6

The space between the текст на the ползунок handle и the ползунок.

##${prefix} style(объект)

Style configuration для the текст на the ползунок handle.

{{ use: graphic-текст(
  prefix = '##' + ${prefix}
) }}

{{ use: компонент-base-легенда(
  prefix = ${prefix}
) }}