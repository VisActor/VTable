{{ target: base-пользовательский-element }}

${prefix} elementKey (строка)

The unique identifier из the element.

${prefix} x (число | строка | ((значение: строка) => число | строка))

**обязательный**

The x-coordinate из the element, which can be a число, a строка, или a функция returning a число или a строка. TODO What are the rules when using a строка?

${prefix} y (число | строка | ((значение: строка) => число | строка))

**обязательный**

The y-coordinate из the element, which can be a число, a строка, или a функция returning a число или a строка.

${prefix} dx (число)

The x-offset из the element. TODO Explain further here.

${prefix} dy (число)

The y-offset из the element.

${prefix} pickable (логический)

Whether the element is interactive, the interactive element will be displayed в the `target` из the interaction событие обратный вызов параметр when it is interacted.

${prefix} cursor (строка)

The CSS style when the pointer hovers over the element.