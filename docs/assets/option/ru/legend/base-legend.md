{{ target: компонент-base-легенда }}

<!-- IлегендаCommonSpec легенда common configuration -->

#${prefix} видимый(логический) = true

Whether к показать the легенда. Displayed по по умолчанию, и the тип defaults к `'discrete'`.

#${prefix} orient(строка)

легенда позиция, необязательный values: `'лево'`, `'верх'`, `'право'`, `'низ'`, respectively represent the four directions из лево, верх, право, и низ.

#${prefix} позиция(строка) = 'середина'

The alignment из the легенда в the текущий row и column, начало|центр|конец.

#${prefix} interactive(логический) = true

Whether к включить the interaction из the легенда, it is включен по по умолчанию.

#${prefix} filter(логический) = true

Whether к perform данные filtering, the по умолчанию is true. After this property is turned off, the Нажать событие из the легенда will не trigger данные filtering.

#${prefix} title(объект)

легенда title configuration, which is не displayed по по умолчанию.

##${prefix} видимый(логический) = false

Whether к display the title или не по по умолчанию.

##${prefix} текст(строка|строка[]|число|число[])

легенда title content, if line break is обязательный, use массив form, such as ['abc', '123'].

##${prefix} align(строка) = 'начало'

The alignment из the title в the текущий display area. The необязательный values are: `'начало'`, `'центр'`, `'конец'`, representing the начало, центр, и конец respectively.

##${prefix} space(число)

The distance between the title и the легенда content.

##${prefix} заполнение(число|число[]|объект)

{{ use: common-заполнение(
  компонентимя='легенда Title'
) }}

##${prefix} textStyle(объект)

легенда текст style configuration.

{{ use: graphic-текст(
prefix = '##' + ${prefix}
) }}

##${prefix} shape(объект)

Graphical configuration для легенда markers, не displayed по по умолчанию.

###${prefix} видимый(логический) = false

Whether к display, the по умолчанию is не displayed.

###${prefix} space(число)

The spacing between shape и текст.

###${prefix} style(объект)

The style configuration из shape, Вы можете configure the shape, размер, цвет, etc. из shape.

{{ use: graphic-symbol(
  prefix = '###' + ${prefix}
) }}

##${prefix} фон(объект)

The фон panel configuration из the title, which is не displayed по по умолчанию.

###${prefix} видимый(логический) = false

Whether к draw the title фон.

###${prefix} style(объект)

Title фон style configuration.

{{
  use: graphic-rect(
    prefix = '###' + ${prefix}
  )
}}

##${prefix} minширина(число) = 30

The minimum ширина configuration из the title, в px.

##${prefix} maxширина(число)

The maximum ширина configuration из the title, в pixels. When the текст exceeds the maximum ширина, it will be omitted автоmatically.

#${prefix} фон(объект)

The легенда organizes the фон configuration.

##${prefix} видимый(логический) = false

Whether к draw the легенда фон, the по умолчанию is не drawn.

##${prefix} заполнение(число|число[]|объект)

{{ use: common-заполнение(
  компонентимя='легенда фон'
) }}

##${prefix} style(объект)

легенда фон style configuration.

{{
  use: graphic-rect(
    prefix = '##' + ${prefix}
  )
}}
