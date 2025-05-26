---
title: 11 数据编辑    

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# 引言

## 1.1 **背景介绍**



在现代的数据可视化与表格应用中，用户对表格数据的编辑需求日益增长。VTable 作为一款强大的表格组件库，为满足这一需求提供了完善的数据编辑功能。`vtable` 是一个开源的表格项目，旨在为用户提供灵活、高效的数据管理和编辑功能。数据编辑是表格应用的核心功能之一，它允许用户对表格中的数据进行修改、验证和保存。为了实现这一功能，`vtable` 采用了面向对象的设计思想，通过定义一个编辑器基类和多种具体编辑器来满足不同类型数据的编辑需求。    



## 1.2 **文档目的**：



本源码解读文档旨在深入剖析 VTable 数据编辑功能的实现原理，帮助开发者更好地理解其设计思路、模块划分以及核心流程，以便在实际项目中更高效地使用和扩展该功能。我们将从概念介绍、代码设计以及核心流程三个方面展开，帮助读者理解编辑器的设计理念和实现方式。    

# 概念介绍

## 2.1 编辑器基类的作用



编辑器基类是整个编辑功能的框架核心。它定义了所有具体编辑器必须实现的接口，包括初始化、验证和保存等通用功能。通过这种方式，基类为具体编辑器提供了一个统一的接口，确保了代码的复用性和扩展性。同时，基类还负责处理一些通用的逻辑，例如错误处理和状态管理。    



## 2.2 具体编辑器的设计概念



具体编辑器是针对特定数据类型（如文本、数字、日期等）的定制化实现。每个具体编辑器继承自基类，并根据其处理的数据类型实现特定的逻辑。例如，文本编辑器可能不需要复杂的验证逻辑，而数字编辑器和日期编辑器则需要对输入数据进行严格格式校验。通过这种设计，`vtable` 能够灵活地支持多种数据类型的编辑需求。    



# 代码设计



## 3.1 整体思路

VTable 的数据编辑功能整体设计遵循模块化和可扩展的原则。通过将编辑功能拆分成多个独立的模块，每个模块负责特定的功能，如编辑管理、编辑器实现、类型定义等，使得代码结构清晰，易于维护和扩展。同时，使用接口和基类来规范编辑器的行为，确保不同类型的编辑器能够与编辑管理模块无缝协作。    



## 3.2 代码结构

### 3.2.1 编辑管理器

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">packages/vtable/src/edit/edit-manager.ts    
*  **作用**：负责管理表格单元格的编辑流程，包括事件绑定、启动编辑、完成编辑和取消编辑等。    
*  **依赖**：`IEditor` 接口定义了编辑器的行为规范，`TABLE_EVENT_TYPE` 定义了表格事件类型，`getCellEventArgsSet` 获取事件参数集，`isPromise` 判断是否为 Promise，`isValid` 验证值的有效性。    
packages/vtable/src/edit/editors.ts    
*  **作用**：定义了一个编辑器管理模块。它导出了一个编辑器注册表 `editors` 和一个获取编辑器的函数 `get`。`get` 函数根据名称从注册表中查找编辑器，如果未找到则发出警告并返回 `undefined`。    
</div>
editors.ts 定义了一个编辑器管理模块，用于管理和获取不同名称的编辑器实例    

```Typescript
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
*  `editors` 是一个导出的常量对象，用于存储所有已注册的编辑器实例。它的类型是一个映射类型，键为字符串（`key: string`），值为 `IEditor` 类型的实例。初始时，这个对象为空。    

*  `get` 是一个导出的函数，用于根据编辑器名称 `editorName` 从 `editors` 对象中获取对应的编辑器实例。    

*  首先，通过 `editors[editorName]` 尝试获取指定名称的编辑器实例，并将其赋值给变量 `editor`。    

*  然后，检查 `editor` 是否存在。如果不存在，说明该编辑器没有被注册，会在控制台输出警告信息 `'editor should register before init table!'`，并返回 `undefined`。    

*  如果 `editor` 存在，则直接返回 `editors[editorName]`，即指定名称的编辑器实例。    

因此，编辑器使用需要先new创建实例后注册，在register.ts中：    

```Typescript
export function editor(name: string, editor?: IEditor): IEditor {
  if (editor !== null && editor !== undefined) {
    return register(editors, name, editor);
  }
  return editors[name];
}    

```
该函数接受两个参数：    

*  name：代表要这册的编辑器的名称    

*  editor：可选参数，表示编辑器实例    

函数返回值类型为IEditor    

函数逻辑：    

*  当传入的 `editor` 参数不为 `null` 且不为 `undefined` 时，调用 `register` 函数将这个编辑器实例以 `name` 作为键注册到 `editors` 对象中，并返回原本在该键下的旧编辑器实例。    

*  若未传入 `editor` 参数，函数会尝试从 `editors` 对象中获取以 `name` 为键的编辑器实例并返回。若该键不存在，返回 `undefined`。    





`EditManager` 是一个用于管理表格单元格编辑的类。它负责处理用户触发的编辑事件（如双击或点击），启动编辑器，验证编辑值，并在编辑完成后更新表格数据。    

#### 主要属性

*  **table**: 表格实例，类型为 `ListTableAPI`。    

*  **editingEditor**: 当前正在使用的编辑器实例，类型为 `IEditor`。    

*  **isValidatingValue**: 标记是否正在进行值验证，类型为 `boolean`。    

*  **editCell**: 正在编辑的单元格位置，包含 `col` 和 `row` 属性。    



#### 方法解析



##### bindEvent

绑定表格上的事件监听器，处理双击和点击事件以启动编辑。    

```xml
bindEvent() {
  // 绑定双击事件
  this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
    if (满足编辑条件) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });

  // 绑定点击事件
  this.table.on(TABLE_EVENT_TYPE.CLICK_CELL, e => {
    if (满足编辑条件) {
      const { col, row } = e;
      this.startEditCell(col, row);
    }
  });
}    

```
##### startEditCell

启动单元格编辑。    

```xml
startEditCell(col: number, row: number, value?: string | number) {
    // ...
    // 启动编辑器
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

完成编辑操作，验证编辑值并更新表格数据。    

```xml
completeEdit(e?: Event): boolean | Promise<boolean> {
  // ...
  // 获取新旧值并进行验证
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

退出编辑状态并更新表格数据。    

```xml
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

取消编辑操作。    

```xml
cancelEdit() {
  if (this.editingEditor) {
    this.editingEditor.onEnd?.();
    this.editingEditor = null;
  }
}    

```
##### dealWithValidateValue

处理验证结果，根据验证结果决定是否退出编辑。    

```xml
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
#### 总结

`EditManager` 类通过监听表格事件来启动和管理单元格编辑过程，确保编辑器正确启动、验证编辑值并在编辑完成后更新表格数据。该类还提供了取消编辑的功能，并处理了编辑器的生命周期方法（如开始和结束）。    



### 3.2.2 具体编辑器



#### 代码结构

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">packages/vtable-editors：多种编辑器组件    
*  **base-editor.ts**：基础编辑器类，实现了 `IEditor` 接口的基本方法。    
*  **input-editor.ts**：用于文本输入的编辑器，继承自 `BaseEditor`。    
*  **list-editor.ts**：用于选择列表项的编辑器，继承自 `BaseEditor`。    
*  **textArea-editor.ts**：用于多行文本输入的编辑器，继承自 `BaseEditor`。    
*  **date-input-editor.ts**：用于日期输入的编辑器，继承自 `InputEditor`。    
*  **types.ts**：定义了自定义编辑器类型的相关接口。    
*  **index.ts**：导出所有编辑器类。    
</div>


#### 编辑器解析

##### types.ts

*  **功能**：定义了自定义编辑器 `IEditor` 和相关类型。    

*  **主要接口和类型**：    

###### 1. `IEditor` 接口

```xml
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEditor<V = any, T = any> {
  // ...
}    

```
*  `IEditor` 是一个泛型接口，`V` 代表单元格的值类型，`T` 代表表格实例的类型，默认都为 `any`。    

*  `onStart` 方法：    

*  当单元格进入编辑模式时调用。    

*  接收一个 `EditContext` 对象作为参数，包含了编辑时的上下文信息。    

*  若不提供此方法，在移除 `beginEditing` 后会抛出警告。    

*  `onEnd` 方法：    

*  当单元格退出编辑模式时调用。    

*  若不提供此方法，在移除 `exit` 后会抛出警告。    

*  `isEditorElement` 方法：    

*  当编辑器处于编辑模式且用户点击某处时调用。    

*  接收一个 `HTMLElement` 类型的参数 `target`，表示用户点击的元素。    

*  若返回 `false`，VTable 将退出编辑模式；若返回 `true` 或未定义此方法，则不做处理，需要手动调用 `endEdit` 结束编辑模式。    

*  `validateValue` 方法：    

*  在将新值设置到表格之前，用于验证值的有效性。    

*  接收新值 `newValue`、旧值 `oldValue`、单元格位置 `position` 和表格实例 `table` 作为参数。    

*  可以返回 `boolean` 类型、`ValidateEnum` 枚举值或 `Promise<boolean | ValidateEnum>` 类型。    

*  `getValue` 方法：    

*  当编辑器以任何方式退出编辑模式时调用。    

*  期望返回单元格的当前值。    

*  `beginEditing` 方法：    

*  当单元格进入编辑模式时调用。    

*  已弃用，建议使用 `onStart` 代替。    

*  `exit` 方法：    

*  已弃用，建议使用 `onEnd` 代替。    

*  `targetIsOnEditor` 方法：    

*  已弃用，建议使用 `isEditorElement` 代替。    

*  `bindSuccessCallback` 方法：    

*  当单元格进入编辑模式时调用，接收一个回调函数用于结束编辑模式。    

*  已弃用，回调函数作为 `EditContext` 中的 `endEdit` 提供，建议使用 `onStart` 代替。    

###### `EditContext` 接口

```xml
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditContext<V = any, T = any> {
  // ...
}    

```
*  `EditContext` 是一个泛型接口，用于提供编辑时的上下文信息。    

*  `container` 属性：VTable 实例的容器元素。    

*  `referencePosition` 属性：正在编辑的单元格的位置信息。    

*  `value` 属性：编辑前的单元格值。    

*  `endEdit` 方法：用于结束编辑模式的回调函数。    

*  `table` 属性：表格实例。    

*  `col` 属性：单元格所在的列索引。    

*  `row` 属性：单元格所在的行索引。    



###### `RectProps` 接口

```xml
export interface RectProps {
  left: number;
  top: number;
  width: number;
  height: number;
}    

```
*  `RectProps` 接口定义了一个矩形的属性，包括左上角的坐标 `left` 和 `top`，以及宽度 `width` 和高度 `height`。    



###### 4. `Placement` 枚举

```xml
export enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}    

```
*  `Placement` 枚举定义了四个可能的位置：顶部、底部、左侧和右侧。    



###### 5. `ReferencePosition` 接口

```xml
export interface ReferencePosition {
  rect: RectProps;
  placement?: Placement;
}    

```
*  `ReferencePosition` 接口定义了一个参考位置，包含一个 `RectProps` 类型的矩形和一个可选的 `Placement` 枚举值。    



###### 6. `ValidateEnum` 枚举

```xml
export enum ValidateEnum {
  validateExit = 'validate-exit',
  invalidateExit = 'invalidate-exit',
  validateNotExit = 'validate-not-exit',
  invalidateNotExit = 'invalidate-not-exit'
}    

```
*  `ValidateEnum` 枚举定义了四种验证结果：验证通过并退出编辑模式、验证失败并退出编辑模式、验证通过但不退出编辑模式、验证失败但不退出编辑模式。    



###### 7. `CellAddress` 类型

```xml
export type CellAddress = {
  col: number;
  row: number;
};    

```
*  `CellAddress` 类型定义了一个单元格的地址，包含列索引 `col` 和行索引 `row`。    



##### base-editor.ts

*  **功能**：定义了一个基础编辑器类 `BaseEditor`，作为其他编辑器的基类（注释中提到可能不需要）。    



##### input-editor.ts

*  **功能**：实现了普通输入编辑器 `InputEditor`，继承自 `IEditor` 接口。    

*  **主要方法**：    

*  `createElement()`：创建并配置输入元素。    

*  `setValue(value: string)`：设置输入框的值。    

*  `getValue()`：获取输入框的值。    

*  `onStart(context: EditContext<string>)`：初始化编辑器，包括创建元素、设置值和调整位置。    

*  `adjustPosition(rect: RectProps)`：根据给定的矩形信息调整输入框的位置。    

*  `endEditing()` 和 `onEnd()`：清理编辑器资源。    

*  `isEditorElement(target: HTMLElement)`：判断目标元素是否为当前编辑器的元素。    

*  `validateValue(newValue?: any, oldValue?: any, position?: CellAddress, table?: any)`：验证新值。    



##### list-editor.ts

*  **功能**：实现了一个下拉列表编辑器 `ListEditor`，继承自 `IEditor` 接口。    

*  **主要方法**：    

*  `createElement(value: string)`：创建并配置下拉列表元素。    

*  `setValue(value: string)`：设置下拉列表的值。    

*  `getValue()`：获取下拉列表的值。    

*  `onStart(context: EditContext)`：初始化编辑器，包括创建元素、设置值和调整位置。    

*  `adjustPosition(rect: RectProps)`：根据给定的矩形信息调整下拉列表的位置。    

*  `endEditing()` 和 `onEnd()`：清理编辑器资源。    

*  `isEditorElement(target: HTMLElement)`：判断目标元素是否为当前编辑器的元素。    



##### textArea-editor.ts

*  **功能**：实现了一个文本区域编辑器 `TextAreaEditor`，继承自 `IEditor` 接口。    

*  **主要方法**：    

*  `createElement()`：创建并配置文本区域元素。    

*  `setValue(value: string)`：设置文本区域的值。    

*  `getValue()`：获取文本区域的值。    

*  `onStart(context: EditContext<string>)`：初始化编辑器，包括创建元素、设置值和调整位置。    

*  `adjustPosition(rect: RectProps)`：根据给定的矩形信息调整文本区域的位置。    

*  `endEditing()` 和 `onEnd()`：清理编辑器资源。    

*  `isEditorElement(target: HTMLElement)`：判断目标元素是否为当前编辑器的元素。    



##### date-input-editor.ts

*  **功能**：实现了日期输入编辑器 `DateInputEditor`，继承自 `InputEditor` 类。    

*  **主要方法**：    

*  `createElement()`：创建并配置日期输入元素。    

*  其他方法继承自 `InputEditor`。    



##### index.ts

*  **功能**：导出所有编辑器类和类型定义。    

*  **内容**：导入并导出了 `InputEditor`、`DateInputEditor`、`ListEditor` 和 `TextAreaEditor`，以及从 `types.ts` 导入的所有类型定义。    



#### 文件间关系

1. **接口与实现**：    

*  所有具体的编辑器类（如 `TextAreaEditor`、`ListEditor`、`InputEditor`、`DateInputEditor`）都实现了 `IEditor` 接口。    

1. **继承关系**：    

*  `DateInputEditor` 继承自 `InputEditor`，复用了其部分逻辑。    

*  `BaseEditor` 被注释掉，可能是为了简化设计，直接使用 `IEditor` 接口。    

1. **依赖关系**：    

*  各个编辑器类依赖于 `types.ts` 中定义的接口和类型。    

*  `index.ts` 负责导出所有编辑器类和类型定义，供外部模块使用。    

1. **共通逻辑**：    

*  多个编辑器类（如 `TextAreaEditor`、`ListEditor`、`InputEditor`）共享相似的方法结构，如 `createElement()`、`setValue()`、`getValue()` 等，这表明它们遵循相同的编辑器生命周期管理。    



# 核心流程

## 初始化

当创建 `EditManager` 实例时，会调用构造函数 `constructor`，该函数接收一个 `table` 对象作为参数，并调用 `bindEvent` 方法绑定事件。    

```xml
constructor(table: T) {
  this.table = table;
  this.bindEvent();
}    

```
##  事件绑定

`bindEvent` 方法负责绑定表格的双击和单击事件，根据 `editCellTrigger` 配置决定触发编辑的方式。    

```xml
bindEvent() {
  const editCellTrigger = this.table.options.editCellTrigger;
  this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
    if (
      !editCellTrigger || //默认为双击
      editCellTrigger === 'doubleclick' ||
      (Array.isArray(editCellTrigger) && editCellTrigger.includes('doubleclick'))
    ) {
      const { col, row } = e;
      // 取双击自动列宽逻辑
      const eventArgsSet = getCellEventArgsSet(e.federatedEvent);
      const resizeCol = this.table.scenegraph.getResizeColAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgsSet.eventArgs?.targetCell
      );
      if (this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
        // 判断同双击自动列宽的时间监听的DBLCLICK_CELL
        // 如果是双击自动列宽 则编辑不开启
        return;
      }
      this.startEditCell(col, row);
    }
  });
  // ...
}    

```
## 开始编辑

当用户触发双击或单击事件时，会调用 `startEditCell` 方法开始编辑单元格。    

```xml
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
该方法会检查当前是否正在编辑，如果是则直接返回。然后获取单元格的编辑器，并检查该单元格是否可编辑。如果可以编辑，则设置当前编辑的单元格和编辑器，并调用 `editor.onStart` 方法开始编辑。    

## 结束编辑

`completeEdit` 方法用于结束编辑过程，它会检查是否正在验证值，以及事件目标是否在编辑器内。如果需要验证值，则调用 `editor.validateValue` 方法进行验证。    

```xml
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
## 处理验证结果

`dealWithValidateValue` 函数根据验证结果决定是否退出编辑状态。    

```xml
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
## 退出编辑

`doExit` 方法用于退出编辑状态，更新表格单元格的值，并调用 `editor.onEnd` 方法。    

```xml
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
## 取消编辑

`cancelEdit` 方法用于取消编辑状态，调用 `editor.onEnd` 方法并清空编辑器。    

## 流程图

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/Jl6HwHXC3h2z6EbQzEUchmAOnWc.gif)



# 实际运用

在当前工程里，`edit-manager.ts` 里的 `EditManager` 类为表格编辑功能提供了支持，而 `PivotTable.ts` 和 `ListTable.ts` 则运用这个类来实现各自表格的编辑功能。下面详细介绍 `EditManager` 在这两个文件中的运用情况：    

### 在 `PivotTable.ts` 中的运用

1. 导入 `EditManager`    

在 `PivotTable.ts` 文件开头，导入 `EditManager` 类：    

```xml
import { EditManager } from './edit/edit-manager';    

```
1. 创建 `EditManager` 实例    

在 `PivotTable` 类的构造函数中，创建 `EditManager` 实例：    

```xml
this.editManager = new EditManager(this);    

```
这里将 `PivotTable` 实例 `this` 作为参数传递给 `EditManager` 的构造函数。    

1. 调用 `EditManager` 方法    

在 `PivotTable` 类中，定义了 `startEditCell` 和 `completeEditCell` 方法，用于调用 `EditManager` 实例的对应方法：    

```xml
startEditCell(col?: number, row?: number, value?: string | number) {
  this.editManager.startEditCell(col, row, value);
}

completeEditCell() {
  this.editManager.completeEdit();
}    

```
`startEditCell` 方法调用 `EditManager` 实例的 `startEditCell` 方法，开启单元格编辑；`completeEditCell` 方法调用 `EditManager` 实例的 `completeEdit` 方法，结束单元格编辑。    

`EditManager` 类为 `PivotTable` 和 `ListTable` 提供了单元格编辑功能的支持。在这两个类的构造函数中，都会创建 `EditManager` 实例，并且把自身实例作为参数传递给 `EditManager` 的构造函数。在后续的编辑功能实现中，会调用 `EditManager` 实例的方法来处理单元格编辑操作。    

# 总结

通过基类和具体编辑器的设计，`vtable` 的数据编辑功能实现了高度的复用性和扩展性。这种设计不仅简化了代码结构，还使得新增数据类型的支持变得更加容易。同时，通过接口的统一定义，不同编辑器之间的交互也更加灵活。    



 # 本文档由以下人员修正整理 
 [玄魂](https://github.com/xuanhun)