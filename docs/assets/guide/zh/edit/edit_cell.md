# 编辑单元格
当涉及到编辑表格的业务场景时，VTable库提供了相应的编辑器，使你可以轻松地实现各种编辑需求。


# 使用步骤

## 1. 引用VTable的编辑器包：
首先，确保已经正确安装了VTable库@visactor/vtable和相关的编辑器包@visactor/vtable-editors。你可以使用以下命令来安装它们：

```shell

# 使用 npm 安装
npm install @visactor/vtable-editors

# 使用 yarn 安装
yarn add @visactor/vtable-editors
```

在代码中引入所需类型的编辑器模块：

```javascript
import { DateInputEditor, InputEditor, ListEditor } from '@visactor/vtable-editors';
```

## 2. 创建编辑器：
VTable-ediotrs库中目前提供了三种编辑器类型，包括文本输入框、日期选择器、下拉列表等。你可以根据需要选择合适的编辑器。(下拉列表编辑器效果还在优化中，目前比较丑哈)

以下是创建编辑器的示例代码：

```javascript
const inputEditor = new InputEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['女', '男'] });
```

在上面的示例中，我们创建了一个文本输入框编辑器(`InputEditor`)、一个日期选择器编辑器(`DateInputEditor`)和一个下拉列表编辑器(`ListEditor`)。你可以根据实际需求选择适合的编辑器类型。
## 3. 注册并使用编辑器：
在使用编辑器前，需要将编辑器实例注册到VTable中：
```javascript
// 注册编辑器到VTable
VTable.register.editor('name-editor', inputEditor);
VTable.register.editor('name-editor2', inputEditor2);
VTable.register.editor('number-editor', numberEditor);
VTable.register.editor('date-editor', dateInputEditor);
VTable.register.editor('list-editor', listEditor);
```
接下来需要再columns配置中指定使用的编辑器：

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
  { title: 'birthday', field: 'birthDate', editor: 'date-editor' },
]
```
在表格中，用户可以通过`双击`单元格来开始编辑，然后选择使用的编辑器进行输入。

注意：VTable库中的编辑器都是基于浏览器的原生输入框实现的，因此在某些特殊情况下可能会出现问题，如输入法输入、输入法弹窗等。你可以根据实际需求进行调整和优化。

editor配置可以在columns中，也可以在全局options中定义，同时可以支持自定义函数写法：

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```
## 4. 自定义实现一个编辑器：
如果VTable-ediotrs库提供的几种编辑器无法满足你的需求，你可以自定义实现一个编辑器。为此，你需要创建一个类，实现编辑器接口(`IEditor`)的要求，并提供必要的方法和逻辑。

可以结合下面这个流程图来理解编辑器和VTable之间的关系：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/editCellProcess.png)

以下是一个自定义编辑器的示例代码：

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

在上面的示例中，我们创建了一个名为`DateEditor`的自定义编辑器，并实现了`IEditor`接口所要求的方法。然后，我们通过`VTable.register.editor`方法将自定义编辑器注册到VTable中，以便在表格中使用。

`IEditor`接口具体定义的源码(github：https://github.com/VisActor/VTable/blob/feat/editCell/packages/vtable-editors/src/types.ts)：
```
export interface IEditor {
  /** 编辑器类型 */
  editorType?: string;
  /** 编辑配置 */
  editorConfig: any;
  /* 编辑器挂载的容器 由vtable传入 */
  container: HTMLElement;
  /** 编辑完成后调用。注意如果是（enter键，鼠标点击其他位置）这类编辑完成已有VTable实现，编辑器内部有完成按钮等类似的完成操作需要调用这个方法 */
  successCallback?: Function;
  /** 获取编辑器当前值 */
  getValue: () => string | number | null;
  /** 编辑器进入编辑状态 */
  beginEditing: (
    container: HTMLElement,
    referencePosition: { rect: RectProps; placement?: Placement },
    value?: string
  ) => void;
  /** 编辑器退出编辑状态 */
  exit: () => void;
  /** 判断鼠标点击的target是否属于编辑器内部元素 */
  targetIsOnEditor: (target: HTMLElement) => boolean;
  /** 由VTable调用来传入编辑成功的回调  请将callback赋值到successCallback */
  bindSuccessCallback?: (callback: Function) => void;
}
```

## 5. 编辑事件监听：
VTable提供了编辑事件监听的功能，你可以监听编辑数据事件，并在事件回调中执行相应的逻辑。

以下是一个编辑事件监听的示例代码：

```javascript
const tableInstance = new VTable.ListTable(option);
tableInstance.on('change_cell_value', () => {
  // 编辑单元格数据
});
```

## 6. 编辑后数据获取：
当用户完成编辑并提交数据后，你可以获取编辑后的数据以进行后续处理。可以直接取records值

```javascript
// 获取当前表格的全量数据
tableInstance.records;
```

## 7. 编辑触发时机
编辑触发时机支持：双击单元格进入编辑，单击单元格进入编辑，调用api手动开启编辑.
```
  /** 编辑触发时机 双击事件  单击事件 api手动开启编辑。默认为双击'doubleclick' */
  editCellTrigger?: 'doubleclick' | 'click' | 'api';
```

## 8. 相关api

```
  /** 设置单元格的value值，注意对应的是源数据的原始值，vtable实例records会做对应修改 */
  changeCellValue: (col: number, row: number, value: string | number | null) => void;

  /** 获取单元格配置的编辑器 */
  getEditor: (col: number, row: number) => IEditor;

  /** 开启单元格编辑 */
  startEditCell: (col?: number, row?: number) => void;

  /** 结束编辑 */
  completeEditCell: () => void;
```

通过以上步骤，你可以创建一个具有编辑功能的表格，并根据业务需求选择合适的编辑器类型、自定义编辑器、监听编辑事件以及获取编辑后的数据。这样，用户就可以方便地编辑表格中的数据，并且你可以对编辑后的数据进行相应的处理。