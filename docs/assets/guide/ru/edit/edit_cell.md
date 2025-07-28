# Edit cell

When it comes к business scenarios из editing таблицаs, the Vтаблица library provides corresponding editors so that Вы можете easily implement various editing needs.

# Steps для usвозраст

## 1. Reference the editor packвозраст из Vтаблица:

### Use the NPM packвозраст

первый, make sure you have installed the Vтаблица library и related editor packвозрастs correctly. Вы можете install them using Следующий command:

```shell
npm install @visactor/vтаблица-editors
```

Introduce the обязательный тип из editor module into your код:

```javascript
import { DateInputEditor, InputEditor, TextareaEditor, списокEditor } от '@visactor/vтаблица-editors';
```

### use CDN

你还可以通过 CDN 获取构建好的 Vтаблица-Editor 文件。

```html
<script src="https://unpkg.com/@visactor/vтаблица-editors@latest/dist/vтаблица-editors.min.js"></script>
<script>
  const inputEditor = новый Vтаблица.editors.InputEditor();
</script>
```

## 2. Create editor:

The Vтаблица-ediotrs library currently provides four editor types, including текст ввод boxes, textarea ввод boxes, date pickers, отпускание-down списокs, etc. Вы можете choose the appropriate editor according к your needs.

Here is sample код к create an editor:

```javascript
const inputEditor = новый InputEditor();
const textAreaEditor = новый TextAreaEditor();
const dateInputEditor = новый DateInputEditor();
const списокEditor = новый списокEditor({ values: ['Female', 'Male'] });
```

в the above пример, we created a текст ввод box editor (`InputEditor`), a multi-line текст area editor (`TextAreaEditor`), a date picker editor (`DateInputEditor`) и a отпускание-down список editor (`списокEditor`). Вы можете choose the appropriate editor тип according к your actual needs.

## 3. регистрация и use the editor:

Before using the editor, you need к регистрация the editor instance into Vтаблица:

```javascript
//регистрация editor к Vтаблица
Vтаблица.регистрация.editor('имя-editor', inputEditor);
Vтаблица.регистрация.editor('имя-editor2', inputEditor2);
Vтаблица.регистрация.editor('textArea-editor', textAreaEditor);
Vтаблица.регистрация.editor('число-editor', numberEditor);
Vтаблица.регистрация.editor('date-editor', dateInputEditor);
Vтаблица.регистрация.editor('список-editor', списокEditor);
```

следующий, you need к specify the editor к use в the columns configuration(If it is a сводный таблица, configure the editor в indicators):

```javascript
columns: [
  { заголовок: 'имя', поле: 'имя', editor(args)=>{
    if(args.row%2==0)
      возврат 'имя-editor';
    else
      возврат 'имя-editor2';
  } },
  { заголовок: 'возраст', поле: 'возраст', editor: 'число-editor' },
  { заголовок: 'пол', поле: 'пол', editor: 'список-editor' },
  { заголовок: 'address', поле: 'address', editor: 'textArea-editor' },
  { заголовок: 'birthday', поле: 'birthDate', editor: 'date-editor' },
]
```

в a таблица, users can начало editing по `double-Нажатьing` a cell и then selecting the editor к use для ввод.

Note: The editors в the Vтаблица library are все implemented based на the browser's native ввод box, so problems may occur в некоторые special cases, such as ввод method ввод, ввод method pop-up windows, etc. Вы можете adjust и optimize according к actual needs.

Editor configuration can be defined в columns или global options. It also supports пользовательский функция writing:

```
editor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

## 4. пользовательскийize an editor:

If the several editors provided по the Vтаблица-ediotrs library cannot meet your needs, Вы можете implement a пользовательский editor. к do this, you need к create a class that implements the requirements из the editor интерфейс (`IEditor`) и provides the necessary методы и logic.

Вы можете use Следующий flow график к understand the relationship between the editor и Vтаблица:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/editCellProcess1.png)

Следующий is sample код для a пользовательский editor:

```javascript
class DateEditor implements IEditor {
  editorConfig: любой;
  element: HTMLInputElement;
  container: HTMLElement;
  successCallback: функция;
  picker: любой;
  constructor(editorConfig: любой) {
    this.editorConfig = editorConfig;
  }
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, значение?: строка) {
    const that = this;
    this.container = container;
    // const cellValue = luxon.DateTime.fromFormat(значение, 'yyyy年MM月dd日').toFormat('yyyy-MM-dd');
    const ввод = document.createElement('ввод');

    ввод.setAttribute('тип', 'текст');

    ввод.style.заполнение = '4px';
    ввод.style.ширина = '100%';
    ввод.style.boxSizing = 'граница-box';
    ввод.style.позиция = 'absolute';
    ввод.значение = значение as строка;
    this.element = ввод;
    container.appendChild(ввод);
    // Pikaday是一个第三方日历组件
    const picker = новый Pikaday({
      поле: ввод,
      format: 'D/M/YYYY',
      toString(date, format) {
        // you should do formatting based на the passed format,
        // but we will just возврат 'D/M/YYYY' для simpliГород
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        возврат `${year}年${month}月${day}日`;
      },
      parse(dateString, format) {
        // dateString is the result из `toString` method
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        возврат новый Date(year, month, day);
      },
      onSelect: функция () {
        const date = this.getDate();
        that.successCallback();
      }
    });
    this.picker = picker;
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.picker.показать();
  }

  adjustPosition(rect: RectProps) {
    this.element.style.верх = rect.верх + 'px';
    this.element.style.лево = rect.лево + 'px';
    this.element.style.ширина = rect.ширина + 'px';
    this.element.style.высота = rect.высота + 'px';
  }
  getValue() {
    возврат this.element.значение;
  }
  exit() {
    this.picker.destroy();
    this.container.removeChild(this.element);
  }
  targetIsOnEditor(target: HTMLElement) {
    if (target === this.element || this.picker.el.contains(target)) {
      возврат true;
    }
    возврат false;
  }
  bindSuccessCallback(successCallback: функция) {
    this.successCallback = successCallback;
  }
}
const пользовательский_date_editor = новый DateEditor({});
Vтаблица.регистрация.editor('пользовательский-date', пользовательский_date_editor);

```

в the above пример, we created a пользовательский editor имяd `DateEditor` и implemented the методы обязательный по the `IEditor` интерфейс. Then, we регистрация the пользовательский editor into the Vтаблица through the `Vтаблица.регистрация.editor` method для use в the таблица.

`IEditor` [definition](https://github.com/VisActor/Vтаблица/blob/main/packвозрастs/vтаблица-editors/src/types.ts)：

```ts
export интерфейс IEditor<V = любой> {
  /** Called when cell enters edit mode. */
  onStart?: (context: EditContext<V>) => void;
  /** called when cell exits edit mode. */
  onEnd?: () => void;
  /**
   * Called when user Нажать somewhere while editor is в edit mode.
   *
   * If returns falsy, Vтаблица will exit edit mode.
   *
   * If returns truthy или не defined, nothing will happen.
   * Which means, в this scenario, you need к call `endEdit` manually
   * к конец edit mode.
   */
  isEditorElement?: (target: HTMLElement) => логический;
  /**
   * Called when editor mode is exited по любой means.
   * Expected к возврат the текущий значение из the cell.
   */
  getValue: () => V;

  /**
   * Verify whether the ввод новый значение is valid.
   * true: The verification passes, и the editing state is exited.
   * false: The verification fails, и the editing state is retained.
   * ValidateEnum.validateExit: The verification passes, и the editing state is exited.
   * ValidateEnum.invalidateExit: The verification fails, the editing state is exited, и the старый значение is retained.
   * ValidateEnum.validateNotExit: The verification passes, и the editing state is не exited.
   * ValidateEnum.invalidateNotExit: The verification fails, и the editing state is не exited.
   */
  validateValue?: (newValue?: любой, oldValue?: любой, позиция?: CellAddress, таблица?: любой) => логический | ValidateEnum;
}

// eslint-отключить-следующий-line @typescript-eslint/no-explicit-любой
export интерфейс EditContext<V = любой> {
  /** Container element из the Vтаблица instance. */
  container: HTMLElement;
  /** позиция информация из the cell that is being edited. */
  referencePosition: ReferencePosition;
  /** Cell значение before editing. */
  значение: V;
  /**
   * обратный вызов функция that can be used к конец edit mode.
   *
   * в most cases you don't need к call this функция,
   * since Enter key Нажать is handled по Vтаблица автоmatically,
   * и mouse Нажать can be handled по `isEditorElement`.
   *
   * However, if your editor has its own complete Кнопка,
   * или you have external elements like Подсказка,
   * you may want к use this обратный вызов к help you
   * конец edit mode.
   */
  endEdit: () => void;
}
```

## 5. Edit событие списокening:

Vтаблица provides the функция из editing событие списокening. Вы можете списокen к the editing данные событие и execute the corresponding logic в the событие обратный вызов.

Следующий is a sample код для editing событие списокening:

```javascript
const таблицаInstance = новый Vтаблица.списоктаблица(option);
таблицаInstance.на('change_cell_value', () => {
  //Edit cell данные
});
```

## 6. Obtain данные after editing:

When the user completes editing и submits the данные, Вы можете obtain the edited данные для subsequent processing. Вы можете directly get the records значение

```javascript
// Get the full данные из the текущий таблица
таблицаInstance.records;
```

## 7. Edit trigger timing

Editing trigger timing support: double-Нажать a cell к enter editing, Нажать a cell к enter editing, и call the апи к manually начало editing.

```ts
интерфейс списоктаблицаConstructorOptions {
  /** Editing trigger timing Double-Нажать событие Нажать событие апи manually starts editing. The по умолчанию is double-Нажать 'doubleНажать' */
  editCellTrigger?: 'doubleНажать' | 'Нажать' | 'апи' | 'keydown' | ('doubleНажать' | 'Нажать' | 'апи' | 'keydown')[];
  // ...
}
```

## 8. Edit значение verification

If validation is обязательный, please пользовательскийize the editor к implement the validation функция `validateValue`

If this интерфейс is не defined, the edit значение will не be checked по по умолчанию; Support Следующий возврат values:

- true: The verification passes, и the editing state is exited.
- false: The verification fails, и the editing state is retained.
- ValidateEnum.validateExit: The verification passes, и the editing state is exited.
- ValidateEnum.invalidateExit: The verification fails, the editing state is exited, и the старый значение is retained.
- ValidateEnum.validateNotExit: The verification passes, и the editing state is не exited.
- ValidateEnum.invalidateNotExit: The verification fails, и the editing state is не exited.

If you need к implement asynchronous verification, Вы можете возврат a Promise объект, which is resolved с a true значение when the verification succeeds и a false значение when the verification fails.

в the same time, when pasting cell данные, the validation функция `validateValue` will also be called.

## 9. Related апиs

```ts
интерфейс списоктаблицаапи {
  /** Set the значение из the cell. Note that it corresponds к the original значение из the source данные, и the vтаблица instance records will be modified accordingly */
  changeCellValue: (col: число, row: число, значение: строка | число | null, workOnEdiтаблицаCell = false) => void;
  /**
   * Batch update данные из multiple cells
   * @param col The starting column число из pasted данные
   * @param row The starting row число из pasted данные
   * @param values данные массив из multiple cells
   * @param workOnEdiтаблицаCell just can change ediтаблица cells
   */
  changeCellValues(startCol: число, startRow: число, values: строка[][], workOnEdiтаблицаCell = false);
  /** Get the editor из cell configuration */
  getEditor: (col: число, row: число) => IEditor;
  /** включить cell editing */
  startEditCell: (col?: число, row?: число, значение?: строка | число) => void;
  /** конец editing */
  completeEditCell: () => void;
  // ...
}
```

## списоктаблица Header Editing Precautions

The базовый таблица supports editing the display title в the header. Вы можете включить this по configuring `headerEditor` globally или within a column. The usвозраст is the same as `editor`.

## сводныйтаблица Editing Precautions

**Editing the header из the сводный таблица will modify the поле имя в the records accordingly;**

**в a сводный таблица, when a cell в the body corresponds к only one source данные record, the поле значение из the record will be modified accordingly after editing. However, when the cell corresponds к an indicator значение that aggregates multiple records, it does не support corresponding modifications к the source данные.**

The source данные corresponding к a specific cell can be obtained through the интерфейс `getCellOriginRecord`

## Summary

Through the above steps, Вы можете create a таблица с editing functions, выбрать the appropriate editor тип according к business needs, пользовательскийize the editor, списокen к editing событиеs, и obtain edited данные. в this way, users can easily edit the данные в the таблица, и Вы можете process the edited данные accordingly.
