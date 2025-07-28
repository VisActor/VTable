# Vue-Vтаблица

The `@visactor/vue-vтаблица` packвозраст is a Vue wrapper designed к facilitate the use из Vтаблица в a Vue 3.x environment. This компонент mainly encapsulates the Vтаблица таблица into a Vue компонент, и the related configuration items are consistent с Vтаблица.

## Quick начало

### Environment Requirements

Ensure that **node**, **npm**, и **Vue** are installed в your environment, и meet Следующий version requirements:

- node 10.12.0+
- npm 6.4.0+
- vue 3.2+

### Installation

#### Install using a packвозраст manвозрастr

```shell
# Install using npm
npm install @visactor/vue-vтаблица

# Install using yarn
yarn add @visactor/vue-vтаблица
```

### Import Vue-Vтаблица

It is recommended к use the npm packвозраст import

```js
import { списоктаблица } от '@visactor/vue-vтаблица';
```

## Draw a Simple список

Вы можете use the `списоктаблица` компонент imported through `@visactor/vue-vтаблица` just like using a standard Vue компонент.

Here is a simple список пример код (refer к [демонстрация](../../демонстрация-vue/usвозраст/option)):

```html
<template>
  <списоктаблица :options="таблицаOptions" />
</template>

<script>
  export по умолчанию {
    данные() {
      const option = {
        header: [
          {
            поле: '0',
            caption: 'имя'
          },
          {
            поле: '1',
            caption: 'возраст'
          },
          {
            поле: '2',
            caption: 'пол'
          },
          {
            поле: '3',
            caption: 'хобби'
          }
        ],
        records: новый массив(1000).fill(['Zhang San', 18, 'Male', '🏀'])
      };
      возврат {
        таблицаOptions: option
      };
    }
  };
</script>
```

## Usвозраст

Vue-Vтаблица provides two styles из компонентs для developers к use: unified tags и grammatical tags.

### Unified Tags

Unified tags refer к using a single таблица tag that accepts a complete `option` configuration. If Vтаблица is already used в the project, this method can quickly use Vue-Vтаблица. The пример above is a [демонстрация](../../демонстрация-vue/usвозраст/option) using unified tags.

Similar к Vтаблица, Vue-Vтаблица provides three types из таблицаs:

- списоктаблица: список таблица, used к display список данные [демонстрация](../../демонстрация-vue/usвозраст/option)
- сводныйтаблица: сводный таблица, used к display cross-сводный данные [демонстрация](../../демонстрация-vue/grammatical-tag/сводный-таблица)
- сводныйграфик: сводный график, used к display cross-сводный данные в a график format [демонстрация](../../демонстрация-vue/grammatical-tag/сводный-график)

The props definitions для these three Vue компонентs are as follows:

```ts
интерфейс VтаблицаProps extends событиеsProps {
  опция: IтаблицаOption;
  records?: любой;
  ширина?: число;
  высота?: число;
}
```

Refer к the событие binding section для the definition из событиеsProps.

The unified tags из Vue-Vтаблица are almost equivalent к the functions из Vтаблица, allowing developers к easily migrate к the Vue version. Options obtained от the community или пример центр can be directly used в this way, с almost no additional learning cost для developers.

### Grammatical Tags

Grammatical tags refer к Vue-Vтаблица encapsulating некоторые компонентs в the таблица as Vue компонентs и exporting them к developers. Developers can define таблицаs в a more semantic и native Vue declarative way. It should be noted that the definition content из grammatical tags can be converted с the таблица description `option` в most scenarios.

It should be noted that although the график is declared в the form из a Vue компонент, it is не rendered as a DOM в the actual implementation. Therefore, if you use the inspect element, Вы можетеnot see the DOM corresponding к каждый график компонент.

#### списоктаблица

The props attributes accepted по списоктаблица are consistent с the option. The subкомпонентs в списоктаблица are as follows:

- списокColumn: список column, consistent с the definition из columns в the option [апи](../../option/списоктаблица-columns-текст#cellType)

```jsx
import { списоктаблица, списокColumn } от '@visactor/vue-vтаблица';
  <списоктаблица :options="таблицаOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <списокColumn поле="0" title="имя" maxширина="300" :dragHeader="true" />
    <списокColumn поле="1" title="возраст" maxширина="300" :dragHeader="true" />
    <списокColumn поле="2" title="пол" maxширина="300" :dragHeader="true" />
    <списокColumn поле="3" title="хобби" maxширина="300" :dragHeader="true" />
  </списоктаблица>
```

из course, Вы можете also make full use из Vue's syntactic sugar к make the код more concise и readable.

```html
<template>
  <списоктаблица :options="таблицаOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <template v-для="(column, index) в columns" :key="index">
      <списокColumn :поле="column.поле" :title="column.title" />
    </template>
  </списоктаблица>
</template>
```

Grammatical tags демонстрация: [демонстрация](../../демонстрация-vue/usвозраст/grammatical-tag)

#### сводныйтаблица & сводныйграфик

The props attributes accepted по сводныйтаблица & сводныйграфик are consistent с the option. The subкомпонентs are as follows:

- сводныйColumnDimension: Column dimension configuration, consistent с the definition из columns в the option [апи](../../option/сводныйтаблица-columns-текст#headerType)
- сводныйRowDimension: Row dimension configuration, consistent с the definition из rows в the option [апи](../../option/сводныйтаблица-rows-текст#headerType)
- сводныйIndicator: Indicator configuration, consistent с the definition из indicators в the option [апи](../../option/сводныйтаблица-indicators-текст#cellType)
- сводныйColumnHeaderзаголовок: Column header title configuration, consistent с the definition из columnHeaderTitle в the option [апи](../../option/сводныйтаблица#rowHeaderTitle)
- сводныйRowHeaderзаголовок: Row header title configuration, consistent с the definition из rowHeaderTitle в the option [апи](../../option/сводныйтаблица#columnHeaderTitle)
- сводныйCorner: Corner configuration, consistent с the definition из corner в the option [апи](../../option/сводныйтаблица#corner)

```jsx
<template>
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
</template>
```

Grammatical tags демонстрация: [сводныйтаблица демонстрация](../../демонстрация-vue/grammatical-tag/сводный-таблица) [сводныйграфик демонстрация](../../демонстрация-vue/grammatical-tag/сводный-график)

#### External компонентs

Currently supported external компонентs:

- меню: выпадающий список меню компонент, consistent с the definition из меню в the option [апи](../../option/списоктаблица#меню)
- Подсказка: Подсказка компонент, consistent с the definition из Подсказка в the option [апи](../../option/списоктаблица#Подсказка)

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

### событие Binding

The outermost таблица компонент из unified tags или grammatical таблица tags inherits the событие handling callbacks из the таблица на its Props.

The definition из событиеsProps is as follows:

```ts
интерфейс событиеsProps {
  onНажатьCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['Нажать_cell']>;
  onDblНажатьCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['dblНажать_cell']>;
  onMouseDownCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mousedown_cell']>;
  onMouseUpCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['mouseup_cell']>;
  onSelectedCell?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['selected_cell']>;
  onSelectedClear?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['selected_clear']>;
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
  onChangeHeaderPositionStart?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['change_header_position_start']>;
  onChangeHeaderPositionFail?: событиеCallback<TYPES.таблицасобытиеHandlersсобытиеArgumentMap['change_header_position_fail']>;
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
  <списоктаблица :options="таблицаOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
```

для detailed событие descriptions, refer к: [событие Introduction](../../guide/событие/событие_список)

### регистрация

в Vтаблица, компонентs such as графикs и editors need к be регистрацияed through the регистрация method к be used normally; в React-Vтаблица, the corresponding регистрация method is exposed и can be used directly.

```jsx
import { регистрацияграфикModule } от '@visactor/vue-vтаблица';
import Vграфик от '@visactor/vграфик';

регистрацияграфикModule('vграфик', Vграфик);

// ......
```

### Keep column ширина

в React-Vтаблица, the update из props will trigger Vтаблица's updateOption (или setRecords). If the column ширина is manually adjusted, it will cause the column ширина к be reset к the initial state. If you need к keep the column ширина, Вы можете configure `keepColumnширинаChange` props к true. It should be noted that в the список, каждый `списокColumn` needs к be configured с `key` as a unique identifier, which is не обязательный в the сводный таблица.

```jsx
<vue-список-таблица
  :options="таблицаOptions"
  :records="records"
  :keep-column-ширина-change="keepColumnширинаChange"
>
  <списокColumn key="0" поле="0" title="имя" />
  <списокColumn key="1" поле="1" title="возраст" />
  <списокColumn key="2" поле="2" title="sex" />
  <списокColumn key="3" поле="3" title="хобби" />
</vue-список-таблица>
```

### пользовательский компонентs

к facilitate Vue developers в quickly implementing пользовательский cell content, Vue-Vтаблица provides the capability к encapsulate компонентs и use them within cells.

```html
<списокColumn
  :поле="'bloggerимя'"
  :title="'anchor nickимя'"
  :ширина="330"
  :style="{ fontFamily: 'Arial', fontWeight: 500 }"
>
  <template #пользовательскиймакет="{ таблица, row, col, rect, record, высота, ширина }">
    <Group :высота="высота" :ширина="ширина" display="flex" flexDirection="row" flexWrap="nowrap">
      <!-- Avatar Group -->
      <Group
        :высота="высота"
        :ширина="60"
        display="flex"
        flexDirection="column"
        alignItems="центр"
        justifyContent="space-around"
      >
        <imвозраст id="иконка0" :ширина="50" :высота="50" :imвозраст="record.bloggerAvatar" :cornerRadius="25" />
      </Group>
      <!-- Blogger информация Group -->
      <Group :высота="высота" :ширина="ширина - 60" display="flex" flexDirection="column" flexWrap="nowrap">
        <!-- Blogger имя и Location -->
        <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="flex-конец">
          <текст ref="textRef" :текст="record.bloggerимя" :fontSize="13" fontFamily="sans-serif" fill="black" />
          <imвозраст
            id="location"
            imвозраст="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg"
            :ширина="15"
            :высота="15"
            :boundsPadding="[0, 0, 0, 10]"
            cursor="pointer"
            @mouseEnter="handleMoueEnter($событие)"
            @Нажать="handleMouseНажать($событие)"
            @mouseLeave="handleMoueLeave($событие)"
          />
          <текст :текст="record.Город" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
        </Group>
        <!-- Tags Group -->
        <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="центр">
          <Tag
            v-для="tag в record?.tags"
            :key="tag"
            :текст="tag"
            :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }"
            :panel="{ видимый: true, fill: '#f4f4f2', cornerRadius: 5 }"
            :space="5"
            :boundsPadding="[0, 0, 0, 5]"
          />
        </Group>
      </Group>
    </Group>
  </template>
</списокColumn>
```

More пользовательский introduction please refer к [Tutorial](../пользовательский_define/vue-пользовательский-компонент)

### кодsanbox демонстрацияs

jump к：https://кодsandbox.io/p/sandbox/viscator-vтаблица-vue-демонстрация-compilation-wgh37n
