# сводный таблица сортировкаing функция

The сортировкаing capability из a сводный таблица can be implemented в Следующий ways:

1. сводный таблица пользовательскийizes the tree structure из the таблица header. RowTree и columnTree can be passed в и displayed according к this structure. в this time, even if сортировкаRule is configured, it will не work. This method is used when the таблица header has a по умолчанию order или a special structure, или the сортировкаing rules are complex. Вы можете refer к the tutorial: [пользовательский header dimension tree](../../таблица_type/сводный_таблица/пользовательский_header).
2. Add `сортировка:true` в the dimension или indicator configuration к включить сортировкаing. The сортировка Кнопка will be displayed и Нажатьing the Кнопка will trigger сортировкаing. сортировкаing through the интерфейс: Call the интерфейс `updateсортировкаRules` к сортировка.
3. Other special requirements: only display the сортировкаing status, do не use the Vтаблица сортировкаing logic

**Note that the three сортировкаing методы should не be mixed**

следующий, we will mainly introduce Следующий implementation методы и precautions.

## Configure сортировка к включить сортировкаing

### сортировка по dimension значение

The сортировка configuration can be set в rows или columns, в which point the corner cells displaying the dimension имяs will display сортировка Кнопкаs, и Нажатьing the Кнопкаs will trigger сортировкаing. The specific сортировкаing rules triggered will correspond к the configurations в данныеConfig.сортировкаRule. If there is no matching сортировкаing rule в сортировкаRule, it will сортировка according к the по умолчанию rule, which is alphabetical order.

Следующий is an пример из configuring сортировка в rows к включить сортировкаing:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          сортировка: true
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          сортировка: true
        }
      ],
      columns: ['Регион', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи'
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль'
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColширина: 130
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

в the above код, `сортировка` is `true`, which means that the dimension values corresponding к the row headers can be сортировкаed, и the cells в the corner headers will display the сортировка иконка.

### сортировка по indicator значение

The configuration из сортировка can be set в indicators, в which point the row header или column header cells displaying the indicator имяs will display сортировка Кнопкаs, и Нажатьing the Кнопкаs will trigger сортировкаing. The specific сортировкаing rules are сортировкаed по the размер из the indicator.

Here is an пример из configuring сортировка в indicators к включить сортировкаing:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: ['Категория', 'Sub-Категория'],
      columns: ['Регион', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          сортировка: true
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          сортировка: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColширина: 130
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

в the above код, `сортировка` is `true`, which means that сортировкаing is supported по indicator значение, и the cells в the row header или column header will display the сортировка иконка.

### Initialize сортировкаing status

Please configure the данные analysis данныеConfig.сортировкаRule к set the initial сортировкаing state. If сортировка is configured на the corresponding indicator или dimension, the corresponding сортировкаing иконка state will appear.

Следующий пример:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: ['Категория', 'Sub-Категория'],
      columns: ['Регион', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          сортировка: true
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          сортировка: true
        }
      ],
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Sub-Категория',
            сортировкаByIndicator: 'Продажи',
            сортировкаType: Vтаблица.TYPES.сортировкаType.DESC,
            query: ['Central', 'Corporate']
          }
        ]
      },
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColширина: 130
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

This пример configures the initial сортировкаing rule, which сортировкаs the indicator values в descending order according к the column header dimension path из `['Central', 'Corporate', 'Продажи']`. в the same time, the сортировкаing иконка в the corresponding header cell changes к the descending state иконка.

### Update сортировкаing through the интерфейс

The update сортировкаing интерфейс из the сводный таблица is `updateсортировкаRules`, which can be called к update the сортировкаing status.If сортировка is configured на the corresponding indicator или dimension, the corresponding сортировкаing иконка state will appear.

Here is an пример из updating the order through the интерфейс:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: ['Категория', 'Sub-Категория'],
      columns: ['Регион', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          сортировка: true
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          сортировка: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColширина: 130
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
    таблицаInstance.updateсортировкаRules([
      {
        сортировкаполе: 'Sub-Категория',
        сортировкаByIndicator: 'Продажи',
        сортировкаType: Vтаблица.TYPES.сортировкаType.DESC,
        query: ['Central', 'Corporate']
      }
    ]);
  });
```

### списокen для сортировка иконка Нажать событиеs

The сортировка иконка Нажать событие is monitored as `сводный_сортировка_Нажать`.

## сортировкаing по интерфейс

If you need к сортировка through the интерфейс, Вы можете update the сортировкаing status по calling the `updateсортировкаRules` интерфейс.

## показать only сортировка иконкаs

If there is a special setting panel в the business scenario, и there are special сортировкаing options для users к operate, but the corresponding сортировкаing status needs к be displayed в the таблица, Вы можете configure `showсортировка: true` или `showсортировкаInCorner: true` к display the сортировкаing status. If there is a need к monitor иконка Нажатьs, Вы можете monitor the событие `сводный_сортировка_Нажать`.

в the same time, Вы можете set сводныйсортировкаState на option к set the state из the initial сортировка иконка.

Let’s loхорошо в the usвозраст пример:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          showсортировка: true
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          showсортировка: true
        }
      ],
      columns: ['Регион', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          showсортировка: true
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          showсортировка: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      сводныйсортировкаState: [
        {
          dimensions: [
            {
              dimensionKey: 'Категория',
              значение: 'Furniture',
              isсводныйCorner: false,
              indicatorKey: undefined
            }
          ],
          порядок: 'desc'
        },
        {
          dimensions: [
            {
              dimensionKey: 'Регион',
              значение: 'Central',
              isсводныйCorner: false,
              indicatorKey: undefined
            },
            {
              dimensionKey: 'Segment',
              значение: 'Consumer',
              isсводныйCorner: false,
              indicatorKey: undefined
            },
            {
              indicatorKey: 'Продажи',
              значение: 'Продажи',
              isсводныйCorner: false
            }
          ],
          порядок: 'asc'
        }
      ],
      defaultColширина: 130
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
    таблицаInstance.на('сводный_сортировка_Нажать', e => {
      console.log(e);
      // 执行业务逻辑 ...
      // 如果执行业务逻辑后还需要更新排序状态，可以先调用updateOption来更新配置，目前还未提供专门更新的接口
    });
  });
```

в the above пример, сводныйсортировкаState is configured с two сортировкаing rules. It will display descending иконкаs на cells с dimension path ['Furniture'] в the row header, и ascending иконкаs на cells с dimension path ['Central', 'Consumer', 'Продажи'] в the column header.

## other

Here's another emphasis: **the three сортировкаing методы mentioned в the beginning из the tutorial should не be mixed**, для пример: the сортировкаRule method should не be used в cases where a пользовательский таблица header tree structure is defined или showсортировка is configured; similarly, the сводныйсортировкаState configuration should не be used when сортировка is configured.