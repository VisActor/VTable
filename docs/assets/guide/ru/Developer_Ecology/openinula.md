# Openinula-Vтаблица

The `@visactor/openinula-vтаблица` packвозраст is a Openinula encapsulation к make it easier к use Vтаблица в the Openinula environment. This компонент mainly encapsulates the Vтаблица таблица в Openinula компонент form, и the related configuration items are consistent с the Vтаблица.

## Quick начало

### Environmental requirements

Make sure **node**, **npm** и **Openinula** are installed в your environment и meet Следующий version requirements:

- node 10.12.0+
- npm 6.4.0+
- openinula 0.1.2-SNAPSHOT+

### Install

#### Install using the packвозраст manвозрастr

```shell
# use npm
npm install @visactor/openinula-vтаблица

# use yarn
yarn add @visactor/openinula-vтаблица
```

### Introducing Openinula-Vтаблица

It is recommended к use npm packвозраст к import

```js
import { списоктаблица } от '@visactor/openinula-vтаблица';
```

## Draw a simple список

Вы можете use the `списоктаблица` компонент imported via `@visactor/openinula-vтаблица` just like a standard Openinula компонент.

Here is a simple список пример код:

```typescript
import Openinula от 'openinula';
import OpeninulaDOM от 'openinula-dom/client';
import { списоктаблица } от '@visactor/openinula-vтаблица';

const option = {
  columns: [
    {
      поле: '0',
      заголовок: 'имя'
    },
    {
      поле: '1',
      заголовок: 'возраст'
    },
    {
      поле: '2',
      заголовок: 'пол'
    },
    {
      поле: '3',
      заголовок: 'хобби'
    }
  ],
  records: новый массив(1000).fill(['John', 18, 'male', '🏀'])
};

Inula.render(<списоктаблица option={option} высота={'500px'} />, document.getElementById('root'));
```

Refer к [демонстрация](../../демонстрация-openinula/usвозраст/option)

## Usвозраст

Openinula-Vтаблица provides two styles из компонентs для developers к use, имяly unified tags и syntactic tags.

### Unified tags

Unified tags refer к using a таблица tag к receive a complete `option` configuration. If Vтаблица is already used в the project, this method can quickly use Openinula-Vтаблица. The above пример is a [демонстрация](../../демонстрация-openinula/usвозраст/grammatical-tag) using unified tags.

Same as Vтаблица Openinula-Vтаблица provides three таблица types:

- списоктаблица: список таблица, used к display список данные [демонстрация](../../демонстрация-openinula/usвозраст/grammatical-tag)
- сводныйтаблица: сводный таблица, used к display cross-сводный данные [демонстрация](../../демонстрация-openinula/grammatical-tag/сводный-таблица)
- сводныйграфик: сводный график, used к display cross-сводный данные и display it в a график [демонстрация](../../демонстрация-openinula/grammatical-tag/сводный-график)

The props из these three Openinula компонентs are defined as follows:

```ts
интерфейс VтаблицаProps extends событиеsProps {
  опция: IтаблицаOption;
  records?: любой;
  ширина?: число;
  высота?: число;
  onReady?: (instance: Vтаблица, isInitial: логический) => void;
}
```

для the definition из событиеsProps, refer к the событие binding chapter.

onReady is a built-в обратный вызов событие that will be triggered when the таблица is rendered или updated. Its ввод parameters respectively represent the таблица instance объект и whether it is rendered для the первый time.

The Openinula-Vтаблица unified label is almost the equivalent функция из Vтаблица, which can facilitate developers к migrate Openinula versions, и options obtained от the community или sample центр can be used directly в this way, с almost no additional learning cost для developers.

### Grammatical tags

Grammatical tags mean that Openinula-Vтаблица encapsulates некоторые компонентs в the таблица as Openinula компонентs и exports them к developers. Developers can define таблицаs в a way that is more semantic и closer к native Openinula declarations. It should be noted that the definition content из grammatical tags can be converted into каждый other с the таблица description `option` в most scenarios.

It should be noted that although the график is declared в the form из a Openinula компонент по definition, it is не parsed into a DOM для rendering в the actual implementation. Therefore, if you use the inspection element, Вы можетеnot see the DOM corresponding к каждый график компонент.

#### списоктаблица

The props attributes accepted по списоктаблица are consistent с options. The subкомпонентs в списоктаблица are as follows

- списокColumn: список column, consistent с the definition из columns в option [апи](../../option/списоктаблица-columns-текст#cellType)

```jsx
import { списоктаблица, списокColumn } от '../../../src';
функция App() {
  // ......
  возврат (
    <списоктаблица records={records}>
      <списокColumn поле={'0'} title={'名称'} />
      <списокColumn поле={'1'} title={'年龄'} />
      <списокColumn поле={'2'} title={'性别'} />
      <списокColumn поле={'3'} title={'爱好'} />
    </списоктаблица>
  );
}
```

Grammatical tag демонстрация: [демонстрация](../../демонстрация-openinula/usвозраст/grammatical-tag)

#### сводныйтаблица&сводныйграфик

The props attributes accepted по сводныйтаблица&сводныйграфик are the same as options. The sub-компонентs are as follows:

- сводныйColumnDimension: The dimension configuration на the column is consistent с the definition из columns в option [апи](../../option/сводныйтаблица-columns-текст#headerType)
- сводныйRowDimension: The dimension configuration на the row is consistent с the definition из rows в option [апи](../../option/сводныйтаблица-rows-текст#headerType)
- сводныйIndicator: indicator configuration, consistent с the definition из indicators в option [апи](../../option/сводныйтаблица-indicators-текст#cellType)
- сводныйColumnHeaderзаголовок: column header title configuration, consistent с the definition из columnHeaderTitle в option [апи](../../option/сводныйтаблица#rowHeaderTitle)
- сводныйRowHeaderзаголовок: row header title configuration, consistent с the definition из rowHeaderTitle в option [апи](../../option/сводныйтаблица#columnHeaderTitle)
- сводныйCorner: Corner configuration, consistent с the definition из corner в option [апи](../../option/сводныйтаблица#corner)

```jsx
возврат (
  <сводныйтаблица
  // ......
  >
    <сводныйColumnHeaderTitle
    // ......
    />
    <сводныйColumnDimension
    // ......
    />
    <сводныйColumnDimension
    // ......
    />
    <сводныйRowDimension
    // ......
    />
    <сводныйRowDimension
    // ......
    />
    <сводныйIndicator
    // ......
    />
    <сводныйIndicator
    // ......
    />
    <сводныйCorner
    // ......
    />
  </сводныйтаблица>
);
```

Grammatical label демонстрация: [сводныйтаблица демонстрация](../../демонстрация-openinula/grammatical-tag/сводный-таблица) [сводныйграфик демонстрация](../../демонстрация-openinula/grammatical-tag/сводный-график)

#### компонентs outside the таблица

External компонентs currently support:

- меню: отпускание-down меню компонент, consistent с the definition из меню в option [апи](../../option/списоктаблица#меню)
- Подсказка: Подсказка компонент, consistent с the definition из Подсказка в option [апи](../../option/списоктаблица#Подсказка)

```jsx
<сводныйтаблица>
  // ......
  <меню
  // ......
  />
  <Подсказка
  // ......
  />
</сводныйтаблица>
```

### событие binding

The Props из the outermost таблица компонент из the unified label или the syntactic таблица label inherit the событие processing обратный вызов событиеsProps из the таблица.

событиеsProps are defined as follows:

```ts
интерфейс событиеsProps {
  onНажатьCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['Нажать_cell']>;
  onDblНажатьCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['dblНажать_cell']>;
  onMouseDownCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mousedown_cell']>;
  onMouseUpCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseup_cell']>;
  onSelectedCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['selected_cell']>;
  onKeyDown?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['keydown']>;
  onMouseEnterтаблица?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseenter_таблица']>;
  onMouseLeaveтаблица?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseleave_таблица']>;
  onMouseMoveCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseleave_cell']>;
  onContextменюCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['contextменю_cell']>;
  onResizeColumn?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['resize_column']>;
  onResizeColumnEnd?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['change_header_position']>;
  onсортировкаНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['сортировка_Нажать']>;
  onFreezeНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['freeze_Нажать']>;
  onScroll?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['прокрутка']>;
  onDropdownменюНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['dropdown_меню_Нажать']>;
  onMouseOverграфикSymbol?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseover_график_symbol']>;
  onDragSelectEnd?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['drag_select_end']>;

  onDropdownиконкаНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['dropdown_иконка_Нажать']>;
  onDropdownменюClear?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['dropdown_меню_clear']>;

  onTreeHierarchyStateChange?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['tree_hierarchy_state_change']>;

  onShowменю?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['show_меню']>;
  onHideменю?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['hide_меню']>;

  onиконкаНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['иконка_Нажать']>;

  onлегендаItemНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['легенда_item_Нажать']>;
  onлегендаItemHover?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['легенда_item_hover']>;
  onлегендаItemUnHover?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['легенда_item_unHover']>;
  onлегендаChange?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['легенда_change']>;

  onMouseEnterAxis?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseenter_axis']>;
  onMouseLeaveAxis?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseleave_axis']>;

  onCheckboxStateChange?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['checkbox_state_change']>;
  onRadioStateChange?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['radio_state_change']>;
  onAfterRender?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['after_render']>;
  onInitialized?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['initialized']>;

  // сводный таблица only
  onсводныйсортировкаНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['сводный_сортировка_Нажать']>;
  onDrillменюНажать?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['drillменю_Нажать']>;

  // сводный график only
  onVграфиксобытиеType?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['vграфик_событие_type']>;
}
```

событие usвозраст пример:

```jsx
функция App() {
  const option = {
    // ......
  };
  возврат (
    <списоктаблица
      option={option}
      onНажатьCell={(...arg: любой) => {
        console.log('onНажатьCell', ...arg);
      }}
    />
  );
}
```

для detailed description из the событие, please refer к: [событие Introduction](../../guide/событие/событие_список)
