# Начало Работы

в this tutorial, we will introduce how к use @visactor/vтаблица-гантт к draw a simple гантт график.

## Getting @visactor/vтаблица-гантт

**Please note that @visactor/vтаблица-гантт is built на @visactor/vтаблица, so you need к install @visactor/vтаблица первый к use @visactor/vтаблица-гантт.**

Вы можете get it в Следующий ways:

### Using NPM Packвозраст

первый, you need к install it в the root directory из your project using Следующий commands:

```sh

# Install using npm
npm install @visactor/vтаблица
npm install @visactor/vтаблица-гантт

# Install using yarn
yarn add @visactor/vтаблица
yarn add @visactor/vтаблица-гантт
```

### Using CDN

Вы можете also get the built vтаблица-гантт file through CDN.

```html
<script src="https://unpkg.com/@visactor/vтаблица-гантт/dist/vтаблица-гантт.min.js"></script>
<script>
  const ганттInstance = новый Vтаблицагантт.гантт(domContainer, option);
</script>
```

If you need к use the related functions из Vтаблица или VRender, such as editing cells или пользовательский rendering, please note that you should use Vтаблицагантт.Vтаблица и Vтаблицагантт.VRender.

к introduce the ability из Vтаблица, such as:

```
// регистрация иконка или editor
Vтаблицагантт.Vтаблица.регистрация.***
// Reference the тема из Vтаблица
Vтаблицагантт.Vтаблица.темаs.***
// Reference the пользовательский rendering element из Vтаблица
Vтаблицагантт.Vтаблица.пользовательскиймакет.***
```

к introduce the ability из VRender к achieve пользовательский rendering, such as:

```
// Use the Group element
Vтаблицагантт.VRender.Group()
```

## Importing Vтаблицагантт

### Importing via NPM Packвозраст

в the верх из your JavaScript file, use `import` к bring в vтаблица-гантт:

```js
import { гантт } от '@visactor/vтаблица-гантт';

const ганттInstance = новый гантт(domContainer, option);
```

### Importing via script tag

по directly adding a `<script>` tag в the HTML file, import the built vтаблица-гантт file:

```html
<script src="https://unpkg.com/@visactor/vтаблица-гантт/dist/vтаблица-гантт.min.js"></script>
<script>
  const ганттInstance = новый Vтаблицагантт.гантт(domContainer, option);
</script>
```

## Drawing a Simple гантт график

Before drawing, we need к prepare a DOM container с ширина и высота для Vтаблицагантт, и this container must be relatively positioned, i.e., its позиция must be set к 'absolute' или 'relative'.

**Please ensure that the container's ширина и высота values are integers, as Vтаблица's internal logic uses the container's offsetширина, offsetвысота, clientширина, и clientвысота свойства. If the container's ширина и высота are decimals, it may cause errors в the values taken, potentially leading к таблица jitter issues.**

```html
<body>
  <div id="таблицаContainer" style="позиция: absolute; ширина: 600px;высота:400px;"></div>
</body>
```

следующий, we create a `гантт` instance и pass в the гантт график configuration options:

```javascript liveдемонстрация template=vтаблица
let ганттInstance;
const records = [
  {
    id: 1,
    заголовок: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07/24/2024',
    конец: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-04',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 4,
    заголовок: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 5,
    заголовок: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    заголовок: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-08-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    сортировка: true,
    tree: true,
    editor: 'ввод'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  }
];
const option = {
  overscrollBehavior: 'никто',
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 250,
    minтаблицаширина: 100,
    maxтаблицаширина: 600,
    тема: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 1,
        fontSize: 18,
        fontWeight: 'bold',
        цвет: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: [1, 0, 1, 0],
        fontSize: 16,
        цвет: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
    //rightFrozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineширина: 3
    }
  },
  grid: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowвысота: 40,
  rowвысота: 40,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      ширина: 20,
      /** Task bar цвет */
      barColor: '#ee8800',
      /** Completed part из the task bar цвет */
      completedBarColor: '#91e8e0',
      /** Task bar corner radius */
      cornerRadius: 8,
      /** Task bar граница */
      borderLineширина: 1,
      /** граница цвет */
      borderColor: 'black'
    }
  },
  timelineHeader: {
    colширина: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5',
          textStick: true
          // заполнение: [0, 30, 0, 20]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024/8/02',
      scrollToMarkLine: true,
      позиция: 'лево',
      style: {
        lineColor: 'red',
        lineширина: 1
      }
    }
  ],
  rowSeriesNumber: {
    заголовок: 'Row число',
    dragпорядок: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8'
    }
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    видимый: 'scrolling',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```

в this point, you have successfully drawn a simple гантт график!

I hope this tutorial helps you learn how к use гантт. следующий, Вы можете delve into the various configuration options из vтаблица-гантт к пользовательскийize more diverse таблица effects.
