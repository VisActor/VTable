---
заголовок: 11 данные Editing    

key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
# Introduction


## 1.1 **фон Introduction**



в modern данные visualization и таблица applications, the demand для editing таблица данные is increasing. Vтаблица, as a powerful таблица компонент library, provides comprehensive данные editing возможности к meet this demand. `vтаблица` is an открыть-source таблица project aimed в providing users с flexible и efficient данные manвозрастment и editing capabilities. данные editing is one из the core functions из таблица applications, allowing users к modify, validate, и save данные в таблицаs. к achieve this функциональность, `vтаблица` adopts an объект-oriented design approach, defining a base editor class и various specific editors к meet the editing needs из different types из данные.



## 1.2 **Document Purpose**:




This source код interpretation document aims к deeply analyze the implementation principles из the Vтаблица данные editing функция, helping developers better understand its design concepts, module division, и core processes, so as к use и extend this функция more efficiently в actual projects. We will начало от three aspects: concept introduction, код design, и core processes, к help readers understand the design philosophy и implementation method из the editor.

# Introduction к Concepts


## 2.1 The Role из the Editor Base Class




The editor base class is the core framework из the entire editing функциональность. It defines the interfaces that все specific editors must implement, including general functions such as initialization, validation, и saving. в this way, the base class provides a unified интерфейс для specific editors, ensuring код reusability и extensibility. в the same time, the base class is also responsible для handling некоторые common logic, such as ошибка handling и state manвозрастment.    



## 2.2 Specific Editor Design Concepts




Specific editors are пользовательскийized implementations для specific данные types (such as текст, numbers, dates, etc.). каждый specific editor inherits от a base class и implements specific logic based на the данные тип it handles. для пример, a текст editor may не require complex validation logic, while число и date editors need к strictly format check the ввод данные. Through this design, `vтаблица` can flexibly support the editing needs из various данные types.



# код Design




## 3.1 Overall Approach


The overall design из the данные editing функциональность из Vтаблица follows the principles из modularity и extensibility. по breaking down the editing функциональность into multiple independent modules, каждый responsible для specific functions such as edit manвозрастment, editor implementation, тип definition, etc., the код structure is clear и easy к maintain и extend. в the same time, interfaces и base classes are used к standardize the behavior из editors, ensuring that different types из editors can seamlessly collaborate с the edit manвозрастment module.    \r



## 3.2 код Structure

### 3.2.1 Editor Manвозрастr

<div style="заполнение:5px;фон-цвет: rgb(255, 245, 235);граница-цвет: rgb(255, 245, 235);">packвозрастs/vтаблица/src/edit/edit-manвозрастr.ts    
*  **функция**: Responsible для managing the editing process из таблица cells, including событие binding, starting editing, completing editing, и отменаing editing.    
*  **Dependencies**: The `IEditor` интерфейс defines the behavior specifications из the editor, `таблица_событие_TYPE` defines the таблица событие types, `getCellсобытиеArgsSet` retrieves the событие argument set, `isPromise` determines whether it is a Promise, и `isValid` verifies the validity из the значение.    
packвозрастs/vтаблица/src/edit/editors.ts    
*  **функция**: Defines an editor manвозрастment module. It exports an editor registry `editors` и a функция `get` к retrieve editors. The `get` функция loхорошоs up an editor по имя от the registry, и if не found, it issues a предупреждение и returns `undefined`.    
</div>
editors.ts defines an editor manвозрастment module для managing и retrieving editor instances с different имяs.

```Typescript
import тип { IEditor } от '@visactor/vтаблица-editors';
export const editors: { [key: строка]: IEditor } = {};
export функция get(editorимя: строка): IEditor {
  const editor = editors[editorимя];
  if (!editor) {
    console.warn('editor should регистрация before init таблица!');
    возврат undefined;
  }
  возврат editors[editorимя];
}
    

```
*  `editors` is an exported constant объект used к store все регистрацияed editor instances. Its тип is a map тип с keys as strings (`key: строка`) и values as instances из тип `IEditor`. Initially, this объект is empty.    

*  `get` is an exported функция used к obtain the corresponding editor instance от the `editors` объект based на the editor имя `editorимя`.    

* первый, try к get the editor instance с the specified имя through `editors[editorимя]` и assign it к the variable `editor`.    

*  Then, check if `editor` exists. If it does не exist, it means the editor has не been регистрацияed, a предупреждение messвозраст `'editor should регистрация before init таблица!'` will be output к the console, и `undefined` will be returned.    

* If `editor` exists, directly возврат `editors[editorимя]`, which is the editor instance с the specified имя.    

Therefore, the editor needs к be instantiated с новый before use и регистрацияed в регистрация.ts:

```Typescript
export функция editor(имя: строка, editor?: IEditor): IEditor {
  if (editor !== null && editor !== undefined) {
    возврат регистрация(editors, имя, editor);
  }
  возврат editors[имя];
}    

```
The функция accepts two parameters:    

*  имя: Represents the имя из the editor к регистрация    

*  editor: необязательный параметр, represents the editor instance    

The возврат тип из the функция is IEditor    

функция logic:    

* When the `editor` параметр passed в is не `null` и не `undefined`, the `регистрация` функция is called к регистрация this editor instance с `имя` as the key into the `editors` объект, и returns the старый editor instance originally under that key.    

* If the `editor` параметр is не passed, the функция will attempt к retrieve the editor instance с the `имя` key от the `editors` объект и возврат it. If the key does не exist, it returns `undefined`.    





`EditManвозрастr` is a class used для managing таблица cell editing. It is responsible для handling user-triggered editing событиеs (such as double-Нажать или Нажать), initiating the editor, validating the edited values, и updating the таблица данные after editing is completed.

#### Main Attributes


*  **таблица**: таблица instance, тип is `списоктаблицаапи`.    

*  **editingEditor**: The editor instance currently в use, тип is `IEditor`.    

*  **isValidatingValue**: Indicates whether значение validation is в progress, тип is `логический`.    

*  **editCell**: The позиция из the cell being edited, containing the `col` и `row` attributes.    



#### Method Analysis




##### bindсобытие

Bind событие списокeners на the таблица к handle double-Нажать и Нажать событиеs к начало editing.    

```xml
bindсобытие() {
  // 绑定双击事件
  this.таблица.на(таблица_событие_TYPE.DBLНажать_CELL, e => {
    if (满足编辑条件) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });

  // 绑定点击事件
  this.таблица.на(таблица_событие_TYPE.Нажать_CELL, e => {
    if (满足编辑条件) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });
}    

```
##### startEditCell

начало cell editing.    

```xml
startEditCell(col: число, row: число, значение?: строка | число) {
    // ...
    // 启动编辑器
    editor.onStart?.({
      значение: данныеValue,
      endEdit: () => {
        this.completeEdit();
      },
      referencePosition,
      container: this.таблица.getElement(),
      таблица: this.таблица,
      col,
      row
    });
  }
}    

```
##### completeEdit

Complete the edit operation, verify the edited values, и update the таблица данные.    

```xml
completeEdit(e?: событие): логический | Promise<логический> {
  // ...
  // 获取新旧值并进行验证
  if (this.editingEditor.validateValue) {
    this.isValidatingValue = true;
    const newValue = this.editingEditor.getValue();
    const oldValue = this.таблица.getCellOriginValue(this.editCell.col, this.editCell.row);

    const maybePromiseOrValue = this.editingEditor.validateValue(newValue, oldValue, this.editCell, this.таблица);

    if (isPromise(maybePromiseOrValue)) {
      возврат новый Promise((resolve, reject) => {
        maybePromiseOrValue
          .then(result => dealWithValidateValue(result, this, oldValue, resolve))
          .catch(err => {
            this.isValidatingValue = false;
            console.ошибка('Vтаблица ошибка:', err);
            reject(err);
          });
      });
    }

    возврат dealWithValidateValue(maybePromiseOrValue, this, oldValue);
  }

  this.doExit();
  возврат true;
}    

```
##### doExit

Exit edit mode и update таблица данные.    

```xml
doExit() {
  // ...
  для (let row = range.начало.row; row <= range.конец.row; row++) {
    const rowChangedValues = [];
    для (let col = range.начало.col; col <= range.конец.col; col++) {
      rowChangedValues.push(changedValue);
    }
    changedValues.push(rowChangedValues);
  }

  (this.таблица as списоктаблицаапи).changeCellValues(range.начало.col, range.начало.row, changedValues);
  this.editingEditor.onEnd?.();
  this.editingEditor = null;
  this.isValidatingValue = false;
}    

```
##### отменаEdit

отмена the edit operation.    

```xml
отменаEdit() {
  if (this.editingEditor) {
    this.editingEditor.onEnd?.();
    this.editingEditor = null;
  }
}    

```
##### dealWithValidateValue

Process the validation results и decide whether к exit editing based на the validation results.    

```xml
функция dealWithValidateValue(
  // ...
  switch (validateValue) {
    case 'validate-exit':
    case true:
      editManвозрастr.doExit();
      resolve?.(true);
      возврат true;

    case 'invalidate-exit':
      (editManвозрастr.editingEditor as любой).setValue(oldValue);
      editManвозрастr.doExit();
      resolve?.(true);
      возврат true;

    case 'validate-не-exit':
    case 'invalidate-не-exit':
      resolve?.(false);
      возврат false;

    по умолчанию:
      resolve?.(false);
      возврат false;
  }
}    

```
#### Summary


`EditManвозрастr` class initiates и manвозрастs the cell editing process по списокening к таблица событиеs, ensuring the editor is correctly launched, validating the edited values, и updating the таблица данные upon completion. The class also provides the ability к отмена editing и handles the lifecycle методы из the editor (such as начало и конец).



### 3.2.2 Specific Editors




#### код Structure


<div style="заполнение:5px;фон-цвет: rgb(255, 245, 235);граница-цвет: rgb(255, 245, 235);">packвозрастs/vтаблица-editors: Various editor компонентs    
*  **base-editor.ts**: Base editor class, implements базовый методы из the `IEditor` интерфейс.    
*  **ввод-editor.ts**: Editor для текст ввод, inherits от `BaseEditor`.    
*  **список-editor.ts**: Editor для selecting список items, inherits от `BaseEditor`.    
*  **textArea-editor.ts**: Editor для multi-line текст ввод, inherits от `BaseEditor`.    
*  **date-ввод-editor.ts**: Editor для date ввод, inherits от `InputEditor`.    
*  **types.ts**: Defines related interfaces для пользовательский editor types.    
*  **index.ts**: Exports все editor classes.    

</div>


#### Editor Parsing


##### types.ts

*  **функциональность**: Defines the пользовательский editor `IEditor` и related types.    

*  **Main Interfaces и Types**:    

###### 1. `IEditor` интерфейс

```xml
// eslint-отключить-следующий-line @typescript-eslint/no-explicit-любой
export интерфейс IEditor<V = любой, T = любой> {
  // ...
}    

```
*  `IEditor` is a generic интерфейс, `V` represents the значение тип из the cell, и `T` represents the тип из the таблица instance, both по умолчанию к `любой`.    

*  `onStart` method:    

* Called when the cell enters edit mode.    \r

* Receives an `EditContext` объект as a параметр, which contains contextual information during editing. \r

* If this method is не provided, a предупреждение will be thrown after removing `beginEditing`.    

* `onEnd` method:    

* Called when the cell exits edit mode.    \r

* If this method is не provided, a предупреждение will be thrown after removing `exit`.    

* `isEditorElement` method:    

* Called when the editor is в edit mode и the user Нажатьs somewhere.    \r

*  Receive a `HTMLElement` тип параметр `target`, representing the element Нажатьed по the user.    \r

* If it returns `false`, the Vтаблица will exit edit mode; if it returns `true` или this method is undefined, no action will be taken, и you need к manually call `endEdit` к конец edit mode.    

* `validateValue` method:    

* Before setting новый values into the таблица, used к validate the validity из the values.    \r

* Receives новый значение `newValue`, старый значение `oldValue`, cell позиция `позиция`, и таблица instance `таблица` as parameters.    

* Can возврат a `логический` тип, `ValidateEnum` enum значение, или `Promise<логический | ValidateEnum>` тип.    

* `getValue` method:    

* Called when the editor exits edit mode в любой way. \r

*  Expected к возврат the текущий значение из the cell.    \r

* `beginEditing` method:    

* Called when the cell enters edit mode.    \r

* Deprecated, it is recommended к use `onStart` instead.    

* `exit` method:    

* Deprecated, it is recommended к use `onEnd` instead.    

* `targetIsOnEditor` method:    

* Deprecated, it is recommended к use `isEditorElement` instead.    

*  `bindSuccessCallback` method:    

* Called when the cell enters edit mode, receiving a обратный вызов функция к конец the edit mode.    \r

* Deprecated, the обратный вызов функция is provided as `endEdit` в `EditContext`, it is recommended к use `onStart` instead.    

###### `EditContext` интерфейс

```xml
// eslint-отключить-следующий-line @typescript-eslint/no-explicit-любой
export интерфейс EditContext<V = любой, T = любой> {
  // ...
}    

```
*  `EditContext` is a generic интерфейс used к provide context information during editing.    

*  `container` property: The container element из the Vтаблица instance.    

* `referencePosition` attribute: The позиция information из the cell being edited.    

*  `значение` attribute: The значение из the cell before editing.    

* `endEdit` method: A обратный вызов функция used к конец edit mode.    

*  `таблица` attribute: таблица instance.    

*  `col` attribute: The column index из the cell.    

*  `row` attribute: The index из the row where the cell is located.    



###### `RectProps` интерфейс

```xml
export интерфейс RectProps {
  лево: число;
  верх: число;
  ширина: число;
  высота: число;
}    

```
* The `RectProps` интерфейс defines the свойства из a rectangle, including the coordinates из the верх-лево corner `лево` и `верх`, as well as the `ширина` и `высота`.



###### 4. `Placement` Enumeration

```xml
export enum Placement {
  верх = 'верх',
  низ = 'низ',
  лево = 'лево',
  право = 'право'
}    

```
*  `Placement` enum defines four possible positions: верх, низ, лево, и право.    



###### 5. `ReferencePosition` интерфейс

```xml
export интерфейс ReferencePosition {
  rect: RectProps;
  placement?: Placement;
}    

```
*  `ReferencePosition` интерфейс defines a reference позиция, containing a rectangle из тип `RectProps` и an необязательный `Placement` enum значение.    



###### 6. `ValidateEnum` Enumeration

```xml
export enum ValidateEnum {
  validateExit = 'validate-exit',
  invalidateExit = 'invalidate-exit',
  validateNotExit = 'validate-не-exit',
  invalidateNotExit = 'invalidate-не-exit'
}    

```
*  `ValidateEnum` enum defines four validation results: validation passed и exit edit mode, validation failed и exit edit mode, validation passed but do не exit edit mode, validation failed but do не exit edit mode.    



###### 7. `CellAddress` тип

```xml
export тип CellAddress = {
  col: число;
  row: число;
};    

```
*  `CellAddress` тип defines the address из a cell, containing the column index `col` и the row index `row`.    



##### base-editor.ts

*  **функциональность**: Defines a базовый editor class `BaseEditor`, serving as a base class для other editors (mentioned в the comments that it might не be needed).    



##### ввод-editor.ts

*  **функция**: Implements a regular ввод editor `InputEditor`, inheriting от the `IEditor` интерфейс.    

*  **Main методы**:    

*  `createElement()`: Create и configure ввод elements.    

*  `setValue(значение: строка)`: Set the значение из the ввод box.    

*  `getValue()`: Get the значение из the ввод box.    

* `onStart(context: EditContext<строка>)`: Initialize the editor, including creating elements, setting values, и adjusting positions.    

*  `adjustPosition(rect: RectProps)`: Adjust the позиция из the ввод box according к the given rectangle information.    

* `endEditing()` и `onEnd()`: Clean up editor resources.    

*  `isEditorElement(target: HTMLElement)`: Determine whether the target element is an element из the текущий editor.    

*  `validateValue(newValue?: любой, oldValue?: любой, позиция?: CellAddress, таблица?: любой)`: Validate the новый значение.    



##### список-editor.ts

*  **функциональность**: Implements a выпадающий список список editor `списокEditor`, inheriting от the `IEditor` интерфейс.    \r

*  **Main методы**:    

*  `createElement(значение: строка)`: Create и configure the выпадающий список список element.    

*  `setValue(значение: строка)`: Set the значение из the выпадающий список список.    

*  `getValue()`: Get the значение из the выпадающий список список.    

*  `onStart(context: EditContext)`: Initialize the editor, including creating elements, setting values, и adjusting positions.    

*  `adjustPosition(rect: RectProps)`: Adjust the позиция из the выпадающий список список based на the given rectangle information.    

* `endEditing()` и `onEnd()`: Clean up editor resources.    

*  `isEditorElement(target: HTMLElement)`: Determine whether the target element is an element из the текущий editor.    



##### textArea-editor.ts

*  **функциональность**: Implements a текст area editor `TextAreaEditor`, inheriting от the `IEditor` интерфейс.    

*  **Main методы**:    

*  `createElement()`: Create и configure a текст area element.    

*  `setValue(значение: строка)`: Set the значение из the текст area.    

*  `getValue()`: Get the значение из the текст area.    

*  `onStart(context: EditContext<строка>)`: Initialize the editor, including creating elements, setting values, и adjusting positions.    

*  `adjustPosition(rect: RectProps)`: Adjust the позиция из the текст area based на the given rectangle information.    

* `endEditing()` и `onEnd()`: Clean up editor resources.    

*  `isEditorElement(target: HTMLElement)`: Determine whether the target element is an element из the текущий editor.    



##### date-ввод-editor.ts

*  **функциональность**: Implements the date ввод editor `DateInputEditor`, inheriting от the `InputEditor` class.    

*  **Main методы**:    

*  `createElement()`: Create и configure a date ввод element.    

* Other методы are inherited от `InputEditor`.    



##### index.ts

*  **функциональность**: Export все editor classes и тип definitions.    

*  **Content**: Imported и exported `InputEditor`, `DateInputEditor`, `списокEditor`, и `TextAreaEditor`, as well as все тип definitions imported от `types.ts`.    



#### Relationships between Files


1. **интерфейс и Implementation**:    

* все specific editor classes (such as `TextAreaEditor`, `списокEditor`, `InputEditor`, `DateInputEditor`) implement the `IEditor` интерфейс.    

1. **Inheritance Relationship**:    

* `DateInputEditor` inherits от `InputEditor`, reusing некоторые из its logic.    

* `BaseEditor` is commented out, possibly к simplify the design по directly using the `IEditor` интерфейс.    

1. **Dependencies**:    

*  каждый editor class depends на the interfaces и types defined в `types.ts`.    

* `index.ts` is responsible для exporting все editor classes и тип definitions для use по external modules.    

1. **Common Logic**:    

* Multiple editor classes (such as `TextAreaEditor`, `списокEditor`, `InputEditor`) share similar method structures, such as `createElement()`, `setValue()`, `getValue()`, etc., indicating that they follow the same editor lifecycle manвозрастment.    



# Core Process


## Initialization


When creating an `EditManвозрастr` instance, the constructor `constructor` is called, which takes a `таблица` объект as a параметр и calls the `bindсобытие` method к bind событиеs.

```xml
constructor(таблица: T) {
  this.таблица = таблица;
  this.bindсобытие();
}    

```
## событие Binding


`bindсобытие` method is responsible для binding double-Нажать и single-Нажать событиеs на the таблица, и determines the way к trigger editing based на the `editCellTrigger` configuration.

```xml
bindсобытие() {
  const editCellTrigger = this.таблица.options.editCellTrigger;
  this.таблица.на(таблица_событие_TYPE.DBLНажать_CELL, e => {
    if (
      !editCellTrigger || //默认为双击
      editCellTrigger === 'doubleНажать' ||
      (массив.isArray(editCellTrigger) && editCellTrigger.includes('doubleНажать'))
    ) {
      const { col, row } = e;
      // 取双击自动列宽逻辑
      const событиеArgsSet = getCellсобытиеArgsSet(e.federatedсобытие);
      const resizeCol = this.таблица.scenegraph.getResizeColAt(
        событиеArgsSet.abstractPos.x,
        событиеArgsSet.abstractPos.y,
        событиеArgsSet.событиеArgs?.targetCell
      );
      if (this.таблица._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
        // 判断同双击自动列宽的时间监听的DBLНажать_CELL
        // 如果是双击自动列宽 则编辑不开启
        возврат;
      }
      this.startEditCell(col, row);
    }
  });
  // ...
}    

```
## начало Editing

When the user triggers a double-Нажать или single-Нажать событие, the `startEditCell` method is called к начало editing the cell.    

```xml
startEditCell(col: число, row: число, значение?: строка | число) {
// ...
    editor.onStart?.({
      значение: данныеValue,
      endEdit: () => {
        this.completeEdit();
      },
      referencePosition,
      container: this.таблица.getElement(),
      таблица: this.таблица,
      col,
      row
    });
  }
}    

```
The method checks if it is currently being edited, и if so, it returns immediately. Then it obtains the editor из the cell и checks if the cell is ediтаблица. If it is ediтаблица, it sets the currently edited cell и editor, и calls the `editor.onStart` method к начало editing.

## конец Editing


`completeEdit` method is used к конец the editing process. It checks whether the значение is being validated и whether the событие target is within the editor. If значение validation is needed, it calls the `editor.validateValue` method для validation.    

```xml
completeEdit(e?: событие): логический | Promise<логический> {
// ...
  if (this.editingEditor.validateValue) {
    this.isValidatingValue = true;
    const newValue = this.editingEditor.getValue();
    const oldValue = this.таблица.getCellOriginValue(this.editCell.col, this.editCell.row);

    const maybePromiseOrValue = this.editingEditor.validateValue?.(newValue, oldValue, this.editCell, this.таблица);

    if (isPromise(maybePromiseOrValue)) {
      this.isValidatingValue = true;
      возврат новый Promise((resolve, reject) => {
        maybePromiseOrValue
          .then(result => {
            dealWithValidateValue(result, this, oldValue, resolve);
          })
          .catch((err: ошибка) => {
            this.isValidatingValue = false;
            console.ошибка('Vтаблица ошибка:', err);
            reject(err);
          });
      });
    }
    возврат dealWithValidateValue(maybePromiseOrValue, this, oldValue);
  }
  this.doExit();
  возврат true;
}    

```
## Processing Validation Results


`dealWithValidateValue` функция decides whether к exit the edit state based на the validation result.    

```xml
функция dealWithValidateValue(
// ...
  if (validateValue === 'validate-exit') {
    editManвозрастr.doExit();
    resolve?.(true);
    возврат true;
  } else if (validateValue === 'invalidate-exit') {
    (editManвозрастr.editingEditor as любой).setValue(oldValue);
    editManвозрастr.doExit();
    resolve?.(true);
    возврат true;
  } else if (validateValue === 'validate-не-exit') {
    resolve?.(false);
    возврат false;
  } else if (validateValue === 'invalidate-не-exit') {
    resolve?.(false);
    возврат false;
  } else if (validateValue === true) {
    editManвозрастr.doExit();
    resolve?.(true);
    возврат true;
  }
// ...
}    

```
## Exit Editing


`doExit` method is used к exit the editing state, update the значение из the таблица cell, и call the `editor.onEnd` method.    

```xml
doExit() {
// ...
  для (let row = range.начало.row; row <= range.конец.row; row++) {
    const rowChangedValues = [];
    для (let col = range.начало.col; col <= range.конец.col; col++) {
      rowChangedValues.push(changedValue);
    }
    changedValues.push(rowChangedValues);
  }
  (this.таблица as списоктаблицаапи).changeCellValues(range.начало.col, range.начало.row, changedValues);
  this.editingEditor.onEnd?.();
  this.editingEditor = null;
  this.isValidatingValue = false;
}    

```
## отмена Editing


`отменаEdit` method is used к отмена the edit state, call `editor.onEnd` method и clear the editor.    

## Flowграфик


![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/Jl6HwHXC3h2z6EbQzEUchmAOnWc.gif)



# Practical Application


в the текущий project, the `EditManвозрастr` class в `edit-manвозрастr.ts` provides support для таблица editing функциональность, while `сводныйтаблица.ts` и `списоктаблица.ts` use this class к implement their respective таблица editing возможности. Below is a detailed introduction к the use из `EditManвозрастr` в these two files:

### Usвозраст в `сводныйтаблица.ts`

1. Import `EditManвозрастr`    

в the beginning из the `сводныйтаблица.ts` file, import the `EditManвозрастr` class:    

```xml
import { EditManвозрастr } от './edit/edit-manвозрастr';    

```
1. Create an `EditManвозрастr` instance    

в the `сводныйтаблица` class constructor, create an `EditManвозрастr` instance:    

```xml
this.editManвозрастr = новый EditManвозрастr(this);    

```
Here, the `сводныйтаблица` instance `this` is passed as a параметр к the constructor из `EditManвозрастr`.    

1. Call `EditManвозрастr` method    

в the `сводныйтаблица` class, the `startEditCell` и `completeEditCell` методы are defined к call the corresponding методы из the `EditManвозрастr` instance:    

```xml
startEditCell(col?: число, row?: число, значение?: строка | число) {
  this.editManвозрастr.startEditCell(col, row, значение);
}

completeEditCell() {
  this.editManвозрастr.completeEdit();
}    

```
`startEditCell` method calls the `EditManвозрастr` instance's `startEditCell` method к начало cell editing; `completeEditCell` method calls the `EditManвозрастr` instance's `completeEdit` method к конец cell editing.

`EditManвозрастr` class provides support для cell editing функциональность для `сводныйтаблица` и `списоктаблица`. в the constructors из these two classes, an instance из `EditManвозрастr` is created, и the instance itself is passed as a параметр к the constructor из `EditManвозрастr`. в the subsequent implementation из editing функциональность, методы из the `EditManвозрастr` instance are called к handle cell editing operations.

# Summary


Through the design из base classes и specific editors, the данные editing функциональность из `vтаблица` achieves high reusability и extensibility. This design не only simplifies the код structure but also makes it easier к support новый данные types. в the same time, с the unified definition из interfaces, the interaction between different editors becomes more flexible.



# This document was revised и organized по Следующий personnel 
 [玄魂](https://github.com/xuanhun)