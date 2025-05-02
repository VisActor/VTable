---
theme: github
highlight: github
---
# 1. Introduction
## 1.1 **Background Introduction**
In modern data visualization and table applications, user demand for editing table data is increasing. VTable, as a powerful table component library, provides comprehensive data editing features to meet this need. `vtable` is an open-source table project aimed at providing users with flexible and efficient data management and editing capabilities. Data editing is one of the core functionalities of table applications, allowing users to modify, validate, and save data within the table. To achieve this functionality, `vtable` adopts an object-oriented design approach by defining a base editor class and various specific editors to accommodate different types of data editing needs.
## 1.2 **Purpose of the Document**:
This source code interpretation document aims to deeply analyze the implementation principles of VTable's data editing feature, helping developers better understand its design concepts, module divisions, and core processes, so as to use and extend this feature more efficiently in actual projects. We will cover three aspects: conceptual introduction, code design, and core processes, helping readers understand the design philosophy and implementation methods of the editor.
# 2. Conceptual Introduction
## 2.1 The Role of the Base Editor Class
The base editor class is the framework core of the entire editing function. It defines all the interfaces that specific editors must implement, including initialization, validation, and saving general functions. In this way, the base class provides a unified interface for specific editors, ensuring code reusability and extensibility. At the same time, the base class also handles some common logic, such as error handling and state management.
## 2.2 Design Concepts of Specific Editors
Specific editors are customized implementations for particular data types (such as text, numbers, dates, etc.). Each specific editor inherits from the base class and implements specific logic based on the type of data it handles. For example, a text editor may not require complex validation logic, while number editors and date editors need to strictly format-check the input data. Through this design, `vtable` can flexibly support various data type editing needs.
# 3. Code Design
## 3.1 Overall Approach
The overall design of VTable's data editing function follows the principles of modularity and extensibility. By breaking down the editing function into multiple independent modules, each responsible for specific functions such as edit management, editor implementation, type definitions, etc., the code structure is clear, easy to maintain, and extend. Meanwhile, interfaces and base classes are used to standardize the behavior of editors, ensuring that different types of editors can seamlessly collaborate with the edit management module.
## 3.2 Code Structure
### 3.2.1 Edit Manager
packages/vtable/src/edit/edit-manager.ts
-   **Function**: Responsible for managing the editing process of table cells, including event binding, starting editing, completing editing, and canceling editing.
-   **Dependencies**: `IEditor` interface defines the behavior specifications of the editor, `TABLE_EVENT_TYPE` defines table event types, `getCellEventArgsSet` gets event parameter sets, `isPromise` checks if it is a Promise, `isValid` validates value validity.
packages/vtable/src/edit/editors.ts
-   **Function**: Defines an editor management module. It exports an editor registry `editors` and a function `get` to obtain editors. The `get` function retrieves the editor by name from the registry, issuing a warning and returning `undefined` if not found.
editors.ts defines an editor management module for managing and obtaining editor instances by different names.
```typescript
import type { IEditor } from '@visactor/vtable-editors';
export const editors: { [key: string]: IEditor } = {};
export function get(editorName: string): IEditor {
  const editor = editors[editorName];
  if (!editor) {
    console.warn('editor should register before init table!');
    return undefined;
  }
  return editors[editorName];
}
```
-   `editors` is an exported constant object used to store all registered editor instances. Its type is a mapping type, with keys as strings (`key: string`) and values as instances of the `IEditor` type. Initially, this object is empty.
-   `get` is an exported function used to retrieve the corresponding editor instance from the `editors` object based on the editor name `editorName`.
    -   First, try to get the specified editor instance via `editors[editorName]` and assign it to the variable `editor`.
    -   Then, check if `editor` exists. If it doesn't, it means the editor hasn't been registered, outputting a warning message `'editor should register before init table!'` in the console and returning `undefined`.
    -   If `editor` exists, directly return `editors[editorName]`, i.e., the editor instance with the specified name.
    Therefore, editors need to be instantiated and registered first. In `register.ts`:
```typescript
export function editor(name: string, editor?: IEditor): IEditor {
  if (editor !== null && editor !== undefined) {
    return register(editors, name, editor);
  }
  return editors[name];
}
```
This function accepts two parameters:
-   name: Represents the name of the editor to be registered.
-   editor: Optional parameter representing the editor instance.
Function return type is `IEditor`.
Function logic:
-   When the passed `editor` parameter is neither `null` nor `undefined`, call the `register` function to register this editor instance with `name` as the key into the `editors` object, and return the old editor instance originally under this key.
-   If no `editor` parameter is passed, the function attempts to retrieve the editor instance with `name` as the key from the `editors` object and returns it. If the key does not exist, it returns `undefined`.
`EditManager` is a class used to manage table cell editing. It handles user-triggered editing events (like double-click or click), starts the editor, validates edited values, and updates table data after editing is complete.
#### Main Attributes
-   **table**: Table instance, type `ListTableAPI`.
-   **editingEditor**: Current editor instance being used, type `IEditor`.
-   **isValidatingValue**: Marks whether value validation is in progress, type `boolean`.
-   **editCell**: Position of the cell being edited, containing `col` and `row` properties.
#### Method Analysis
##### bindEvent
Bind event listeners on the table to handle double-click and click events to start editing.
```typescript
bindEvent() {
  // Bind double-click event
  this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
    if (meets editing conditions) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });
  // Bind click event
  this.table.on(TABLE_EVENT_TYPE.CLICK_CELL, e => {
    if (meets editing conditions) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });
}
```
##### startEditCell
Start cell editing.
```typescript
startEditCell(col: number, row: number, value?: string | number) {
    // ...
    // Start the editor
    editor.onStart?.({
      value: dataValue,
      endEdit: () => {
        this.completeEdit();
      },
      referencePosition,
      container: this.table.getElement(),
      table: this.table,
      col,
      row
    });
  }
}
```
##### completeEdit
Complete editing operation, validate edited value, and update table data.
```typescript
completeEdit(e?: Event): boolean | Promise<boolean> {
  // ...
  // Get new and old values and perform validation
  if (this.editingEditor.validateValue) {
    this.isValidatingValue = true;
    const newValue = this.editingEditor.getValue();
    const oldValue = this.table.getCellOriginValue(this.editCell.col, this.editCell.row);
    const maybePromiseOrValue = this.editingEditor.validateValue(newValue, oldValue, this.editCell, this.table);
    if (isPromise(maybePromiseOrValue)) {
      return new Promise((resolve, reject) => {
        maybePromiseOrValue
          .then(result => dealWithValidateValue(result, this, oldValue, resolve))
          .catch(err => {
            this.isValidatingValue = false;
            console.error('VTable Error:', err);
            reject(err);
          });
      });
    }
    return dealWithValidateValue(maybePromiseOrValue, this, oldValue);
  }
  this.doExit();
  return true;
}
```
##### doExit
Exit editing state and update table data.
```typescript
doExit() {
  // ...
  for (let row = range.start.row; row <= range.end.row; row++) {
    const rowChangedValues = [];
    for (let col = range.start.col; col <= range.end.col; col++) {
      rowChangedValues.push(changedValue);
    }
    changedValues.push(rowChangedValues);
  }
  (this.table as ListTableAPI).changeCellValues(range.start.col, range.start.row, changedValues);
  this.editingEditor.onEnd?.();
  this.editingEditor = null;
  this.isValidatingValue = false;
}
```
##### cancelEdit
Cancel editing operation.
```typescript
cancelEdit() {
  if (this.editingEditor) {
    this.editingEditor.onEnd?.();
    this.editingEditor = null;
  }
}
```
##### dealWithValidateValue
Handle validation results and decide whether to exit editing based on the result.
```typescript
function dealWithValidateValue(
  // ...
  switch (validateValue) {
    case 'validate-exit':
    case true:
      editManager.doExit();
      resolve?.(true);
      return true;
    case 'invalidate-exit':
      (editManager.editingEditor as any).setValue(oldValue);
      editManager.doExit();
      resolve?.(true);
      return true;
    case 'validate-not-exit':
    case 'invalidate-not-exit':
      resolve?.(false);
      return false;
    default:
      resolve?.(false);
      return false;
  }
}
```
#### Summary
The `EditManager` class manages the cell editing process through listening to table events, ensuring correct startup of the editor, validating edited values, and updating table data after editing is completed. This class also provides a cancel editing function and handles the lifecycle methods of the editor (such as start and end).
### 3.2.2 Specific Editors
#### Code Structure
packages/vtable-editors: Various editor components
-   **base-editor.ts**: Base editor class implementing basic methods of the `IEditor` interface.
-   **input-editor.ts**: Text input editor inheriting from `BaseEditor`.
-   **list-editor.ts**: Dropdown list editor inheriting from `BaseEditor`.
-   **textArea-editor.ts**: Multi-line text input editor inheriting from `BaseEditor`.
-   **date-input-editor.ts**: Date input editor inheriting from `InputEditor`.
-   **types.ts**: Defines custom editor-related interfaces.
-   **index.ts**: Exports all editor classes.
#### Editor Analysis
##### types.ts
-   **Function**: Defines custom editor `IEditor` and related types.
-   **Main Interfaces and Types**:
###### 1. `IEditor` Interface
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEditor<V = any, T = any> {
  // ...
}
```
-   `IEditor` is a generic interface, `V` represents the value type of the cell, and `T` represents the type of the table instance, both default to `any`.
-   `onStart` method:
    -   Called when the cell enters edit mode.
    -   Receives an `EditContext` object as a parameter, containing context information during editing.
    -   If this method is not provided, a warning will be thrown upon removal of `beginEditing`.
-   `onEnd` method:
    -   Called when the cell exits edit mode.
    -   If this method is not provided, a warning will be thrown upon removal of `exit`.
-   `isEditorElement` method:
    -   Called when the editor is in edit mode and the user clicks somewhere.
    -   Receives a parameter `target` of type `HTMLElement`, representing the element clicked by the user.
    -   If it returns `false`, VTable will exit edit mode; if it returns `true` or is undefined, no action will be taken, requiring manual calling of `endEdit` to exit edit mode.
-   `validateValue` method:
    -   Used to validate the validity of the value before setting it into the table.
    -   Receives new value `newValue`, old value `oldValue`, cell position `position`, and table instance `table` as parameters.
    -   Can return `boolean` type, `ValidateEnum` enumeration value, or `Promise<boolean | ValidateEnum>` type.
-   `getValue` method:
    -   Called when the editor exits edit mode in any way.
    -   Expected to return the current value of the cell.
-   `beginEditing` method:
    -   Called when the cell enters edit mode.
    -   Deprecated, recommended to use `onStart` instead.
-   `exit` method:
    -   Deprecated, recommended to use `onEnd` instead.
-   `targetIsOnEditor` method:
    -   Deprecated, recommended to use `isEditorElement` instead.
-   `bindSuccessCallback` method:
    -   Called when the cell enters edit mode, receiving a callback function to end edit mode.
    -   Deprecated, the callback function is provided as `endEdit` in `EditContext`, recommended to use `onStart` instead.
2. ###### `EditContext` Interface
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditContext<V = any, T = any> {
  // ...
}
```
-   `EditContext` is a generic interface used to provide context information during editing.
-   `container` property: Container element of the VTable instance.
-   `referencePosition` property: Position information of the cell being edited.
-   `value` property: Value of the cell before editing.
-   `endEdit` method: Callback function to end edit mode.
-   `table` property: Table instance.
-   `col` property: Column index of the cell.
-   `row` property: Row index of the cell.
3. ###### `RectProps` Interface
```typescript
export interface RectProps {
  left: number;
  top: number;
  width: number;
  height: number;
}
```
-   `RectProps` interface defines attributes of a rectangle, including coordinates `left` and `top`, and dimensions `width` and `height`.
###### 4. `Placement` Enumeration
```typescript
export enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
```
-   `Placement` enumeration defines four possible positions: top, bottom, left, and right.
###### 5. `ReferencePosition` Interface
```typescript
export interface ReferencePosition {
  rect: RectProps;
  placement?: Placement;
}
```
-   `ReferencePosition` interface defines a reference position, containing a rectangle of type `RectProps` and an optional `Placement` enumeration value.
###### 6. `ValidateEnum` Enumeration
```typescript
export enum ValidateEnum {
  validateExit = 'validate-exit',
  invalidateExit = 'invalidate-exit',
  validateNotExit = 'validate-not-exit',
  invalidateNotExit = 'invalidate-not-exit'
}
```
-   `ValidateEnum` enumeration defines four validation results: validation passed and exit edit mode, validation failed and exit edit mode, validation passed but do not exit edit mode, validation failed but do not exit edit mode.
###### 7. `CellAddress` Type
```typescript
export type CellAddress = {
  col: number;
  row: number;
};
```
-   `CellAddress` type defines the address of a cell, containing column index `col` and row index `row`.
##### base-editor.ts
-   **Function**: Defines a base editor class `BaseEditor` as the base class for other editors (comment mentions it might not be needed).
##### input-editor.ts
-   **Function**: Implements a regular input editor `InputEditor` inheriting from the `IEditor` interface.
-   **Main Methods**:
    -   `createElement()`: Creates and configures the input element.
    -   `setValue(value: string)`: Sets the value of the input box.
    -   `getValue()`: Gets the value of the input box.
    -   `onStart(context: EditContext<string>)`: Initializes the editor, including creating elements, setting values, and adjusting position.
    -   `adjustPosition(rect: RectProps)`: Adjusts the position of the input box based on given rectangle information.
    -   `endEditing()` and `onEnd()`: Cleans up editor resources.
    -   `isEditorElement(target: HTMLElement)`: Determines whether the target element belongs to the current editor’s element.
    -   `validateValue(newValue?: any, oldValue?: any, position?: CellAddress, table?: any)`: Validates the new value.
##### list-editor.ts
-   **Function**: Implements a dropdown list editor `ListEditor` inheriting from the `IEditor` interface.
-   **Main Methods**:
    -   `createElement(value: string)`: Creates and configures the dropdown list element.
    -   `setValue(value: string)`: Sets the value of the dropdown list.
    -   `getValue()`: Gets the value of the dropdown list.
    -   `onStart(context: EditContext)`: Initializes the editor, including creating elements, setting values, and adjusting position.
    -   `adjustPosition(rect: RectProps)`: Adjusts the position of the dropdown list based on given rectangle information.
    -   `endEditing()` and `onEnd()`: Cleans up editor resources.
    -   `isEditorElement(target: HTMLElement)`: Determines whether the target element belongs to the current editor’s element.
##### textArea-editor.ts
-   **Function**: Implements a text area editor `TextAreaEditor` inheriting from the `IEditor` interface.
-   **Main Methods**:
    -   `createElement()`: Creates and configures the text area element.
    -   `setValue(value: string)`: Sets the value of the text area.
    -   `getValue()`: Gets the value of the text area.
    -   `onStart(context: EditContext<string>)`: Initializes the editor, including creating elements, setting values, and adjusting position.
    -   `adjustPosition(rect: RectProps)`: Adjusts the position of the text area based on given rectangle information.
    -   `endEditing()` and `onEnd()`: Cleans up editor resources.
    -   `isEditorElement(target: HTMLElement)`: Determines whether the target element belongs to the current editor’s element.
##### date-input-editor.ts
-   **Function**: Implements a date input editor `DateInputEditor` inheriting from the `InputEditor` class.
-   **Main Methods**:
    -   `createElement()`: Creates and configures the date input element.
    -   Other methods inherited from `InputEditor`.
##### index.ts
-   **Function**: Exports all editor classes and type definitions.
-   **Content**: Imports and exports `InputEditor`, `DateInputEditor`, `ListEditor`, and `TextAreaEditor`, along with all type definitions imported from `types.ts`.
#### File Relationships
1.  **Interface and Implementation**:
    1.  All specific editor classes (e.g., `TextAreaEditor`, `ListEditor`, `InputEditor`, `DateInputEditor`) implement the `IEditor` interface.
1.  **Inheritance Relationship**:
    1.  `DateInputEditor` inherits from `InputEditor`, reusing part of its logic.
    1.  `BaseEditor` is commented out, possibly to simplify the design, using the `IEditor` interface directly.
1.  **Dependency Relationship**:
    1.  Each editor class depends on the interfaces and types defined in `types.ts`.
    1.  `index.ts` is responsible for exporting all editor classes and type definitions for external module usage.
1.  **Common Logic**:
    1.  Multiple editor classes (e.g., `TextAreaEditor`, `ListEditor`, `InputEditor`) share similar method structures, such as `createElement()`, `setValue()`, `getValue()`, indicating they follow the same editor lifecycle management.
# 4. Core Processes
## 1. Initialization
When creating an `EditManager` instance, the constructor `constructor` is called, which takes a `table` object as a parameter and calls the `bindEvent` method to bind events.
```typescript
constructor(table: T) {
  this.table = table;
  this.bindEvent();
}
```
## 2. Event Binding
The `bindEvent` method is responsible for binding double-click and single-click events of the table, determining the editing trigger method based on the `editCellTrigger` configuration.
```typescript
bindEvent() {
  const editCellTrigger = this.table.options.editCellTrigger;
  this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
    if (
      !editCellTrigger || // Default is double-click
      editCellTrigger === 'doubleclick' ||
      (Array.isArray(editCellTrigger) && editCellTrigger.includes('doubleclick'))
    ) {
      const { col, row } = e;
      // Take automatic column width adjustment logic on double-click
      const eventArgsSet = getCellEventArgsSet(e.federatedEvent);
      const resizeCol = this.table.scenegraph.getResizeColAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgsSet.eventArgs?.targetCell
      );
      if (this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
        // Determine the same DBLCLICK_CELL listener for double-click auto column width
        // If it's double-click auto column width, editing won't start
        return;
      }
      this.startEditCell(col, row);
    }
  });
  // ...
}
```
## 3. Start Editing
When the user triggers a double-click or single-click event, the `startEditCell` method is called to start editing the cell.
```typescript
startEditCell(col: number, row: number, value?: string | number) {
// ...
    editor.onStart?.({
      value: dataValue,
      endEdit: () => {
        this.completeEdit();
      },
      referencePosition,
      container: this.table.getElement(),
      table: this.table,
      col,
      row
    });
  }
}
```
This method checks if it is currently editing; if so, it returns directly. Then it gets the cell editor and checks if the cell is editable. If editable, it sets the current cell and editor, and calls the `editor.onStart` method to start editing.
## 4. End Editing
The `completeEdit` method is used to end the editing process, checking if value validation is in progress and if the event target is within the editor. If value validation is required, it calls the `editor.validateValue` method for validation.
```typescript
completeEdit(e?: Event): boolean | Promise<boolean> {
// ...
  if (this.editingEditor.validateValue) {
    this.isValidatingValue = true;
    const newValue = this.editingEditor.getValue();
    const oldValue = this.table.getCellOriginValue(this.editCell.col, this.editCell.row);
    const maybePromiseOrValue = this.editingEditor.validateValue?.(newValue, oldValue, this.editCell, this.table);
    if (isPromise(maybePromiseOrValue)) {
      this.isValidatingValue = true;
      return new Promise((resolve, reject) => {
        maybePromiseOrValue
          .then(result => {
            dealWithValidateValue(result, this, oldValue, resolve);
          })
          .catch((err: Error) => {
            this.isValidatingValue = false;
            console.error('VTable Error:', err);
            reject(err);
          });
      });
    }
    return dealWithValidateValue(maybePromiseOrValue, this, oldValue);
  }
  this.doExit();
  return true;
}
```
## 5. Handle Validation Results
The `dealWithValidateValue` function decides whether to exit the editing state based on the validation result.
```typescript
function dealWithValidateValue(
// ...
  if (validateValue === 'validate-exit') {
    editManager.doExit();
    resolve?.(true);
    return true;
  } else if (validateValue === 'invalidate-exit') {
    (editManager.editingEditor as any).setValue(oldValue);
    editManager.doExit();
    resolve?.(true);
    return true;
  } else if (validateValue === 'validate-not-exit') {
    resolve?.(false);
    return false;
  } else if (validateValue === 'invalidate-not-exit') {
    resolve?.(false);
    return false;
  } else if (validateValue === true) {
    editManager.doExit();
    resolve?.(true);
    return true;
  }
// ...
}
```
## 6. Exit Editing
The `doExit` method is used to exit the editing state, update the table cell values, and call the `editor.onEnd` method.
```typescript
doExit() {
// ...
  for (let row = range.start.row; row <= range.end.row; row++) {
    const rowChangedValues = [];
    for (let col = range.start.col; col <= range.end.col; col++) {
      rowChangedValues.push(changedValue);
    }
    changedValues.push(rowChangedValues);
  }
  (this.table as ListTableAPI).changeCellValues(range.start.col, range.start.row, changedValues);
  this.editingEditor.onEnd?.();
  this.editingEditor = null;
  this.isValidatingValue = false;
}
```
## 7. Cancel Editing
The `cancelEdit` method is used to cancel the editing state, calling the `editor.onEnd` method and clearing the editor.
## Flowchart
![VTable Data Editing Flowchart](https://raw.githubusercontent.com/3Justice/articles/main/VTable/img/VTable-DataEditing-FlowChart.png)
# 5. Practical Application
In the current project, the `EditManager` class in `edit-manager.ts` provides support for table editing functionality, while `PivotTable.ts` and `ListTable.ts` utilize this class to implement their respective table editing functionalities. Below is a detailed introduction to the application of `EditManager` in these two files:
### Application in `PivotTable.ts`
1.  Import `EditManager`
At the beginning of the `PivotTable.ts` file, import the `EditManager` class:
```typescript
import { EditManager } from './edit/edit-manager';
```
2.  Create `EditManager` Instance
In the constructor of the `PivotTable` class, create an `EditManager` instance:
```typescript
this.editManager = new EditManager(this);
```
Here, the `PivotTable` instance `this` is passed as a parameter to the `EditManager` constructor.
3.  Call `EditManager` Methods
In the `PivotTable` class, define `startEditCell` and `completeEditCell` methods to call the corresponding methods of the `EditManager` instance:
```typescript
startEditCell(col?: number, row?: number, value?: string | number) {
  this.editManager.startEditCell(col, row, value);
}
completeEditCell() {
  this.editManager.completeEdit();
}
```
The `startEditCell` method calls the `startEditCell` method of the `EditManager` instance to start cell editing; the `completeEditCell` method calls the `completeEdit` method of the `EditManager` instance to end cell editing.
The `EditManager` class provides support for cell editing functionality for `PivotTable` and `ListTable`. In the constructors of these two classes, `EditManager` instances are created, and their own instances are passed as parameters to the `EditManager` constructor. In subsequent editing functionality implementations, the methods of the `EditManager` instance are called to handle cell editing operations.
# Summary
Through the design of the base class and specific editors, `vtable`’s data editing functionality achieves high reusability and extensibility. This design not only simplifies the code structure but also makes supporting new data types easier. Meanwhile, through the unified definition of interfaces, interaction between different editors becomes more flexible.