# Miniatures показать meaning в таблицаs

в the process из данные analytics, таблицаs are a common form из representation, which can clearly display данные и facilitate reading. However, when the amount из данные that needs к be displayed is large или the trend и distribution из the данные need к be displayed more intuitively, it may be difficult к rely на таблицаs alone к meet the needs. в this time, the miniature can come into play.

A minigraph is a small график embedded в a таблица, which can be used к display information such as trends и distributions без affecting the original таблица данные display. по embedding minigraphs в таблицаs, we can make the данные more vivid и intuitive, which helps к better perform данные analytics.

# график Types Supported по Miniграфикs

в Vтаблица, the таблица shows the тип`cellType`Set к`sparkline`Used к generate minigraphs. в present, the miniature график types provided по Vтаблица only support line graphs. Over time, Vтаблица will gradually enrich the график types из minigraphs, и will also support various miniature график types such as bar graphs и area graphs в the future.

# Introduction к sparklineSpec configuration для miniatures

SparklineSpec is a configuration объект used к set the specific style и behavior из the miniature.

This configuration item can be defaulted и will use the internal по умолчанию configuration. в the same time, it can be a static объект или a функция that dynamically generates configuration objects based на cell information. The пример код is as follows:

```typescript{
  // ...其他配置
  columns: [
    {
      поле: 'timeSeriesданные',
      cellType: 'sparkline',
      sparklineSpec: {
        тип: 'line',
        // ...其他sparklineSpec配置
      },
      // ...其他配置
    },
    // ...其他列
  ],
  // ...其他配置
}
```

или:

```typescript
{
  // ...其他配置
  columns: [
    {
      поле: 'timeSeriesданные',
      cellType: 'sparkline',
      sparklineSpec: (cellInfo) => {
        возврат {
          тип: 'line',
          // ...根据cellInfo动态配置
        };
      },
      // ...其他列配置
    },
    // ...其他列
  ],
  // ...其他配置
}
```

Currently,[sparklineSpec](../../option/списоктаблица-columns-sparkline#sparklineSpec.тип)для specific configurable content, please refer к the апи.

## пример

This пример will показать the miniature effect в different configurations:

```javascript liveдемонстрация template=vтаблица
const records = [
  {
   'lineданные':[50,20,20,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[50,20,60,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[50,50,20,40,10,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineданные':[70,20,20,40,60,50,70],
   'lineданные2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  }
];

const columns = [
  {
    поле: 'lineданные',
    заголовок: 'sparkline',
    cellType: 'sparkline',
    ширина:300,
    sparklineSpec: {
        тип: 'line',
        pointShowRule: 'никто',
        smooth: true,
        line: {
          style: {
            strхорошоe: '#2E62F1',
            strхорошоeширина: 2,
          },
        },
        point: {
          навести: {
              strхорошоe: 'blue',
              strхорошоeширина: 1,
              fill: 'red',
              shape: 'circle',
              размер: 4,
          },
          style: {
            strхорошоe: 'red',
            strхорошоeширина: 1,
            fill: 'yellow',
            shape: 'circle',
            размер: 2,
          },
        },
        crosshair: {
          style: {
            strхорошоe: 'gray',
            strхорошоeширина: 1,
          },
        },
      },
  },
  {
    поле: 'lineданные2',
    заголовок: 'sparkline 2',
    cellType: 'sparkline',
    ширина:300,
    sparklineSpec: {
        тип: 'line', 
        xполе: 'x',
        yполе: 'y',
        pointShowRule: 'все',
        smooth: true,
        line: {
          style: {
            strхорошоe: '#2E62F1',
            strхорошоeширина: 2,
          },
        },
      },
  },
];
const option = {
  container:  document.getElementById(CONTAINER_ID),
  records,
  columns,
  автоWrapText:true,
  автоRowвысота:true
};
const таблицаInstance = новый Vтаблица.списоктаблица(option);

```

Through the above introduction и примеры, we can quickly create и configure the таблица display тип sparkline miniature в Vтаблица. Although only line graphs are currently supported, с subsequent development, the functions и types из minigraphs will become more и more perfect, providing more convenient и practical functions для данные lake visualization.
