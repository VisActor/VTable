---
title: How to customize highlighted cells in the VTable component</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to customize highlighted cells in the VTable component?</br>
## Problem description

How to customize highlighted cells and specify the highlighting style using the VTable table component?</br>
## Solution

VTable supports custom cell styles, which can be used to implement custom highlighting function.</br>
### Registration style

First, you need to register a custom style</br>
Need to define `id `and `style `two attributes:</br>
*  Id: the unique id of the custom style</br>
*  Style: Custom cell style, the same as the `style `configuration in the `column `, the final presentation effect is the fusion of the original cell style and the custom style</br>
Custom style registration is divided into two ways, `option `configuration and API configuration:</br>
*  The customCellStyle property in the option option receives an array composed of multiple custom style objects.</br>
```
// init option
const option = {
  // ......
  customCellStyle: [
    {
      id: 'custom-1',
      style: {
        bgColor: 'red'
      }
    }
  ]
}</br>
```
*  The API can register custom styles through the `registerCustomCellStyle `methods provided by the VTable instance:</br>
```
instance.registerCustomCellStyle(id, style)</br>
```
### Assignment style

To use a registered custom style, you need to assign the custom style to the cell. Assignment requires defining two properties, `cellPosition `and `customStyleId `:</br>
*  cellPosition: Cell position information, supports configuring individual cells and cell ranges.</br>
*  Single cell: `{row: number, col: number}`</br>
*  Cell range: `{range: {start: {row: number, col: number}, end: {row: number, col: number}}}`</br>
*  customStyleId: Custom style id, the same as the id defined when registering custom styles</br>
There are two ways to allocate, configure in `option `and configure using API:</br>
*  The `customCellStyleArrangement `property in option receives an array of custom assignment style objects:</br>
```
// init option
const option = {
  // ......
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
}</br>
```
*  The API can assign custom styles through the `arrangeCustomCellStyle `methods provided by the VTable instance:</br>
```
instance.arrangeCustomCellStyle(cellPosition, customStyleId)</br>
```
### Update and delete styles

Custom style After registration, you can update the custom style of the same id through `registerCustomCellStyle `method. After the update, the cell style of the assigned custom style will be updated; if `newStyle `is `undefined `| `null `, it means to delete the custom style. After deletion, the cell style of the assigned custom style will restore the default style</br>
```
instance.registerCustomCellStyle(id, newStyle)</br>
```
The assigned custom style cell area can be updated by `arrangeCustomCellStyle `method, and the style of the cell area will be updated after the update; if the `customStyleId `is `undefined `| `null `, it means that the restored cell style is the default style</br>
## Code example

demo：https://visactor.io/vtable/demo/custom-render/custom-style</br>
## Related Documents

Related api: https://visactor.io/vtable/option/ListTable-columns-text#style.fontSize</br>
github：https://github.com/VisActor/VTable</br>



