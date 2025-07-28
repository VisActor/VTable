# shortcut key

In order to facilitate users to operate the form, we provide the following shortcut keys, several of which need to be enabled in the configuration.

| keyboard | response                                                                                                                                                                                                                                                                                                                  |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enter    | If in the editing state, confirm that the editing is completed; <br> If keyboardOptions.moveFocusCellOnEnter is true, pressing enter will switch the selected cell to the cell below. <br> If keyboardOptions.editCellOnEnter is true, if an editable cell is currently selected, press enter to enter the editing state. |
| tab      | KeyboardOptions.moveFocusCellOnTab needs to be turned on. <br> Press tab to switch the selected cell. If you are currently editing a cell, moving to the next cell is also in the editing state.                                                                                                                          |
| left     | Arrow key, switch selected cells. <br> If keyboardOptions.moveEditCellOnArrowKeys is turned on, you can also switch the editing cell in the editing state                                                                                                                                                                 |
| right    | Same as above                                                                                                                                                                                                                                                                                                             |
| top      | Same as above                                                                                                                                                                                                                                                                                                             |
| bottom   | Same as above                                                                                                                                                                                                                                                                                                             |
| ctrl+c   | The key position is incorrect. This copy is consistent with the browser's shortcut key. <br> To copy the contents of selected cells, you need to enable keyboardOptions.copySelected                                                                                                                                      |
| ctrl+v   | The key position is not correct, the paste shortcut key is the same as the browser shortcut key. <br> To paste content into a cell, you need to enable keyboardOptions.pasteValueToCell. Paste takes effect only for cells with an editor configured                                                                      |
| ctrl+a   | Select all, you need to enable keyboardOptions.selectAllOnCtrlA                                                                                                                                                                                                                                                           |
| shift    | Hold shift and the left mouse button to select cells in a continuous area                                                                                                                                                                                                                                                 |
| ctrl     | Hold down ctrl and the left mouse button to select multiple areas                                                                                                                                                                                                                                                         |
| Any key  | can be monitored tableInstance.on('keydown',(args)=>{ })                                                                                                                                                                                                                                                                  |

Related configuration:

```
keyboardOptions: {
  /** The tab key defaults to true. Turn on the tab key to move the selected cell. If you are currently editing a cell, moving to the next cell is also in the editing state */
  moveFocusCellOnTab?: boolean;
  /** The enter key defaults to true. If the selected cell is editable, enter cell editing*/
  editCellOnEnter?: boolean;
  /** The up, down, left and right direction keys are not enabled by default, which is false. If this configuration is turned on, if you are currently editing a cell, the arrow keys can move to the next cell and enter the editing state, instead of moving the cursor to edit the string within the text */
  moveEditCellOnArrowKeys?: boolean;
  /** Enable shortcut key selection. Default: false */
  selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
  /** Shortcut key copy, default false, not enabled*/
  copySelected?: boolean; //This copy is consistent with the browser’s shortcut keys
  /** Shortcut key to paste. Paste content to the specified location (that is, it needs to be selected). Batch paste is supported. Default: false */
  pasteValueToCell?: boolean;// Paste takes effect only for cells with an editor configured
}
```
