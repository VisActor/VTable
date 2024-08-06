# 快捷键

为方便用户方便操作表格，我们提供以下快捷键，其中有几项是需要再配置中开启的。

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

相关配置：

```
keyboardOptions: {
  /** tab键 默认为true。开启tab键移动选中单元格，如果当前是在编辑单元格 则移动到下一个单元格也是编辑状态 */
  moveFocusCellOnTab?: boolean;
  /** enter键 默认true 如果选中单元格可编辑则进入单元格编辑*/
  editCellOnEnter?: boolean;
  /** 上下左右方向键，默认不开启即false。开启这个配置的话，如果当前是在编辑中的单元格，方向键可以移动到下个单元格并进入编辑状态，而不是编辑文本内字符串的光标移动 */
  moveEditCellOnArrowKeys?: boolean;
  /** 开启快捷键全选 默认：false */
  selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
  /** 快捷键复制  默认false 不开启*/
  copySelected?: boolean; //这个copy是和浏览器的快捷键一致的
  /** 快捷键粘贴。粘贴内容到指定位置（即需要有选中状态），支持批量粘贴。 默认：false */
  pasteValueToCell?: boolean; //粘贴生效仅针对配置了编辑editor的单元格
}
```
