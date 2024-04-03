# 填充柄

在编辑表格场景中，我们提供了填充柄能力，可以通过配置项 `fillHandle: true` 来开启。填充柄可以帮助用户快速地填充单元格的值，提高编辑效率。

开启填充柄能力配置项：

```javascript
{
  excelOptions: {
    fillHandle: true;
  }
}
```

后续 excelOptions 中会扩展更多类似 excel 编辑操作的能力。

# 填充柄使用方式

VTable 仅从 UI 层面实现的填充柄效果，实际填充内容的生成逻辑需要业务方去实现。

当配置了 fillHandle: true 时，会自动在右下角显示填充柄图标。

![fill-handle-icon](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/fill-handle-icon.jpeg)

接下来介绍结合事件来填充内容的流程。

## 1. 监听`mousedown_fill_handle`事件

鼠标点击填充柄图标时触发该事件，可以通过监听该事件来获取当前的选中范围，以便为后续生成单元格内容做准备。

```javascript
tableInstance.on('mousedown_fill_handle', arg => {
  const startSelectCellRange = tableInstance.getSelectedCellRanges()[0];
  beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
  beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
  beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
  beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
  console.log('mousedown_fill_handle', beforeDragMinCol, beforeDragMinRow, beforeDragMaxCol, beforeDragMaxRow);
});
```

## 2. 监听`drag_fill_handle_end`事件

鼠标拖拽填充柄后释放鼠标触发该事件`drag_fill_handle_end`，通过监听该事件得知填充柄的方向和需要填充的具体单元格范围。

如上一步中调用接口 `getSelectedCellRange()`得知当前选中范围，结合填充柄的方向，可以计算出需要填充的单元格范围。

也可以调用接口`getSelectedCellInfos()` 来获取当前选中单元格的值。

## 3. 填充内容到表格

如上两部生成需要填充的内容，用接口`changeCellValues`来更改单元格的值。

接口定义：https://visactor.io/vtable/api/Methods#changeCellValues

# 双击填充柄图标事件

双击填充柄图标时触发`dblclick_fill_handle`事件，可以通过监听该事件来填充后续单元格内容。

# 示例 demo

示例地址：https://visactor.io/vtable/demo/edit/fill-handle
