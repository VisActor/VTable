{{ target: base-custom-element }}

${prefix} elementKey (string)

元素的唯一标识。

${prefix} x (number | string | ((value: string) => number | string))

**必填**

元素的 x 坐标，可以是数字、字符串或返回数字或字符串的函数。TODO 字符串设置的话 是什么规则？

${prefix} y (number | string | ((value: string) => number | string))

**必填**

元素的 y 坐标，可以是数字、字符串或返回数字或字符串的函数。

${prefix} dx (number)

元素的 x 偏移量。TODO 解释这里

${prefix} dy (number)

元素的 y 偏移量。

${prefix} pickable (boolean)

元素是否可交互，可交互的图元会在被交互时会显示在交互事件回调参数的`target`中。

${prefix} cursor (string)

指针悬停在元素上时的 CSS 样式。