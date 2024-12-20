# Edit cell

When it comes to business scenarios of editing tables, the VTable library provides corresponding editors so that you can easily implement various editing needs.

# Steps for usage

## 1. Reference the editor package of VTable:

### Use the NPM package

First, make sure you have installed the VTable library and related editor packages correctly. You can install them using the following command:

```shell
npm install @visactor/vtable-editors
```

Introduce the required type of editor module into your code:

```javascript
import { DateInputEditor, InputEditor, TextareaEditor, ListEditor } from '@visactor/vtable-editors';
```

### use CDN

你还可以通过 CDN 获取构建好的 VTable-Editor 文件。

```html
<script src="https://unpkg.com/@visactor/vtable-editors@latest/dist/vtable-editors.min.js"></script>
<script>
  const inputEditor = new VTable.editors.InputEditor();
</script>
```

## 2. Create editor:

The VTable-ediotrs library currently provides four editor types, including text input boxes, textarea input boxes, date pickers, drop-down lists, etc. You can choose the appropriate editor according to your needs.

Here is sample code to create an editor:

```javascript
const inputEditor = new InputEditor();
const textAreaEditor = new TextAreaEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['Female', 'Male'] });
```

In the above example, we created a text input box editor (`InputEditor`), a multi-line text area editor (`TextAreaEditor`), a date picker editor (`DateInputEditor`) and a drop-down list editor (`ListEditor`). You can choose the appropriate editor type according to your actual needs.

## 3. Register and use the editor:

Before using the editor, you need to register the editor instance into VTable:

```javascript
//Register editor to VTable
VTable.register.editor('name-editor', inputEditor);
VTable.register.editor('name-editor2', inputEditor2);
VTable.register.editor('textArea-editor', textAreaEditor);
VTable.register.editor('number-editor', numberEditor);
VTable.register.editor('date-editor', dateInputEditor);
VTable.register.editor('list-editor', listEditor);
```

Next, you need to specify the editor to use in the columns configuration(If it is a pivot table, configure the editor in indicators):

```javascript
columns: [
  { title: 'name', field: 'name', editor(args)=>{
    if(args.row%2==0)
      return 'name-editor';
    else
      return 'name-editor2';
  } },
  { title: 'age', field: 'age', editor: 'number-editor' },
  { title: 'gender', field: 'gender', editor: 'list-editor' },
  { title: 'address', field: 'address', editor: 'textArea-editor' },
  { title: 'birthday', field: 'birthDate', editor: 'date-editor' },
]
```

In a table, users can start editing by `double-clicking` a cell and then selecting the editor to use for input.

Note: The editors in the VTable library are all implemented based on the browser's native input box, so problems may occur in some special cases, such as input method input, input method pop-up windows, etc. You can adjust and optimize according to actual needs.

Editor configuration can be defined in columns or global options. It also supports custom function writing:

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

## 4. Customize an editor:

If the several editors provided by the VTable-ediotrs library cannot meet your needs, you can implement a custom editor. To do this, you need to create a class that implements the requirements of the editor interface (`IEditor`) and provides the necessary methods and logic.

You can use the following flow chart to understand the relationship between the editor and VTable:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/editCellProcess1.png)

The following is sample code for a custom editor:

```javascript
class DateEditor implements IEditor {
  editorConfig: any;
  element: HTMLInputElement;
  container: HTMLElement;
  successCallback: Function;
  picker: any;
  constructor(editorConfig: any) {
    this.editorConfig = editorConfig;
  }
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    const that = this;
    this.container = container;
    // const cellValue = luxon.DateTime.fromFormat(value, 'yyyy年MM月dd日').toFormat('yyyy-MM-dd');
    const input = document.createElement('input');

    input.setAttribute('type', 'text');

    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.position = 'absolute';
    input.value = value as string;
    this.element = input;
    container.appendChild(input);
    // Pikaday是一个第三方日历组件
    const picker = new Pikaday({
      field: input,
      format: 'D/M/YYYY',
      toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}年${month}月${day}日`;
      },
      parse(dateString, format) {
        // dateString is the result of `toString` method
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      },
      onSelect: function () {
        const date = this.getDate();
        that.successCallback();
      }
    });
    this.picker = picker;
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.picker.show();
  }

  adjustPosition(rect: RectProps) {
    this.element.style.top = rect.top + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
    this.element.style.height = rect.height + 'px';
  }
  getValue() {
    return this.element.value;
  }
  exit() {
    this.picker.destroy();
    this.container.removeChild(this.element);
  }
  targetIsOnEditor(target: HTMLElement) {
    if (target === this.element || this.picker.el.contains(target)) {
      return true;
    }
    return false;
  }
  bindSuccessCallback(successCallback: Function) {
    this.successCallback = successCallback;
  }
}
const custom_date_editor = new DateEditor({});
VTable.register.editor('custom-date', custom_date_editor);

```

In the above example, we created a custom editor named `DateEditor` and implemented the methods required by the `IEditor` interface. Then, we register the custom editor into the VTable through the `VTable.register.editor` method for use in the table.

`IEditor` [definition](https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts)：

```ts
export interface IEditor<V = any> {
  /** Called when cell enters edit mode. */
  onStart?: (context: EditContext<V>) => void;
  /** called when cell exits edit mode. */
  onEnd?: () => void;
  /**
   * Called when user click somewhere while editor is in edit mode.
   *
   * If returns falsy, VTable will exit edit mode.
   *
   * If returns truthy or not defined, nothing will happen.
   * Which means, in this scenario, you need to call `endEdit` manually
   * to end edit mode.
   */
  isEditorElement?: (target: HTMLElement) => boolean;
  /**
   * Called when editor mode is exited by any means.
   * Expected to return the current value of the cell.
   */
  getValue: () => V;

  /**
   * Verify whether the input new value is valid.
   * true: The verification passes, and the editing state is exited.
   * false: The verification fails, and the editing state is retained.
   * ValidateEnum.validateExit: The verification passes, and the editing state is exited.
   * ValidateEnum.invalidateExit: The verification fails, the editing state is exited, and the old value is retained.
   * ValidateEnum.validateNotExit: The verification passes, and the editing state is not exited.
   * ValidateEnum.invalidateNotExit: The verification fails, and the editing state is not exited.
   */
  validateValue?: (newValue?: any, oldValue?: any, position?: CellAddress, table?: any) => boolean | ValidateEnum;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditContext<V = any> {
  /** Container element of the VTable instance. */
  container: HTMLElement;
  /** Position info of the cell that is being edited. */
  referencePosition: ReferencePosition;
  /** Cell value before editing. */
  value: V;
  /**
   * Callback function that can be used to end edit mode.
   *
   * In most cases you don't need to call this function,
   * since Enter key click is handled by VTable automatically,
   * and mouse click can be handled by `isEditorElement`.
   *
   * However, if your editor has its own complete button,
   * or you have external elements like Tooltip,
   * you may want to use this callback to help you
   * end edit mode.
   */
  endEdit: () => void;
}
```

## 5. Edit event listening:

VTable provides the function of editing event listening. You can listen to the editing data event and execute the corresponding logic in the event callback.

The following is a sample code for editing event listening:

```javascript
const tableInstance = new VTable.ListTable(option);
tableInstance.on('change_cell_value', () => {
  //Edit cell data
});
```

## 6. Obtain data after editing:

When the user completes editing and submits the data, you can obtain the edited data for subsequent processing. You can directly get the records value

```javascript
// Get the full data of the current table
tableInstance.records;
```

## 7. Edit trigger timing

Editing trigger timing support: double-click a cell to enter editing, click a cell to enter editing, and call the API to manually start editing.

```ts
interface ListTableConstructorOptions {
  /** Editing trigger timing Double-click event Click event API manually starts editing. The default is double-click 'doubleclick' */
  editCellTrigger?: 'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];
  // ...
}
```

## 8. Edit value verification

If validation is required, please customize the editor to implement the validation function `validateValue`

If this interface is not defined, the edit value will not be checked by default; Support the following return values:

- true: The verification passes, and the editing state is exited.
- false: The verification fails, and the editing state is retained.
- ValidateEnum.validateExit: The verification passes, and the editing state is exited.
- ValidateEnum.invalidateExit: The verification fails, the editing state is exited, and the old value is retained.
- ValidateEnum.validateNotExit: The verification passes, and the editing state is not exited.
- ValidateEnum.invalidateNotExit: The verification fails, and the editing state is not exited.

If you need to implement asynchronous verification, you can return a Promise object, which is resolved with a true value when the verification succeeds and a false value when the verification fails.

At the same time, when pasting cell data, the validation function `validateValue` will also be called.

## 9. Related APIs

```ts
interface ListTableAPI {
  /** Set the value of the cell. Note that it corresponds to the original value of the source data, and the vtable instance records will be modified accordingly */
  changeCellValue: (col: number, row: number, value: string | number | null, workOnEditableCell = false) => void;
  /**
   * Batch update data of multiple cells
   * @param col The starting column number of pasted data
   * @param row The starting row number of pasted data
   * @param values Data array of multiple cells
   * @param workOnEditableCell just can change editable cells
   */
  changeCellValues(startCol: number, startRow: number, values: string[][], workOnEditableCell = false);
  /** Get the editor of cell configuration */
  getEditor: (col: number, row: number) => IEditor;
  /** Enable cell editing */
  startEditCell: (col?: number, row?: number, value?: string | number) => void;
  /** End editing */
  completeEditCell: () => void;
  // ...
}
```

## ListTable Header Editing Precautions

The basic table supports editing the display title in the header. You can enable this by configuring `headerEditor` globally or within a column. The usage is the same as `editor`.

## PivotTable Editing Precautions

**Editing the header of the pivot table will modify the field name in the records accordingly;**

**In a pivot table, when a cell in the body corresponds to only one source data record, the field value of the record will be modified accordingly after editing. However, when the cell corresponds to an indicator value that aggregates multiple records, it does not support corresponding modifications to the source data.**

The source data corresponding to a specific cell can be obtained through the interface `getCellOriginRecord`

## Summary

Through the above steps, you can create a table with editing functions, select the appropriate editor type according to business needs, customize the editor, listen to editing events, and obtain edited data. In this way, users can easily edit the data in the table, and you can process the edited data accordingly.
