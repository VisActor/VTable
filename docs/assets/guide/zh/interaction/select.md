# 选择单元格

## 鼠标点击选择

在使用 VTable 进行数据分析时，可以通过鼠标点击选择单个单元格。选择某个单元格后，可以对该单元进行操作或获取应数据。默认情况下，VTable 允许点击选择单元格。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20d.png)

如上图所示，点击单元格 (2, 3) 后，该单元格被选中。

点击表头单元格的行为默认会选中整行或者整列，如果只想选中当前单元格可以设置 `select.headerSelectMode` 为'`cell'`, 或者只想选中 body 主体中的单元格可以设置 `select.headerSelectMode` 为`'body'`。

## 鼠标框选

除了点击单个单元格外，VTable 还支持鼠标框选，可以通过拖动鼠标选择多个单元格。此功能允许用户一次性选择并多个单元格(按住 ctrl 或者 shift 进行多选)。默认情况下，VTable 开启了鼠标框选功能。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60f.png)

如上图所示，用户通过拖动鼠标选择了多个元格。

## 调用接口选择

某项业务场景，如与其他模块联动选择，并不是手动鼠标触发选择，可以借助接口来完成选中。

### 单个单元格选中

用法如下：

```
// 选中4列5行的单元格
tableInstance.selectCell(4,5);
```

### 单元格范围选中

调用接口 selectCells，用法如下：

```
// 表格中的两个范围：从列1行2到列4行2  从列3行5到列7行8
tableInstance.selectCells([{start:{col:1,row:2},end:{col:4,row:2}},{start:{col:3,row:5},end:{col:7,row:8}}]);
```

### 清除当前选中

调用接口`clearSelected`

## 选中样式

当选中一个或多个单元格时，VTable 会应用特定的样式，使用户能够识别出选中的单元格。可以通过 `theme.selectionStyle` 配置选中样式。

例如，要将选中单元格的背景颜色设置为紫色，可以这样配置：

```javascript
const = new VTable.ListTable({
  theme: {
    selectionStyle: {
        cellBorderLineWidth: 2,
        cellBorderColor: '#9900ff',
        cellBgColor: 'rgba(153,0,255,0.2)',
    }
  }
});
```

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270909.png)

如上图所示，选中的单元格背景颜色为紫色。

## 选中高亮整行整列

点击单元格，可能有高亮整行或者整列的需求，可以通过如下配置实现:

```
select: {
 highlightMode: 'cross'  // 可以配置为'cross' 或者 'row' 或者 'column'
}
```

注意：如果选中多个单元格高亮效果会消失。

高亮的样式可在样式中配置。

全局配置：`theme.selectionStyle`中，具体配置方式：

```
theme:{
  selectionStyle:{
    inlineRowBgColor: 'rgb(160,207,245)',
    inlineColumnBgColor: 'rgb(160,207,245)'
  }
}
```

也可以按表头 headerStyle 及 bodyStyle 分别配置，具体配置方式：

```
theme:{
   headerStyle: {
    select: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  },
  bodyStyle: {
    select: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  }
}
```

## 选择复制单元格内容

VTable 提供了复制快捷键功能，用户可以通过设置 `keyboardOptions.copySelected` 为 `true`，来开启快捷键复制功能：

```javascript
const table = new VTable.ListTable({
  keyboardOptions: {
    copySelected: true
  }
});
```

开启快捷键后，用户可以使用浏览器自带的复制快捷键（如：Ctrl+C，Cmd+C）来复制选中的单元格内容。VTable 内部会维护两种复制格式：

```
new ClipboardItem({
  'text/html': new Blob([dataHTML], { type: 'text/html' }),
  'text/plain': new Blob([data], { type: 'text/plain' })
})
```

具体实现逻辑可以参考代码逻辑 https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/event/listener/container-dom.ts

**复制其他相关内容：**

1.  配合复制内容还有个事件叫做`copy_data`，在复制时会触发这个事件，返回已复制到剪切板的内容。

2.  如果想要通过接口获取选中内容作为复制内容，可调用接口`getCopyValue`。

3.  另外我们提供了配置项 `formatCopyValue` 来格式化复制的内容，例如：想要在复制的内容后面加个后缀 `“从 XXXX 复制内容”`

## 开启全选

在对表格数据进行操作时，用户可能希望通过快捷键全选表格中的所有内容。开启全选功能允许用户通过按住 Ctrl 键并按下 A 键，一次性选择表格中的所有内容。需要注意的是，默认是关闭该功能的，使用以下配置开启全选功能：

```
    keyboardOptions: {
        selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
    }
```

如果不想同时选中表头或者行号列 可以按照`SelectAllOnCtrlAOption`进行配置。

## 禁止选择交互

在某些情况下，可能不希望用户选择某个单元格，此时通过 `select` 配置禁止选择交互。

例如，要禁止所有单元格的选择交互，可以将 `select.disableSelect` 设置为 `true`:

```javascript
const table new VTable.ListTable({
  select: {
    disableSelect: true
  }
});
```

若要禁止表头单元格的选择互，可以将 `select.disableHeaderSelect` 设置为 `true`:

```javascript
const table = new VTable.ListTable({
  select: {
    disableHeaderSelect: true
  }
});
```

禁止选择交互后，用户无法通过点击或拖动鼠标来选择单元格。

再有特殊需求不希望用户能够选择表格中的某些列。针对这种需求，VTable 提供了一个在列上的配置项 column.disableSelect 及 disableHeaderSelect，允许我们禁止某一列的选择【透视表无此配置】。

至此，我们已经介绍了 VTable 的选择单元格功能，包括鼠标点击选择、鼠标框选、禁止选择交互、选中样式以及选择复制单元格内容。通过掌握这些功能，您可以更便捷地在 VTable 中进行数据分析与处理。
