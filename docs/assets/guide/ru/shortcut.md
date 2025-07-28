# shortcut key

в order к facilitate users к operate the form, we provide Следующий shortcut keys, several из which need к be включен в the configuration.

| keyboard | response                                                                                                                                                                                                                                                                                                                  |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enter    | If в the editing state, confirm that the editing is completed; <br> If keyboardOptions.moveFocusCellOnEnter is true, pressing enter will switch the selected cell к the cell below. <br> If keyboardOptions.editCellOnEnter is true, if an ediтаблица cell is currently selected, press enter к enter the editing state. |
| tab      | KeyboardOptions.moveFocusCellOnTab needs к be turned на. <br> Press tab к switch the selected cell. If you are currently editing a cell, moving к the следующий cell is also в the editing state.                                                                                                                          |
| лево     | Arrow key, switch selected cells. <br> If keyboardOptions.moveEditCellOnArrowKeys is turned на, Вы можете also switch the editing cell в the editing state                                                                                                                                                                 |
| право    | Same as above                                                                                                                                                                                                                                                                                                             |
| верх      | Same as above                                                                                                                                                                                                                                                                                                             |
| низ   | Same as above                                                                                                                                                                                                                                                                                                             |
| ctrl+c   | The key позиция is incorrect. This copy is consistent с the browser's shortcut key. <br> к copy the contents из selected cells, you need к включить keyboardOptions.copySelected                                                                                                                                      |
| ctrl+v   | The key позиция is не correct, the paste shortcut key is the same as the browser shortcut key. <br> к paste content into a cell, you need к включить keyboardOptions.pasteValueToCell. Paste takes effect only для cells с an editor configured                                                                      |
| ctrl+a   | выбрать все, you need к включить keyboardOptions.selectAllOnCtrlA                                                                                                                                                                                                                                                           |
| shift    | Hold shift и the лево mouse Кнопка к выбрать cells в a continuous area                                                                                                                                                                                                                                                 |
| ctrl     | Hold down ctrl и the лево mouse Кнопка к выбрать multiple areas                                                                                                                                                                                                                                                         |
| любой key  | can be monitored таблицаInstance.на('keydown',(args)=>{ })                                                                                                                                                                                                                                                                  |

Related configuration:

```
keyboardOptions: {
  /** The tab key defaults к true. Turn на the tab key к move the selected cell. If you are currently editing a cell, moving к the следующий cell is also в the editing state */
  moveFocusCellOnTab?: логический;
  /** The enter key defaults к true. If the selected cell is ediтаблица, enter cell editing*/
  editCellOnEnter?: логический;
  /** The up, down, лево и право direction keys are не включен по по умолчанию, which is false. If this configuration is turned на, if you are currently editing a cell, the arrow keys can move к the следующий cell и enter the editing state, instead из moving the cursor к edit the строка within the текст */
  moveEditCellOnArrowKeys?: логический;
  /** включить shortcut key selection. по умолчанию: false */
  selectAllOnCtrlA?: логический | SelectAllOnCtrlAOption;
  /** Shortcut key copy, по умолчанию false, не включен*/
  copySelected?: логический; //This copy is consistent с the browser’s shortcut keys
  /** Shortcut key к paste. Paste content к the specified location (that is, it needs к be selected). Batch paste is supported. по умолчанию: false */
  pasteValueToCell?: логический;// Paste takes effect only для cells с an editor configured
}
```
