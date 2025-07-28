# Introduction к Perspective Combination графикs

Perspective combination график is a данные lake visualization technology, which arranges и combines графикs из the same тип according к certain rules к form a large график, и каждый small график presents a part из the данные. Perspective combination графикs are often used к group и display large amounts из данные в order к better observe и compare the relationship between different данные.
The advantвозраст из the perspective combination график is that it can present multiple данные Dimensions в the same time, so that users can understand the relationship between the данные more comprehensively. в addition, the perspective combination график can also make it easier для users к compare the differences between different данные по adjusting the arrangement и размер из the subграфикs.

# Application Scenario

There are many application scenarios для perspective composite graphs в данные lake visualization. Here are некоторые примеры из them:

1.  Visualization из big данные collections: Perspective combination diagrams can be used к visualize big данные collections. по arranging и combining данные according к certain rules, данные groups are displayed, so that users can better understand the relationship between данные.
2.  Visualization из multidimensional данные: Perspective combination графикs can be used к visualize multidimensional данные. по grouping данные according к different attributes и presenting каждый grouped данные в a certain form, users can observe данные в multiple Dimensions в the same time.
3.  Comparison и analysis из данные: Perspective combination графикs can be used к compare и analyze данные. по grouping данные according к different attributes, и presenting the данные из каждый grouping в a certain form, users can more easily compare и analyze the differences и relationships between different данные.
4.  данные Exploration и Discovery: Perspective composite diagrams can be used к explore и discover patterns и trends в данные. по grouping данные according к different attributes и presenting каждый grouped данные в a certain form, users can gain a more comprehensive understanding из the relationship between данные, thereby discovering patterns и trends в данные.
5.  данные reporting и presentation: Perspective composite diagrams can be used к present данные reports. данные reports can be made easier к understand и present по grouping данные according к different attributes и presenting каждый grouped данные в a certain form.

# The structure из the perspective combination график

The structure can be compared к [**сводный таблица**](../таблица_type/сводный_таблица/сводный_таблица_overview). Compared с the сводный таблица, в addition к the column header, row header, corner header, и body, the perspective combination график can also be configured с [**axis компонентs**](../компонентs/axes) в the four directions. Corresponds к the upper axis, следующий week, лево axis, и право axis, и can also be configured separately [**легенда компонент**](../компонентs/легенда).
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170f.png)

The specific relevant configurations are as follows:

    {
        rows: [
           {
              dimensionKey: 'Order Year',
              заголовок: 'Order Year',
              headerStyle: {
                textBaseline:'верх',
                textStick: true
              }
            },
            'Ship Mode'
        ],
        columns: [
            {
              dimensionKey: 'Регион',
              заголовок: '',
              headerStyle: {
                textStick: true
              }
            },
            'Категория'
        ],
        indicators: [
          {
            indicatorKey: 'Количество',
            заголовок: 'Количество',
            cellType:'график',
            графикModule:'vграфик',
            графикSpec:{} //对应vграфик的spec，具体可参考vграфик官网
          },
          {
            indicatorKey: 'Продажи',
            заголовок: 'Продажи & Прибыль',
            cellType:'график',
            графикModule:'vграфик',
            графикSpec:{} //对应vграфик的spec，具体可参考vграфик官网
          }
        ],
        axes: [
          {
            orient: 'низ'
          },
          {
            orient: 'лево',
            заголовок: {
              видимый: true
            }
          },
          {
            orient: 'право',
            видимый: true,
            grid: {
              видимый: false
            }
          }
        ],
        легендаs: {
          данные: [
            {
              label: '公司-数量',
              shape: {
                fill: '#2E62F1',
                symbolType: 'circle'
              }
            },
            {
              label: '小型企业-数量',
              shape: {
                fill: '#4DC36A',
                symbolType: 'square'
              }
            },
            ...
          ],
          orient: 'низ',
          позиция: 'начало',
          maxRow: 1,
          заполнение: [50, 0, 0, 0]
        },
        records:[
          {
            "Segment-Indicator": "Consumer-Количество",
            "Регион": "Central",
            "Категория": "Furniture",
            "Количество": "16",
            "Sub-Категория": "Chairs",
            "Order Year": "2015",
            "Segment": "Consumer",
            "Ship Mode": "первый Class"
          },
          {
            "Segment-Indicator": "Consumer-Количество",
            "Регион": "Central",
            "Категория": "Furniture",
            "Количество": "4",
            "Sub-Категория": "таблицаs",
            "Order Year": "2015",
            "Segment": "Consumer",
            "Ship Mode": "первый Class"
          },
          {
            "Segment-Indicator": "Corporate-Количество",
            "Регион": "Central",
            "Категория": "Furniture",
            "Количество": "2",
            "Sub-Категория": "Boхорошоcases",
            "Order Year": "2015",
            "Segment": "Corporate",
            "Ship Mode": "первый Class"
          },
          ...
       ]
    }

Corresponding к the schematic structure из the perspective combination diagram above:

- rows configures the Dimension'Order Year 'и'Ship Mode' corresponding к the row header;
- columns configures the Dimension'Регион 'и'Категория' corresponding к the список header;

- indicators configures the indicator данные к be analyzed: `Количество`, `Продажи`, `Прибыль`;
  - `Количество` corresponds к indicator 1 в the figure above, using a bar график к показать the trend;
  - `Продажи` и `Прибыль` correspond к indicators 2 и 3 в the above figure, и the данные из the two indicators are displayed using a combined dual-axis график.
  - You need к set `cellType:'график', графикModule:'vграфик'` в the specific configuration из `indicator` к indicate that you want к configure the график rendering тип и specify that the регистрацияed график library имя is `vграфик`.
  - для specific графикSpec configuration, please refer к [Vграфик official website](https://visactor.io/vграфик/option/barграфик)
- indicatorAsCol configures the indicator в the row или column header. Note that:

  - If true, that is, the indicator is в the column header, the corresponding график display direction is horizontal;
  - If it is false, that is, the indicator is в the head из the row, the display direction из the corresponding график is vertical;

- легендаs configuration легенда style;
  ![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff07.png)
- axes configures the global style из the axis. If axes have been configured в графикSpec в the Metirc configuration, the configuration в графикSpec will be used первый.

# график Module регистрация

The график library компонент needs к be injected before use:

```
import Vграфик от '@visactor/vграфик';
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
```

# график событиеs

If you want к monitor график событиеs, Вы можете use onVграфиксобытие. vтаблица has made a simple событие proxy. The supported событие types и callbacks are still consistent с vграфик. для details, please refer к [Vграфик событие](https://visactor.io/ vграфик/апи/апи/событие)

```
     таблицаInstance.onVграфиксобытие('Нажать', args => {
        console.log('onVграфиксобытие Нажать', args);
      });
      таблицаInstance.onVграфиксобытие('mouseover', args => {
        console.log('onVграфиксобытие mouseover', args);
      });
```

# легенда configuration и легенда linkвозраст

How к achieve the linkвозраст effect between таблица легенда и график?

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/легенда-график.gif)

## легенда configuration

Вы можете refer к the таблица [легенда Tutorial] (../компонентs/легенда) к configure the легенда displayed outside the таблица.
The configuration в the above picture is as follows:

```
     легендаs: {
      orient: 'низ',
      тип: 'discrete',
      данные: [
        {
          label: 'Consumer-Количество',
          shape: {
            fill: '#2E62F1',
            symbolType: 'circle'
          }
        },
        {
          label: 'Consumer-Количество',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Количество',
          shape: {
            fill: '#FF8406',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Продажи',
          shape: {
            fill: '#FFCC00',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Продажи',
          shape: {
            fill: '#4F44CF',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Продажи',
          shape: {
            fill: '#5AC8FA',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Прибыль',
          shape: {
            fill: '#003A8C',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Прибыль',
          shape: {
            fill: '#B08AE2',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Прибыль',
          shape: {
            fill: '#FF6341',
            symbolType: 'square'
          }
        }
      ]
    }
```

This configuration configures the цвет и shape из каждый item из the легенда, as well as the label значение.

Because the цвет values need к be explicitly set в this configuration, the цвет mapping rules also need к be specified в the spec из the configuration график. Please refer к [цвет configuration method](https://visactor.io/vграфик/option/barграфик#цвет).

в the пример above, we added Следующий configuration к the графикSpec к ensure that the colors в the график и the легенда are consistent:

```
scales: [
              {
                id: 'цвет',
                тип: 'ordinal',
                domain: [
                  'Consumer-Количество',
                  'Corporate-Количество',
                  'Home Office-Количество',
                  'Consumer-Продажи',
                  'Corporate-Продажи',
                  'Home Office-Продажи',
                  'Consumer-Прибыль',
                  'Corporate-Прибыль',
                  'Home Office-Прибыль'
                ],
                range: [
                  '#2E62F1',
                  '#4DC36A',
                  '#FF8406',
                  '#FFCC00',
                  '#4F44CF',
                  '#5AC8FA',
                  '#003A8C',
                  '#B08AE2',
                  '#FF6341',
                  '#98DD62',
                  '#07A199',
                  '#87DBDD'
                ]
              }
            ]
```

## легенда linkвозраст

Use the событие `легенда_ITEM_Нажать` к monitor легенда item Нажатьs, и call the Vтаблица интерфейс `updateFilterRules` к process the данные display filtered график.

```
      const { легенда_ITEM_Нажать } = Vтаблица.списоктаблица.событие_TYPE;
      таблицаInstance.на(легенда_ITEM_Нажать, args => {
        console.log('легенда_ITEM_Нажать', args);
        таблицаInstance.updateFilterRules([
          {
            filterKey: 'Segment-Indicator',
            filteredValues: args.значение
          }
        ]);
      });
```
