# 自定义样式

VTable 支持用户对于表格中某个单元格和某个区域单元格自定义样式，用于达到高亮部分区域的目的。在 VTable 使用自定义样式分为注册样式和分配样式两部。

## 注册样式

注册一个自定义样式，需要定义`id`和`style`两个属性：

* id: 自定义样式的唯一id
* style: 自定义单元格样式，与`column`中的`style`配置相同，最终呈现效果是单元格原有样式与自定义样式融合

自定义样式的注册分为两种方式，`option`中配置和使用API配置：

* option
option中的customCellStyle属性接收多个自定义样式对象组合而成的数组：

```js
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
}
```

* API
可以通过VTable实例提供的`registerCustomCellStyle`方法注册自定义样式：
```js
instance.registerCustomCellStyle(id, style)
```

## 分配样式

使用已注册的自定义样式，需要将自定义样式分配到单元格中，分配需要定义`cellPosition`和`customStyleId`两个属性：

* cellPosition: 单元格位置信息，支持配置单个单元格与单元格区域
  * 单个单元格：`{ row: number, col: number }`
  * 单元格区域：`{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`
* customStyleId: 自定义样式id，与注册自定义样式时定义的id相同

分配方式有两种，`option`中配置和使用API配置：

* option
option中的`customCellStyleArrangement`属性接收多个自定义分配样式对象组合而成的数组：

```js
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
}
```

* API
可以通过VTable实例提供的`arrangeCustomCellStyle`方法分配自定义样式：
```js
instance.arrangeCustomCellStyle(cellPosition, customStyleId)
```

## 更新与删除样式

* 自定义样式在注册后，可以通过`registerCustomCellStyle`方法，对同一id的自定义样式进行更新，更新后，分配的自定义样式的单元格样式会被更新；如果`newStyle`为`undefined` | `null`，则表示删除该自定义样式，删除后，分配的自定义样式的单元格样式会还原默认样式

```js
instance.registerCustomCellStyle(id, newStyle)
```

* 已分配的自定义样式的单元格区域，可以通过`arrangeCustomCellStyle`方法，对单元格区域进行更新样式分配，更新后，单元格的样式会被更新；如果`customStyleId`为`undefined` | `null`，则表示还原单元格的样式为默认样式

具体使用参考[demo](../../demo/custom-render/custom-style)