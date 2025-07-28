{{ target: компонент-легенда-discrete }}

#${prefix}  легендаs.discrete(строка)

Discrete легенда configuration. Please refer к [Configuration](https://visactor.io/vграфик/option/barграфик#легендаs-discrete.тип) и [легенда демонстрация](https://visactor.io/vграфик/пример) в Vграфик

##${prefix}  тип(строка) = 'discrete'

**необязательный**, discrete легенда тип declaration, необязательный because легенда тип defaults к `'discrete'`.

{{ use: компонент-base-легенда(
  prefix = '#' + ${prefix} 
) }}

##${prefix}  defaultSelected(массив)

Sets the легенда item that is selected по по умолчанию when the легенда is initialized. The elements в the массив are the имяs из the легенда items, such as `['легенда 1', 'легенда 2']` means that the легенда items имяd `'легенда 1'` и `'легенда 2'` are selected по по умолчанию.

##${prefix}  выбрать(логический) = true

Whether к включить the selection функция из the легенда, which is включен по по умолчанию.

##${prefix}  selectedMode(строка) = 'multiple'

The selection mode из the легенда, необязательный values: `'multiple'`, `'single'`, respectively represent multiple selection и single selection.

##${prefix}  навести(логический) = true

Whether к включить навести interaction.

##${prefix}  allowAllотменаed(логический) = false

Whether к allow unchecking все легенда items, the по умолчанию is не allowed, only valid when `selectedMode` is `'multiple'`.

##${prefix}  reversed(логический) = false

Whether к reverse the order из легенда items, the по умолчанию is не reversed.

##${prefix}  maxширина(число)

The maximum ширина из the легенда as a whole, which determines whether the легенда из the horizontal макет (orient property is `'лево'` | `'право'`) автоmatically wraps.

##${prefix}  maxRow(число)

It only takes effect when `orient` is `'лево'` | `'право'`, which indicates the maximum число из rows из легенда items, и легенда items exceeding the maximum число из rows will be скрытый.

##${prefix}  maxвысота(число)

The maximum высота из the легенда as a whole, which determines whether the легенда из the vertical макет (orient attribute is `'верх'` | `'низ'`) автоmatically wraps.

##${prefix}  maxCol(число)

It only takes effect when `orient` is `'верх'` | `'низ'`, indicating the maximum число из columns из легенда items, и легенда items exceeding the maximum число из columns will be скрытый.

##${prefix}  item(объект)

легенда item configuration, including graphics, текст и other configurations inside the легенда item.

####видимый(логический) = true

Whether к display the легенда item, it is displayed по по умолчанию.

###${prefix}  spaceCol(число)

Column spacing, horizontal spacing из легенда items.

###${prefix}  spaceRow(число)

Row spacing, vertical spacing из легенда items.

###${prefix}  maxширина(число|строка)

The maximum ширина из the легенда item, defaults к null. Percentвозраст can be used к indicate the proportion из the ширина из the display area.

###${prefix}  ширина(число|строка)

The ширина из the легенда item, calculated автоmatically по по умолчанию. Percentвозраст can be used к indicate the proportion из the ширина из the display area.

####высота(число|строка)

The высота setting из the легенда item, if не set, it will be автоmatically calculated по по умолчанию. Percentвозраст can be used к represent the высота ratio из the display area.

###${prefix}  заполнение(число|число[]|объект)

{{ use: common-заполнение(
  компонентимя='легенда item'
) }}

###${prefix}  фон(объект)

фон configuration для легенда items.

#####видимый(логический) = false

Whether к показать the легенда item фон.

####${prefix}  style(объект)

Style configuration для легенда item фон.

{{ use: graphic-rect(
  prefix = '#####'
) }}

####${prefix}  state(объект)

The style configuration из the легенда item фон в different interaction states. Currently, the interaction states supported по the легенда компонент are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected и навести state
- `'unSelectedHover'`: unselected и навести state

#####${prefix}  selected(объект)

The style configuration из the фон selected state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######unSelected(объект)

Style configuration для the фон unselected state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######selectedHover(объект)

Style configuration для фон selected и навести state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######unSelectedHover(объект)

The style configuration из фон unselected и навести state.

{{ use: graphic-rect(
  prefix = '######'
) }}

###${prefix}  shape(объект)

Configuration из the shape иконка для the легенда item.

#####видимый(логический) = false

Whether к display the shape иконка из the легенда item.

####${prefix}  space(число)

The distance between the shape и Следующий label.

####${prefix}  style(объект)

The shape configuration для the иконка.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(объект)

The style configuration из the легенда item shape в different interaction states. Currently, the interaction states supported по the легенда компонент are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected и навести state
- `'unSelectedHover'`: unselected и навести state

#####${prefix}  selected(объект)

легенда item shape The style configuration из the selected state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######unSelected(объект)

Style configuration для the легенда item shape state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######selectedHover(объект)

The легенда item shape is selected и the style configuration из the навести state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######unSelectedHover(объект)

The легенда item shape is не selected и the style configuration из the навести state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

####label(объект)

текст configuration для легенда entries.

####${prefix}  space(число)

The distance between the легенда item label и Следующий значение.

####${prefix}  formatMethod(функция)

The текст formatting method из the label, which can пользовательскийize the display текст из the label. The parameters из the функция are:

```ts
/**
 * @params текст original текст
 * @params item The drawing данные из the легенда item
 * @params index index из легенда item
 */
(текст: StringOrNumber, item: легендаItemDatum, index: число) => любой;
```

The plot данные types для легенда items are:

```ts
export тип легендаItemDatum = {
  /**
   * The unique identifier из this piece из данные, which can be used для animation или search
   */
  id?: строка;
  /** display текст */
  label: строка;
  /** Display данные */
  значение?: строка | число;
  /** The shape definition before the легенда item */
  shape: {
    symbolType?: строка;
    fill?: строка;
    strхорошоe?: строка;
  };
  [key: строка]: любой;
};
```

####${prefix}  style(объект)

Style configuration для легенда item label.

{{ use: graphic-текст(
  prefix = '#####'
) }}

####${prefix}  state(объект)

The style configuration из the легенда item label в different interaction states. Currently, the interaction states supported по the легенда компонент are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected и навести state
- `'unSelectedHover'`: unselected и навести state

#####${prefix}  selected(объект)

The style configuration из the selected state из the легенда item label.

{{ use: graphic-текст(
  prefix = '######'
) }}

######unSelected(объект)

The style configuration из the unselected state из the легенда item label.

{{ use: graphic-текст(
  prefix = '######'
) }}

######selectedHover(объект)

The style configuration из the легенда item label selected и навести state.

{{ use: graphic-текст(
  prefix = '######'
) }}

######unSelectedHover(объект)

The style configuration из the легенда item label unselected и навести state.

{{ use: graphic-текст(
  prefix = '######'
) }}

###${prefix}  значение(объект)

The значение configuration из the легенда item.

####${prefix}  space(число)

The distance between the легенда item значение и Следующий elements.

####${prefix}  alignRight(логический) = false

Whether к align the значение к the право side из the overall легенда item, **only takes effect when setting the легенда item ширина `itemширина`**.

####${prefix}  formatMethod(функция)

The текст formatting method из значение, Вы можете пользовательскийize the display текст из значение. The parameters из the функция are:

```ts
/**
 * @params текст original текст
 * @params item The drawing данные из the легенда item
 * @params index index из легенда item
 */
(текст: StringOrNumber, item: легендаItemDatum, index: число) => любой;
```

The plot данные types для легенда items are:

```ts
export тип легендаItemDatum = {
  /**
   * The unique identifier из this piece из данные, which can be used для animation или search
   */
  id?: строка;
  /** display текст */
  label: строка;
  /** Display данные */
  значение?: строка | число;
  /** The shape definition before the легенда item */
  shape: {
    symbolType?: строка;
    fill?: строка;
    strхорошоe?: строка;
  };
  [key: строка]: любой;
};
```

####${prefix}  style(объект)

Style configuration для легенда item значение.

{{ use: graphic-текст(
  prefix = '#####'
) }}

####${prefix}  state(объект)

The style configuration из the легенда item значение в different interaction states. Currently, the interaction states supported по the легенда компонент are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected и навести state
- `'unSelectedHover'`: unselected и навести state

#####${prefix}  selected(объект)

The style configuration из the легенда item значение selected state.

{{ use: graphic-текст(
  prefix = '######'
) }}

######unSelected(объект)

легенда item значение Style configuration для unselected state.

{{ use: graphic-текст(
  prefix = '######'
) }}

######selectedHover(объект)

The style configuration из легенда item значение selected и навести state.

{{ use: graphic-текст(
  prefix = '######'
) }}

######unSelectedHover(объект)

The легенда item значение is не selected и the style configuration из the навести state.

{{ use: graphic-текст(
  prefix = '######'
) }}

###${prefix}  focusиконкаStyle(объект)

фокус Кнопка style configuration.

{{ use: graphic-symbol(
  prefix = '####'
) }}

##${prefix}  автоPвозраст(логический) = true

Whether к включить автоmatic pвозраст turning, it is включен по по умолчанию.

###pвозрастr(объект)

Pвозраст turner configuration.

###${prefix}  макет(строка)

The макет из the pвозраст turner, необязательный values are `'horizontal'` и `'vertical'`. The по умолчанию значение logic is:

- When легенда `orient` is `'лево'` или `'право'`, it defaults к `'vertical'`.
- When the легенда `orient` is `'верх'` или `'низ'`, it defaults к `'horizontal'`.

###${prefix}  defaultCurrent(число)

The по умолчанию is the текущий pвозраст число.

###${prefix}  заполнение(число|число[]|объект)

{{ use: common-заполнение(
  компонентимя='Pвозраст Turner'
) }}

###${prefix}  space(число)

The spacing between the pвозраст turner и the легенда.

###${prefix}  animation(логический) = true

Whether к включить animation.

###${prefix}  animationDuration(число) = 450

Animation duration, в ms.

###${prefix}  animationEasing(строка) = 'quadIn'

Animation easing effect.

####textStyle(объект)

текст style configuration.

{{ use: graphic-текст(
  prefix = '####'
) }}

###${prefix}  handler(объект)

Style configuration для pвозраст turner Кнопкаs.

####${prefix}  space(число) = 8

The distance between the Кнопка и the текст content area, the по умолчанию is 8.

####${prefix}  preShape(строка)

Pвозраст turner предыдущий pвозраст Кнопка shape.

####${prefix}  nextShape(строка)

Pвозраст turner следующий pвозраст Кнопка shape.

####${prefix}  style(объект)

Style configuration для pвозраст turner Кнопкаs.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(объект)

The style configuration из the pвозраст turner Кнопка в different interaction states. Currently, the interaction states supported по the pвозраст turner are:

- `'навести'`: навести state
- `'отключить'`: отключен state style

#####${prefix}  навести(объект)

Style configuration для pвозраст turner Кнопка навести state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  отключить(объект)

Style configuration для the недоступный state из the pвозраст turner Кнопка.

{{ use: graphic-symbol(
  prefix = '######'
) }}

##${prefix}  данные(массив)

пользовательский configuration для discrete легенда данные. `данные: легендаItemDatum[]`

```ts
// тип из легенда данные
тип легендаItemDatum = {
  /**
   * The unique identifier из this piece из данные, which can be used для animation или search
   */
  id?: строка;
  /** display текст */
  label: строка;
  /** Display данные */
  значение?: строка | число;
  /** The shape definition before the легенда item */
  shape: {
    symbolType?: строка;
    fill?: строка;
    strхорошоe?: строка;
    strхорошоe?: логический;
  };
  [key: строка]: любой;
};
```

{{ use: common-макет-item(
  prefix = '##',
  defaultмакетType = 'normal',
  defaultмакетLevel = 50,
  defaultмакетZIndex = 500,
  noOrient = true
) }}
