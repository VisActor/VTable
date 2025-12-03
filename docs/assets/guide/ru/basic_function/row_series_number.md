# таблица row число

The row numbering capability provides users с an easy way к identify и manipulate specific rows в a таблица.

Vтаблица provides the ability к row serial numbers. Users can easily включить, пользовательскийize formats и styles на demand, перетаскивание и отпускание row numbers к change positions, и have the ability к выбрать multiple rows в an entire row.

## Row serial число configuration item

Currently Следующий configurations are supported:

```javascript
export интерфейс IRowSeriesNumber {
  ширина?: число | 'авто';
  // align?: 'лево' | 'право';
  // span?: число | 'dependOnNear';
  title?: строка;
  // поле?: полеDef;
  format?: (col?: число, row?: число, таблица?: Baseтаблицаапи) => любой;
  cellType?: 'текст' | 'link' | 'imвозраст' | 'video' | 'флажок';
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerиконка?: строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[];
  иконка?:
    | строка
    | ColumnиконкаOption
    | (строка | ColumnиконкаOption)[]
    | ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
  // /** Whether к include the serial число part when selecting the entire row или все selections */
  // selectRangeInclude?: логический;
  /** Whether the order can be dragged */
  dragOrder?: логический;
  /** Whether к отключить row serial число ширина adjustment. */
  disableColumnResize?: логический;
}
```

The specific configuration items are described as follows:

- ширина: The line число ширина can be configured с число или 'авто'. (по умолчанию uses defaultColширина, which defaults к 80)
- заголовок: row число title, empty по по умолчанию
- format: row serial число formatting функция, empty по по умолчанию. Through this configuration, numerical serial numbers can be converted into пользовательский serial numbers, such as using a, b, c...
- cellType: row число cell тип, по умолчанию is текст
- style: row число body cell style
- headerStyle: row число header cell style
- headerиконка: row число header cell иконка
- иконка: row число body cell иконка
- dragпорядок: Whether the row serial число order can be dragged, the по умолчанию is false. If set к true, the иконка в the dragging позиция will be displayed, и Вы можете перетаскивание и отпускание на the иконка к change its позиция. If you need к replace the иконка, Вы можете configure it yourself. Please refer к the tutorial: https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка для the chapter на resetting функция иконкаs.
- disableColumnResize: Whether к отключить row serial число ширина adjustment, the по умолчанию is false

Other annotated configuration items will be gradually improved в the future, и anxious comrades can participate в joint construction и development.

**Note:**

- сортировкаed таблицаs do не support dragging row numbers к change the order из данные;
- Tree-structured таблицаs are currently restricted к move between nodes из the same parent level when dragged и dropped в order;How к move between different parent levels, Вы можете see another [tutorial](../interaction/drag_header)。

[демонстрация пример](../../демонстрация/базовый-функциональность/row-series-число)

## Interactive Capabilities Achieved Through Row Numbers

- перетаскивание и отпускание row numbers к change positions: Set `dragOrder` к `true`. If you need к списокen к the перетаскивание-и-отпускание событие, Вы можете списокen к the [`Vтаблица.событие_TYPE.CHANGE_HEADER_POSITION` событие](../../апи/событиеs#CHANGE_HEADER_POSITION).

- выбрать entire rows: Нажать на the row число к выбрать the entire row.
