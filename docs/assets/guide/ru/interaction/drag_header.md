# перетаскивание the head к transpose

в complex данные таблицаs, the order из columns may affect our analysis и understanding из the данные. Sometimes we need к compare columns, и these columns may be far apart в the original таблица. The перетаскивание-и-отпускание header transposition функция allows us к quickly adjust the order из columns и improve the efficiency из данные analytics.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20e.gif)

## Turn на transposition функция

по по умолчанию, Vтаблица's перетаскивание-и-отпускание header transposition feature is turned off. к включить this feature, you need к `dragHeaderMode` Set к `'все'`,`'column'` или `'row'`Where:

- `'все'` Indicates that все headers can be transposed
- `'никто'` Indicates non-commutative
- `'column'` Indicates that only the список header can be transposed
- `'row'` Indicates that only row headers are transposed

```javascript
const таблица = новый Vтаблица.списоктаблица({
  dragпорядок: {
    dragHeaderMode: 'все'
  }
});
```

Configured `dragHeaderMode` After that, Вы можете перетаскивание и отпускание the header к transpose.

## Transposition marker line style configuration

We can style the transposition markers к better render the appearance из the таблица. по setting `тема.dragHeaderSplitLine`, this функция can be realized, и the specific configuration items are:

- `'lineColor'` перетаскивание и отпускание the цвет из the marker line
- `'lineширина'` перетаскивание и отпускание the line ширина из the marker line
- `'shadowBlockColor'` цвет из Shadow Регион when dragging

Here is an пример configuration:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  тема: {
    dragHeaderSplitLine: {
      lineColor: 'red',
      lineширина: 2,
      shadowBlockColor: 'rgba(255,0,0,0.3)'
    }
  }
});
```

в this пример, we set the цвет из the marker line для dragging и dragging the header к transpose к red, с a граница line ширина из 2 и a red shadow с a transparency из 0.3.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090c.png)

## Prohibit the transposition из a column

Sometimes, we don't want certain columns к participate в перетаскивание-и-отпускание transposition. для this requirement, Vтаблица provides a column-specific configuration item columns.dragHeader. по configuring a column `columns.dragHeader: false`, Вы можете prohibit the column от dragging и transposing.

    const таблица = новый Vтаблица.списоктаблица({
      columns: [
        { заголовок: '日期', cellType: 'текст', dragHeader: true },
        { заголовок: '销量', cellType: 'текст', dragHeader: false },
        { заголовок: '销售额', cellType: 'текст', dragHeader: true }
      ]
    });

As с the above код, the "Продажи" column cannot be dragged и transposed.

## Restrict dragging из frozen columns

перетаскивание и отпускание the таблица header к move the позиция. выбрать different effects according к the business scenario для the rules из the frozen part. для пример, Вы можете prohibit dragging из frozen columns, или adjust the число из frozen columns.

Constraints can be made through Следующий configuration (only valid для списоктаблица):

```
dragпорядок: {
  // перетаскивание the таблица header к move the позиция. Rules для frozen parts. The по умолчанию is fixedFrozenCount.
  frozenColDragHeaderMode?: 'отключен' | 'adjustFrozenCount' | 'fixedFrozenCount';
}
```

The different rules are described below:

- "отключен" (disables adjusting the позиция из frozen columns): The headers из other columns are не allowed к be moved into the frozen column, nor are the frozen columns allowed к be moved out. The frozen column remains unchanged.
- "adjustFrozenCount" (adjust the число из frozen columns based на the interaction results): allows the headers из other columns к move into the frozen column, и the frozen column к move out, и adjusts the число из frozen columns based на the dragging action. When the headers из other columns are dragged into the frozen column позиция, the число из frozen columns increases; when the headers из other columns are dragged out из the frozen column позиция, the число из frozen columns decreases.
- "fixedFrozenCount" (can adjust frozen columns и keep the число из frozen columns unchanged): Allows you к freely перетаскивание the headers из other columns into или out из the frozen column позиция while keeping the число из frozen columns unchanged.

So far, we have introduced the перетаскивание-и-отпускание header transposition функция из Vтаблица, including the activation из the перетаскивание-и-отпускание header transposition функция, the style configuration из the перетаскивание-и-отпускание header transposition mark line, и whether a certain column can be dragged. по mastering these functions, Вы можете more easily perform данные analytics и processing в Vтаблица.


## Validation When Moving позиция Ends

Our internal по умолчанию validation rule is: if dragging under a header hierarchy structure, it is не allowed к move positions across parent levels, only allowing moving positions within the same parent level. If it is a базовый таблица using the row число `rowSeriesNumber` к перетаскивание и reorder данные, no validation will be performed. When the по умолчанию validation rule is не satisfied, Vтаблица will display a mouse style prohibiting dragging during the mouse movement process.

However, некоторые business requirements state that validation should be performed в the конец из dragging к check if the conditions для dragging к reorder are met. If не met, the business layer will prompt или perform other operations. This requirement can be implemented through the hoхорошо функция `validateDragOrderOnEnd` для validation. If it returns `true`, the move is successful; if it returns `false`, the move fails.

```javascript
dragпорядок: {
  validateDragOrderOnEnd(source, target) {
    возврат true;
  }
}
```

## Adjusting данные Order для списоктаблица

**списоктаблица данные Reordering Explanation:**

в the application scenario из the базовый таблица списоктаблица, we may need к adjust the order из the данные. Vтаблица provides the `rowSeriesNumber` row число configuration, и в `IRowSeriesNumber`, there is a `dragOrder` property. When set к `true`, it will display the перетаскивание иконка в the row число cell, allowing you к adjust the order из the данные through dragging. для specific details, please refer к the [tutorial](../базовый_function/row_series_number).

### Dragging и Reordering в Tree Structures

If it is a tree structure display, we internally limit it к only allow dragging и reordering within the same parent node. If you want a more flexible adjustment method, Вы можете pass в the `данныеSource` объект и pass в the two методы `canChangeOrder` и `changeOrder` на the объект.

Here is an пример, по copying the `данныеSource`, Вы можете implement dragging order без strictly constraining movement between the same parent level, but instead allowing movement across parent levels, but only к positions с the same level:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
const данныеSource = новый Vтаблица.данные.CachedданныеSource({
  records: [
    {
      категория: 'Office Supplies',
      Продажи: '129.696',
      Количество: '2',
      Прибыль: '60.704',
      children: [
        {
          категория: 'Envelope', // Corresponding atomic Категория
          Продажи: '125.44',
          Количество: '2',
          Прибыль: '42.56',
          children: [
            {
              категория: 'Yellow Envelope',
              Продажи: '125.44',
              Количество: '2',
              Прибыль: '42.56'
            },
            {
              категория: 'White Envelope',
              Продажи: '1375.92',
              Количество: '3',
              Прибыль: '550.2'
            }
          ]
        },
        {
          категория: 'Tools', // Corresponding atomic Категория
          Продажи: '1375.92',
          Количество: '3',
          Прибыль: '550.2',
          children: [
            {
              категория: 'Stapler',
              Продажи: '125.44',
              Количество: '2',
              Прибыль: '42.56'
            },
            {
              категория: 'Calculator',
              Продажи: '1375.92',
              Количество: '3',
              Прибыль: '550.2'
            }
          ]
        }
      ]
    },
    {
      категория: 'Technology',
      Продажи: '229.696',
      Количество: '20',
      Прибыль: '90.704',
      children: [
        {
          категория: 'Equipment', // Corresponding atomic Категория
          Продажи: '225.44',
          Количество: '5',
          Прибыль: '462.56'
        },
        {
          категория: 'Accessories', // Corresponding atomic Категория
          Продажи: '375.92',
          Количество: '8',
          Прибыль: '550.2'
        },
        {
          категория: 'Photocopier', // Corresponding atomic Категория
          Продажи: '425.44',
          Количество: '7',
          Прибыль: '34.56'
        },
        {
          категория: 'Phone', // Corresponding atomic Категория
          Продажи: '175.92',
          Количество: '6',
          Прибыль: '750.2'
        }
      ]
    },
    {
      категория: 'Furniture',
      Продажи: '129.696',
      Количество: '2',
      Прибыль: '-60.704',
      children: [
        {
          категория: 'таблица', // Corresponding atomic Категория
          Продажи: '125.44',
          Количество: '2',
          Прибыль: '42.56',
          children: [
            {
              категория: 'Yellow таблица',
              Продажи: '125.44',
              Количество: '2',
              Прибыль: '42.56'
            },
            {
              категория: 'White таблица',
              Продажи: '1375.92',
              Количество: '3',
              Прибыль: '550.2'
            }
          ]
        },
        {
          категория: 'Chair', // Corresponding atomic Категория
          Продажи: '1375.92',
          Количество: '3',
          Прибыль: '550.2',
          children: [
            {
              категория: 'Executive Chair',
              Продажи: '125.44',
              Количество: '2',
              Прибыль: '42.56'
            },
            {
              категория: 'Sofa Chair',
              Продажи: '1375.92',
              Количество: '3',
              Прибыль: '550.2'
            }
          ]
        }
      ]
    }
  ],
  canChangeOrder(sourceIndex, targetIndex) {
    let sourceIndexs = таблицаInstance.getRecordIndexByCell(0, sourceIndex + таблицаInstance.columnHeaderLevelCount);
    if (typeof sourceIndexs === 'число') {
      sourceIndexs = [sourceIndexs];
    }
    let targetIndexs = таблицаInstance.getRecordIndexByCell(0, targetIndex + таблицаInstance.columnHeaderLevelCount);
    if (typeof targetIndexs === 'число') {
      targetIndexs = [targetIndexs];
    }
    if (sourceIndexs.length === targetIndexs.length) {
      возврат true;
    } else if (targetIndexs.length + 1 === sourceIndexs.length) {
      возврат true;
    }
    возврат false;
  },
  changeOrder(sourceIndex, targetIndex) {
    const record = таблицаInstance.getRecordByCell(0, sourceIndex + таблицаInstance.columnHeaderLevelCount);
    let sourceIndexs = таблицаInstance.getRecordIndexByCell(0, sourceIndex + таблицаInstance.columnHeaderLevelCount);
    if (typeof sourceIndexs === 'число') {
      sourceIndexs = [sourceIndexs];
    }
    let targetIndexs = таблицаInstance.getRecordIndexByCell(0, targetIndex + таблицаInstance.columnHeaderLevelCount);
    if (typeof targetIndexs === 'число') {
      targetIndexs = [targetIndexs];
    }
    if (sourceIndexs.length === targetIndexs.length) {
      таблицаInstance.deleteRecords([sourceIndexs]);
      таблицаInstance.addRecord(record, targetIndexs);
    } else if (targetIndexs.length + 1 === sourceIndexs.length) {
      таблицаInstance.deleteRecords([sourceIndexs]);
      targetIndexs.push(0);
      таблицаInstance.addRecord(record, targetIndexs);
    }
  }
});
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      поле: 'Категория',
      tree: true,
      заголовок: 'Категория',
      ширина: 'авто',
      сортировка: true
    },
    {
      поле: 'Продажи',
      заголовок: 'Продажи',
      ширина: 'авто',
      сортировка: true
    },
    {
      поле: 'Прибыль',
      заголовок: 'Прибыль',
      ширина: 'авто',
      сортировка: true
    }
  ],
  showPin: true, // Display Vтаблица's built-в frozen column иконка
  ширинаMode: 'standard',
  allowFrozenColCount: 2,
  данныеSource,
  rowSeriesNumber: {
    dragпорядок: true
  },
  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  сортировкаState: {
    поле: 'Продажи',
    порядок: 'asc'
  },
  тема: Vтаблица.темаs.BRIGHT,
  defaultRowвысота: 32
};

таблицаInstance = новый Vтаблица.списоктаблица(option);
window['таблицаInstance'] = таблицаInstance;
```
