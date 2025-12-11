{{ target: line-пользовательский-element }}

${prefix} тип (строка) ='line'

**必填**

Element тип, here is an line.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} points ({x: число, y: число}[] | ((значение: строка) => {x: число, y: число}[]))

**必填**

The coordinates из the points that make up the line.

${prefix} lineширина (число | ((значение: строка) => число))

strхорошоe ширина.

${prefix} strхорошоe (строка | ((значение: строка) => строка))

strхорошоe цвет.
