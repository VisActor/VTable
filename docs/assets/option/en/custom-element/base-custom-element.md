{{ target: base-custom-element }}

${prefix} elementKey (string)

The unique identifier of the element.

${prefix} x (number | string | ((value: string) => number | string))

**Required**

The x-coordinate of the element, which can be a number, a string, or a function returning a number or a string. TODO What are the rules when using a string?

${prefix} y (number | string | ((value: string) => number | string))

**Required**

The y-coordinate of the element, which can be a number, a string, or a function returning a number or a string.

${prefix} dx (number)

The x-offset of the element. TODO Explain further here.

${prefix} dy (number)

The y-offset of the element.

${prefix} pickable (boolean)

Whether the element is interactive, the interactive element will be displayed in the `target` of the interaction event callback parameter when it is interacted.

${prefix} cursor (string)

The CSS style when the pointer hovers over the element.