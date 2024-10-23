# Custom style

VTable supports users to customize styles for a certain cell and a certain range of cells in the table to highlight some areas. Using custom styles in VTable is divided into two parts: registered styles and assigned styles.

## Registration style

To register a custom style, you need to define two attributes: `id` and `style`:

* id: the unique id of the custom style
* style: Custom cell style, which is the same as the `style` configuration in `column`. The final rendering effect is the fusion of the original style of the cell and the custom style.

There are two ways to register custom styles, configuring in `option` and configuring using API:

*option
The customCellStyle property in option receives an array composed of multiple custom style objects:

```js
// init option
const option = {
   //......
   customCellStyle: [
     {
       id: 'custom-1',
       style: {
         bgColor: 'red'
       }
     }
   ]
}
```

* API
Custom styles can be registered through the `registerCustomCellStyle` method provided by the VTable instance:
```js
instance.registerCustomCellStyle(id, style)
```

## Assign style

To use a registered custom style, you need to assign the custom style to the cell. The assignment needs to define two attributes: `cellPosition` and `customStyleId`:

* cellPosition: cell position information, supports configuration of single cells and cell areas
   * Single cell: `{ row: number, col: number }`
   * Cell range: `{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`
* customStyleId: Custom style id, the same as the id defined when registering the custom style

There are two allocation methods, configuration in `option` and configuration using API:

*option
The `customCellStyleArrangement` property in option receives an array composed of multiple custom assigned style objects:

```js
// init option
const option = {
   //......
   customCellStyleArrangement: [
     {
       cellPosition: {
         col: 3,
         row: 4
       },
       customStyleId: 'custom-1'
     },
     {
       cellPosition: {
         range: {
           start: {
             col: 5,
             row: 5
           },
           end: {
             col: 7,
             row: 7
           }
         }
       },
       customStyleId: 'custom-2'
     }
   ]
}
```

* API
Custom styles can be assigned via the `arrangeCustomCellStyle` method provided by the VTable instance:
```js
instance.arrangeCustomCellStyle(cellPosition, customStyleId)
```

## Update and delete styles

* After the custom style is registered, you can update the custom style with the same ID through the `registerCustomCellStyle` method. After the update, the cell style of the assigned custom style will be updated; if `newStyle` is `undefined` | `null` means deleting the custom style. After deletion, the cell style of the assigned custom style will restore the default style.

```js
instance.registerCustomCellStyle(id, newStyle)
```

* For the assigned custom style cell area, you can update the style assignment to the cell area through the `arrangeCustomCellStyle` method. After the update, the cell style will be updated; if `customStyleId` is `undefined` | `null `, it means restoring the cell style to the default style

For specific usage, please refer to [demo](../../demo/custom-render/custom-style)