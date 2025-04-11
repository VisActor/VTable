# 编辑单元格键盘行为对齐Excel插件使用说明

`ExcelEditCellKeyboardPlugin`是 VTable 的扩展组件，能够实现编辑单元格键盘行为对齐Excel的功能。

## 插件实现能力说明
关于键盘响应方便VTable原有的能力有以下两个配置入口，

| keyboard   | 响应                                                                                                                                                                                                                                                  |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enter      | 如果在编辑状态，则确认编辑完成；<br> 如果 keyboardOptions.moveFocusCellOnEnter 为 true 时，按下 enter 会切换选中单元格到下面的单元格。<br> 如果 keyboardOptions.editCellOnEnter 为 true 时，如果当前选中了某个可编辑的单元格，按 enter 进入编辑状态。 |
| tab        | 需开启 keyboardOptions.moveFocusCellOnTab。<br> 按 tab 切换选中单元格，如果当前是在编辑单元格 则移动到下一个单元格也是编辑状态。                                                                                                                      |
| left       | 方向键，切换选中单元格。<br> 如果开启 keyboardOptions.moveEditCellOnArrowKeys，那么在编辑状态中也可以切换编辑单元格                                                                                                                                   |
| right      | 同上                                                                                                                                                                                                                                                  |
| top        | 同上                                                                                                                                                                                                                                                  |
| bottom     | 同上                                                                                                                                                                                                                                                  |
| ctrl+c     | 键位不准，这个 copy 是和浏览器的快捷键一致的。<br> 复制选中单元格内容，需要开启 keyboardOptions.copySelected                                                                                                                                          |
| ctrl+v     | 键位不准，粘贴快捷键和浏览器的快捷键一致的。<br> 粘贴内容到单元格，需要开启 keyboardOptions.pasteValueToCell，粘贴生效仅针对配置了编辑 editor 的单元格                                                                                                |
| ctrl+a     | 全选，需要开启 keyboardOptions.selectAllOnCtrlA                                                                                                                                                                                                       |
| shift      | 按住 shift 和鼠标左键，连续区域选中单元格                                                                                                                                                                                                             |
| ctrl       | 按住 ctrl 和鼠标左键，选中多个区域                                                                                                                                                                                                                    |
| 任何一个键 | 可以监听 tableInstance.on('keydown',(args)=>{ })                                                                                                                                                                                                      |

能满足大部分的编辑表格的键盘响应要求，但相比Excel来说，VTable的键盘行为还是有一些差异的，比如:

- 在VTable中，编辑单元格时，按下方向键不会切换到下一个单元格，而是会切换到编辑单元格的光标。
- 在VTable中，编辑单元格时，按下 enter 不会确认编辑完成，而是会切换到下一个单元格。
- 在VTable中，编辑单元格时，按下 tab 不会切换到下一个单元格，而是会切换到编辑单元格的光标。
- 在VTable中，编辑单元格时，按下 shift 和鼠标左键，不会连续区域选中单元格。
- 在VTable中，编辑单元格时，按住 ctrl 和鼠标左键，不会选中多个区域。


结合VTable已有的部分符合需求的能力，我们开发了`ExcelEditCellKeyboardPlugin`插件，能够实现编辑单元格键盘行为对齐Excel的功能。

## 插件使用说明

```ts

  const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin();

  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    theme: VTable.themes.DARK,
    plugins: [excelEditCellKeyboardPlugin]
  };
```

## 插件后续完善

其他和Excel不一致的键盘行为，如:

- 支持配置项，是否响应删除键
- 支持配置项，是否响应 ctrl+c 和 ctrl+v
- 支持配置项，是否响应 shift 和鼠标左键
- 支持配置项，是否响应 ctrl 和鼠标左键

各个响应的行为是否需要使用者明确进行配置，如提供配置项:
```ts
const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin({
    enableDeleteKey: false
});
const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin(excelEditCellKeyboardPlugin);

```

欢迎大家贡献自己的力量，一起来写更多插件！一起建设VTable的生态！