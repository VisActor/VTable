{{ target: компонент-легенда-цвет }}

#${prefix} легендаs.цвет(объект)

Continuous цвет легенда configuration.

**TODO: Add discrete легенда illustration**

##${prefix} тип(строка) = 'цвет'

**обязательный**, used к declare the цвет легенда тип, the значение is `'цвет'`.

{{ use: компонент-base-легенда(
  prefix = '#' + ${prefix} 
) }}

{{
  use: компонент-continuous-легенда(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix}  colors(строка[])

**обязательный**,  The цвет range из the цвет легенда, which is an массив composed из a set из цвет strings, such as `['#2ec7c9','#b6a2de','#5ab1ef]`.

##${prefix}  значение([число, число])

**обязательный**, The numerical range displayed по the цвет легенда, which is an массив composed из two numbers, the начало данные и the конец данные, such as `[0, 100]`.

##${prefix}  max(число)

**обязательный**, the maximum значение из the цвет легенда.

##${prefix}  min(число)

**обязательный**, the minimum значение из the цвет легенда.