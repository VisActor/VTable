# пользовательскийize header dimension tree

в некоторые business scenarios, facing huge amounts из данныеbase данные и complex filtering или сортировкаing rules, Vтаблица's данные analytics capabilities will не be able к meet business requirements. в this time, it can be achieved по пользовательскийizing the row и column header dimension trees'rowTree 'и'columnTree'.

   <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/пользовательский-tree.png" />
    <p>пользовательский rowTree columnTree</p>
  </div>

# пример

пользовательский tree configuration:

```javascript
const option = {
  rowTree: [
    {
      dimensionKey: 'Регион',
      значение: '中南',
      children: [
        {
          dimensionKey: 'province',
          значение: '广东'
        },
        {
          dimensionKey: 'province',
          значение: '广西'
        }
      ]
    },
    {
      dimensionKey: 'Регион',
      значение: '华东',
      children: [
        {
          dimensionKey: 'province',
          значение: '上海'
        },
        {
          dimensionKey: 'province',
          значение: '山东'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: 'year',
      значение: '2016',
      children: [
        {
          dimensionKey: 'quarter',
          значение: '2016-Q1',
          children: [
            {
              indicatorKey: 'Продажи',
              значение: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль',
              значение: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'quarter',
          значение: '2016-Q2',
          children: [
            {
              indicatorKey: 'Продажи',
              значение: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль',
              значение: 'Прибыль'
            }
          ]
        }
      ]
    }
  ],
  indicators: ['Продажи', 'Прибыль'],
  corner: {
    titleOnDimension: 'никто'
  },
  records: [
    {
      Регион: '中南',
      province: '广东',
      year: '2016',
      quarter: '2016-Q1',
      Продажи: 1243,
      Прибыль: 546
    },
    {
      Регион: '中南',
      province: '广东',
      year: '2016',
      quarter: '2016-Q2',
      Продажи: 2243,
      Прибыль: 169
    },
    {
      Регион: '中南',
      province: '广西',
      year: '2016',
      quarter: '2016-Q1',
      Продажи: 3043,
      Прибыль: 1546
    },
    {
      Регион: '中南',
      province: '广西',
      year: '2016',
      quarter: '2016-Q2',
      Продажи: 1463,
      Прибыль: 609
    },
    {
      Регион: '华东',
      province: '上海',
      year: '2016',
      quarter: '2016-Q1',
      Продажи: 4003,
      Прибыль: 1045
    },
    {
      Регион: '华东',
      province: '上海',
      year: '2016',
      quarter: '2016-Q2',
      Продажи: 5243,
      Прибыль: 3169
    },
    {
      Регион: '华东',
      province: '山东',
      year: '2016',
      quarter: '2016-Q1',
      Продажи: 4543,
      Прибыль: 3456
    },
    {
      Регион: '华东',
      province: '山东',
      year: '2016',
      quarter: '2016-Q2',
      Продажи: 6563,
      Прибыль: 3409
    }
  ]
};
```

Vтаблица official website пример: https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица.

The complexity из пользовательский trees lies в the formation из row и column dimension trees, which can be selected according к business scenarios. If you have complex сортировкаing, summarization или paging rules, Вы можете choose к use пользовательский методы.

If rowHierarchyType is set к tree и you expect к load lazily when you Нажать к развернуть the node, you also need к use a сводный таблица с a пользовательский header. для the specific демонстрация, please refer к: [сводный таблица tree lazy load](../../../демонстрация/таблица-тип/сводный-таблица-tree-lazy-load).

If you want к display the сортировка иконка, Вы можете add `showсортировка` к the dimension (rows или columns) или indicator (indicators) configuration к display the Кнопка, и then handle the logic after Нажатьing the сортировка по списокening к the событие `сводный_сортировка_Нажать`.

# Virtual header node

в некоторые scenarios из сводный таблица analysis, the таблица structure и данные к be displayed do не match perfectly. для пример, the сводный таблица may only have row dimensions и indicator values. When there are many полеs для indicator values, you want к group the indicators по пользовательскийizing column headers. в fact, the column headers are virtual, и the данные records are не associated с corresponding dimension полеs, и the число из levels is uncertain.

Based на this scenario, Vтаблица provides the функция из virtual header node, through which the headers на the column can be grouped. [для a specific пример](../../../демонстрация/таблица-тип/сводный-таблица-virtual-header)。

Just add `virtual: true` when configuring the nodes в rowTree columnTree.

like:

```
rowTree: [
  {
    dimensionKey: 'Segment-1',
    значение: 'Segment-1 (virtual-node)',
    virtual: true,
    children: [
      {
      indicatorKey: 'Количество',
      значение: 'Количество'
      },
      {
      indicatorKey: 'Продажи',
      значение: 'Продажи'
      },
      {
      indicatorKey: 'Прибыль',
      значение: 'Прибыль'
      }
    ]
  }
],
```

Specific демонстрация: https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица-virtual-header

# пользовательский Header Cross-column Merge

в the nodes из rowTree или columnTree, configure levelSpan, which is 1 по по умолчанию. This configuration can specify the range из header cell merging. If the maximum число из header levels is 3, there are a total из three dimension levels, и the середина dimension sets levelSpan к 2, then the последний level will be merged as large as the число из levels, и there will be no space. The effect из Следующий пример:

   <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/levelSpan-effect.jpeg" />
    <p>levelSpan</p>
  </div>
  
# пользовательский tree completion indicator node

по по умолчанию, Vтаблица will автоmatically complete the indicator node. для пример, the user can pass в a dimension tree без an indicator node:

```
rowTree: [
  {
    dimensionKey: 'Регион',
    значение: 'North',
  }
],
```

в the same time, the user configures indicator information в indicators:

```
indicators: ['Продажи', 'Прибыль'],
indicatorsAsCol:false,
```

Vтаблица will автоmatically complete the indicator nodes into the row dimension header tree:

```
rowTree: [
  {
    dimensionKey: 'Регион',
    значение: 'North',
    children: [
      {
        indicatorKey: 'Продажи',
        значение: 'Продажи'
      },
      {
        indicatorKey: 'Прибыль',
        значение: 'Прибыль'
      }
    ]
  }
],
```

If you don't need к автоmatically complete indicator nodes, Вы можете turn off автоmatic completion по setting `supplementIndicatorNodes: false`.

# пользовательский tree irregular case

The `parseпользовательскийTreeToMatchRecords` configuration needs к be turned на if you have configured rowTree или columnTree и it is a non-regular tree structure к match the corresponding данные record.

The regular tree structure refers к: the nodes на the same layer have the same dimension keys.

The non-regular tree structure is the tree where nodes на the same layer exist с different dimension values.

# скрыть indicator node

в the nodes из rowTree или columnTree, configure скрыть: true, Вы можете скрыть the indicator node.

It can also be скрытый using the `скрыть` configuration item в `indicators`.
