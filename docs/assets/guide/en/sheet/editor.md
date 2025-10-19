# Custom Editors

VTable-Sheet supports specifying cell editors through VTable's approach, using the `editor` configuration option. However, it's important to note that sheets or columns configured with custom editors will not be able to use formula capabilities.

(The reason is: configured editors will override the built-in default formula editor, preventing formula functionality from working properly)

For other custom editing requirements, please refer to the complete tutorial documentation: [Editing Tutorial](../edit/edit_cell).

# Example
In this example, we instantiate an editor: `dateEditor`, and use it in the `Hire Date` column.

```javascript livedemo template=vtable
let ganttInstance;
// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// For custom editing, you need to import the plugin package @visactor/vtable-editors - ensure it matches the version used by vtable-sheet
// import * as VTable_editors from '@visactor/vtable-editors';
// Normal usage would be const input_editor = new VTable.editors.InputEditor();
// In the official website editor, VTable.editors has been renamed to VTable_editors
const date_input_editor = new VTable_editors.DateInputEditor();
VTableSheet.VTable.register.editor('dateEditor', date_input_editor);

// Container
const container = document.getElementById(CONTAINER_ID);
// Create table instance
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    // Employee data sheet
    {
      sheetKey: 'employees',
      sheetTitle: 'Employee Data',
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Department', width: 120 },
        { title: 'Position', width: 120 },
        { title: 'Hire Date', width: 120, editor: 'dateEditor' },
        { title: 'Salary', width: 100 }
      ],
      data: [
        ['John', 'Engineering', 'Engineer', '2022-01-15', 12000],
        ['Lisa', 'Marketing', 'Manager', '2020-06-20', 18000],
        ['Michael', 'Engineering', 'Senior Engineer', '2021-03-10', 15000],
        ['Sarah', 'HR', 'Specialist', '2022-09-01', 9000]
      ]
    }
  ]
});
window['sheetInstance'] = sheetInstance;
```