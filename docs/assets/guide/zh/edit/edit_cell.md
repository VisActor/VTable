# 编辑单元格

当涉及到编辑表格的业务场景时，VTable 库提供了相应的编辑器，使你可以轻松地实现各种编辑需求。

# 使用步骤

## 1. 引用 VTable 的编辑器包：

### 使用 NPM 包

首先，确保已经正确安装了 VTable 库@visactor/vtable 和相关的编辑器包@visactor/vtable-editors。你可以使用以下命令来安装它们：

```shell

# 使用 npm 安装
npm install @visactor/vtable-editors

# 使用 yarn 安装
yarn add @visactor/vtable-editors
```

在代码中引入所需类型的编辑器模块：

```javascript
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
```

### 使用 CDN

你还可以通过 CDN 获取构建好的 VTable-Editor 文件。

```html
<script src="https://unpkg.com/@visactor/vtable-editors@latest/dist/vtable-editors.min.js"></script>
<script>
  const inputEditor = new VTable.editors.InputEditor();
</script>
```

## 2. 创建编辑器：

VTable-ediotrs 库中目前提供了四种编辑器类型，包括文本输入框、多行文本输入框、日期选择器、下拉列表等。你可以根据需要选择合适的编辑器。(下拉列表编辑器效果还在优化中，目前比较丑哈)

以下是创建编辑器的示例代码：

```javascript
const inputEditor = new InputEditor();
const textAreaEditor = new TextAreaEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['女', '男'] });
```

在上面的示例中，我们创建了一个文本输入框编辑器(`InputEditor`)、一个多行文本框编辑器(`TextAreaEditor`)、 一个日期选择器编辑器(`DateInputEditor`)和一个下拉列表编辑器(`ListEditor`)。你可以根据实际需求选择适合的编辑器类型。

## 3. 注册并使用编辑器：

在使用编辑器前，需要将编辑器实例注册到 VTable 中：

```javascript
// 注册编辑器到VTable
VTable.register.editor('name-editor', inputEditor);
VTable.register.editor('name-editor2', inputEditor2);
VTable.register.editor('textArea-editor', textAreaEditor);
VTable.register.editor('number-editor', numberEditor);
VTable.register.editor('date-editor', dateInputEditor);
VTable.register.editor('list-editor', listEditor);
```

接下来需要再 columns 配置中指定使用的编辑器（如果是透视表则在 indicators 配置 editor）：

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

在表格中，用户可以通过`双击`单元格来开始编辑，然后选择使用的编辑器进行输入。

注意：VTable-ediotrs 内置的这三种编辑器都是基于浏览器的原生输入框实现的，因此在某些特殊情况下可能会出现问题，如输入法输入、输入法弹窗等。你可以根据实际需求进行调整和优化。

editor 配置可以在 columns 中，也可以在全局 options 中定义，同时可以支持自定义函数写法：

```ts
interface ColumnDefine {
  // ...
  editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}
```

## 4. 自定义实现一个编辑器：

如果 VTable-ediotrs 库提供的几种编辑器无法满足你的需求，你可以自定义实现一个编辑器。为此，你需要创建一个类，实现编辑器接口(`IEditor`)的要求，并提供必要的方法和逻辑。

可以结合下面这个流程图来理解编辑器和 VTable 之间的关系：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/editCellProcess1.png)

以下是一个自定义编辑器的示例代码：

```ts
class DateEditor implements IEditor {
  editorConfig: any;
  element: HTMLInputElement;
  container: HTMLElement;
  successCallback: Function;
  picker: any;
  constructor(editorConfig: any) {
    this.editorConfig = editorConfig;
  }
  onStart({ container, value, referencePosition, endEdit }: EditContext) {
    const that = this;
    this.container = container;
    this.successCallback = endEdit;
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
  onEnd() {
    this.picker.destroy();
    this.container.removeChild(this.element);
  }
  isEditorElement(target: HTMLElement) {
    if (target === this.element || this.picker.el.contains(target)) {
      return true;
    }
    return false;
  }
}
const custom_date_editor = new DateEditor({});
VTable.register.editor('custom-date', custom_date_editor);
```

在上面的示例中，我们创建了一个名为`DateEditor`的自定义编辑器，并实现了`IEditor`接口所要求的方法。然后，我们通过`VTable.register.editor`方法将自定义编辑器注册到 VTable 中，以便在表格中使用。

`IEditor` 接口[定义](https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts)：

```ts
export interface IEditor<V = any> {
  /** * 单元格进入编辑状态时调用 */
  onStart: (context: EditContext<V>) => void;
  /** * 单元格退出编辑状态时调用 */
  onEnd: () => void;
  /**
   * 如果提供了此函数，VTable 将会在用户点击其他地方时调用此函数。
   * 如果此函数返回了一个假值，VTable 将会调用 `onEnd` 并退出编辑状态。
   * 如果未定义此函数或此函数返回了一个真值， VTable 将不会做任何事。
   * 这意味着，你需要手动调用 `onStart` 中提供的 `endEdit` 来结束编辑模式。
   */
  isEditorElement?: (target: HTMLElement) => boolean;
  /** 获取编辑器当前值。将在 `onEnd` 调用后调用。 */
  getValue: () => V;

  /**
   * 校验输入新值是否合法，
   * true: 校验通过，退出编辑状态。
   * false: 校验失败，保留在编辑状态。
   * ValidateEnum.validateExit: 校验通过，退出编辑状态。
   * ValidateEnum.invalidateExit: 校验不通过，退出编辑状态，保留旧值。
   * ValidateEnum.validateNotExit: 校验通过，不退出编辑状态。
   * ValidateEnum.invalidateNotExit: 校验不通过，不退出编辑状态。
   */
  validateValue?: (newValue?: any, oldValue?: any, position?: CellAddress, table?: any) => boolean | ValidateEnum;
}

export interface EditContext<V = any> {
  /** VTable 实例所处的容器元素 */
  container: HTMLElement;
  /** 正在编辑的单元格位置信息 */
  referencePosition: ReferencePosition;
  /** 正在进入编辑状态的单元格当前值 */
  value: V;
  /**
   * 用于结束编辑状态的回调。
   *
   * 大多数情况下你不需要使用此回调，因为 VTable 已经自带了 Enter 键按下
   * 来结束编辑状态的行为；而鼠标点击其他位置来结束编辑状态的行为你也
   * 可以通过 `isEditorElement` 函数来获得。
   *
   * 然而，如果你有特殊的需求，比如你想在编辑器内部提供一个“完成”按钮，
   * 或者你有像 Tooltip 这样无法获取到的外部元素，
   * 这时你可以保存这个回调并在你需要的时候来手动结束编辑状态。
   */
  endEdit: () => void;
  col: number;
  row: number;
}
```

## 5. 编辑事件监听：

VTable 提供了编辑事件监听的功能，你可以监听编辑数据事件，并在事件回调中执行相应的逻辑。

以下是一个编辑事件监听的示例代码：

```javascript
const tableInstance = new VTable.ListTable(option);
tableInstance.on('change_cell_value', () => {
  // 编辑单元格数据
});
```

## 6. 编辑后数据获取：

当用户完成编辑并提交数据后，你可以获取编辑后的数据以进行后续处理。可以直接取 records 值

```javascript
// 获取当前表格的全量数据
tableInstance.records;
```

## 7. 编辑触发时机

编辑触发时机支持：双击单元格进入编辑，单击单元格进入编辑，调用 api 手动开启编辑.

```ts
interface ListTableConstructorOptions {
  /** 编辑触发时机 双击事件  单击事件 api手动开启编辑。默认为双击'doubleclick' */
  editCellTrigger?: 'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];
  // ...
}
```

## 8. 编辑值校验

需要校验的情况 请自定义编辑器实现校验函数`validateValue`

如未定义该接口则编辑值值默认不做校验，返回值支持：

- true: 校验通过，退出编辑状态。
- false: 校验失败，保留在编辑状态。
- ValidateEnum.validateExit: 校验通过，退出编辑状态。
- ValidateEnum.invalidateExit: 校验不通过，退出编辑状态，保留旧值。
- ValidateEnum.validateNotExit: 校验通过，不退出编辑状态。
- ValidateEnum.invalidateNotExit: 校验不通过，不退出编辑状态。

若需要实现异步校验，可以返回一个 Promise 对象，该 Promise 对象在校验成功时以真值解析，校验失败时以假值解析。

同时粘贴单元格数据时，也会调用校验函数`validateValue`。

## 9. 相关 api

```ts
interface ListTableAPI {
  /** 设置单元格的value值，注意对应的是源数据的原始值，vtable实例records会做对应修改 */
  changeCellValue: (col: number, row: number, value: string | number | null, workOnEditableCell = false) => void;
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   * @param workOnEditableCell 是否仅允许更改可编辑单元格的值，默认为 false
   */
  changeCellValues(startCol: number, startRow: number, values: string[][], workOnEditableCell = false);
  /** 获取单元格配置的编辑器 */
  getEditor: (col: number, row: number) => IEditor;
  /** 开启单元格编辑 */
  startEditCell: (col?: number, row?: number, value?: string | number) => void;
  /** 结束编辑 */
  completeEditCell: () => void;
  // ...
}
```

## 基本表格表头编辑注意事项

基本表格可支持编辑表头显示标题 title，在全局或者在 column 中配置`headerEditor`来开启，具体用法同`editor`。

## 透视表编辑注意事项

**透视表的表头编辑会对应修改 records 中的 field 名称；**

**在透视表中，当 body 中某个单元格对应的源数据 records 只有一条的时候当编辑后 会对应修改 record 的字段值。但是当单元格对应聚合了多条 records 数据的指标值时，是不支持对应修改到源数据的。**

具体单元格对应的源数据可以通过接口`getCellOriginRecord`来获取。

## 总结

通过以上步骤，你可以创建一个具有编辑功能的表格，并根据业务需求选择合适的编辑器类型、自定义编辑器、监听编辑事件以及获取编辑后的数据。这样，用户就可以方便地编辑表格中的数据，并且你可以对编辑后的数据进行相应的处理。
