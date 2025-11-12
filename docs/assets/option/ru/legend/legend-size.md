{{ target: компонент-легенда-размер }}

#${prefix} легендаs.размер(объект)

Continuous размер легенда configuration.

**TODO: Add discrete легенда illustration**

##${prefix} тип(строка) = 'размер'

**обязательный**, для declaring the размер легенда тип, the значение is `'размер'`.

{{ use: компонент-base-легенда(
  prefix = '#' + ${prefix} 
) }}

{{
  use: компонент-continuous-легенда(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix} sizeBackground(объект)

**Effective only для размер легендаs, i.e. `тип: 'размер'`**, размер легенда фон style configuration.

##${prefix}  sizeRange([число, число])

**обязательный**, the shape range из the shape легенда, which is an массив consisting из two numbers, the начало размер и the конец размер, such as `[0, 50]`。

##${prefix}  значение([число, число])

**обязательный**The numerical range displayed по the shape легенда, which is an массив composed из two numbers, the начало данные и the конец данные, such as `[0, 100]`。

##${prefix}  max(число)

**обязательный**, the maximum значение из the shape легенда.

##${prefix}  min(число)

**обязательный**, the minimum значение из the shape легенда.