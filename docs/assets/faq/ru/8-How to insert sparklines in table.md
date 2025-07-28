# Vтаблица Usвозраст Issue: How к insert sparklines в таблица?

## Question Description

A mini-line график reflecting the dynamics из a set из данные needs к be displayed в a cell в a column из the таблица. How к achieve this effect в Vтаблица?

## Solution

в Vтаблица, Вы можете specify the column к be a sparkline тип cell по setting `cellType` к `sparkline` в `columns`.

1. sparkLine данные
   The данные specified по the `sparkline` тип cell can be an массив из numbers (the число will по умолчанию к y поле в the sparkline, и x поле will be автоmatically filled в order), или it can be an массив из x, y objects:

```javascript
// ......
{
  lineданные1: [10, 20, 30, 40, 60, 30, 10],
  lineданные2: [
    { x: 0, y: 10 },
    { x: 1, y: 40 },
    { x: 2, y: 60 },
    { x: 3, y: 30 },
    { x: 4, y: 20 },
    { x: 5, y: 20 },
    { x: 6, y: 60 },
    { x: 7, y: 50 },
    { x: 8, y: 70 }
  ]
}
```

2. sparkline style
   в `columns`, в addition к configuring the `cellType` as `sparkline`, Вы можете also configure the sparkline style spec through `sparklineSpec` (if не configured using по умолчанию style), и the spec rules refer к Vграфик:

```javascript
const baseSpec: TYPES.SparklineSpec = {
  тип: 'line',
  xполе: {
    поле: 'x',
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  yполе: {
    поле: 'y',
    domain: [0, 80]
  },
  smooth: true,
  pointShowRule: 'все',
  line: {
    style: {
      strхорошоe: '#2E62F1',
      strхорошоeширина: 2
    }
  },
  point: {
    навести: {
      strхорошоe: 'blue',
      strхорошоeширина: 1,
      fill: 'red',
      shape: 'circle',
      размер: 4
    },
    style: {
      strхорошоe: 'red',
      strхорошоeширина: 1,
      fill: 'yellow',
      shape: 'circle',
      размер: 2
    }
  },
  crosshair: {
    style: {
      strхорошоe: 'gray',
      strхорошоeширина: 1
    }
  }
};

// опция: ......
columns: [
  {
    поле: 'lineданные2',
    заголовок: 'spark line2',
    cellType: 'sparkline',
    ширина: 250,
    sparklineSpec: baseSpec
  }
];
```

- тип: the тип из sparkline, currently only supports line
- xполе: x-axis dimension information, configure the данные поле для x-axis mapping, x-axis данные range, etc.
- yполе: y-axis dimension information, configure the данные поле для y-axis mapping, y-axis данные range, etc.
- smooth: whether the polyline is displayed smoothly
- pointShowRule: The display rule из the vertex, which supports Следующий configurations:
  - все: показать все points
  - никто: do не display points
  - isolatedPoint: Indicates that only isolated points are displayed (the front и rear values are empty)
- line: polyline style
- point: style из vertex
- crosshair: interactively displayed crosshair style

## код пример

```javascript
const baseSpec: TYPES.SparklineSpec = {
  тип: 'line',
  xполе: {
    поле: 'x',
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  yполе: {
    поле: 'y',
    domain: [0, 80]
  },
  smooth: true,
  pointShowRule: 'все',
  line: {
    style: {
      strхорошоe: '#2E62F1',
      strхорошоeширина: 2
    }
  },
  point: {
    навести: {
      strхорошоe: 'blue',
      strхорошоeширина: 1,
      fill: 'red',
      shape: 'circle',
      размер: 4
    },
    style: {
      strхорошоe: 'red',
      strхорошоeширина: 1,
      fill: 'yellow',
      shape: 'circle',
      размер: 2
    }
  },
  crosshair: {
    style: {
      strхорошоe: 'gray',
      strхорошоeширина: 1
    }
  }
};

const records = generateRecords(10);

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80
  },
  {
    поле: 'lineданные1',
    заголовок: 'spark line1',
    cellType: 'sparkline',
    ширина: 250
  },
  {
    поле: 'lineданные2',
    заголовок: 'spark line2',
    cellType: 'sparkline',
    ширина: 250,
    sparklineSpec: baseSpec
  }
];
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns
};
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-miniline-w536q9)

![result](/vтаблица/Часто Задаваемые Вопросы/8-0.png)

## Quote

- [Cell тип демонстрация](https://www.visactor.io/vтаблица/демонстрация/cell-тип/multi-тип)
- [Sparkline Tutorial](https://visactor.io/vтаблица/guide/cell_type/sparkline)
- [github](https://github.com/VisActor/Vтаблица)
