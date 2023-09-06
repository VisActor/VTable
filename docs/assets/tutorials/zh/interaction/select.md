# 选择单元格

## 鼠标点击选择

在使用 VTable 进行数据分析时，可以通过鼠标点击选择单个单元格。选择某个单元格后，可以对该单元进行操作或获取应数据。默认情况下，VTable 允许点击选择单元格。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20d.png)
如上图所示，点击单元格 (2, 3) 后，该单元格被选中。

## 鼠标框选

除了点击单个单元格外，VTable 还支持鼠标框选，可以通过拖动鼠标选择多个单元格。此功能允许用户一次性选择并多个单元格。默认情况下，VTable 开启了鼠标框选功能。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60f.png)

如上图所示，用户通过拖动鼠标选择了多个元格。

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

## 选择复制单元格内容

VTable 提供了复制快捷键功能，用户可以通过设置 `keyboardOptions.copySelected` 为 `true`，来开启快捷键复制功能：

```javascript
const table = new VTable.ListTable({
  keyboardOptions: {
    copySelected: true
  }
});
```

开启快捷键后，用户可以使用浏览器自带的复制快捷键（如：Ctrl+C，Cmd+C）来复制选中的单元格内容。

## 开启全选

在对表格数据进行操作时，用户可能希望通过快捷键全选表格中的所有内容。开启全选功能允许用户通过按住 Ctrl 键并按下 A 键，一次性选择表格中的所有内容。需要注意的是，默认是关闭该功能的，使用以下配置开启全选功能：

    keyboardOptions: {
       selectAllOnCtrlA: false;
    }

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

再有特殊需求不希望用户能够选择表格中的某些列。针对这种需求，VTable 提供了一个在列上的配置项column.disableSelect及disableHeaderSelect，允许我们禁止某一列的选择【透视表无此配置】。

至此，我们已经介绍了 VTable 的选择单元格功能，包括鼠标点击选择、鼠标框选、禁止选择交互、选中样式以及选择复制单元格内容。通过掌握这些功能，您可以更便捷地在 VTable 中进行数据分析与处理。
