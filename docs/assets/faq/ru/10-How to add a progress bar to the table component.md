# How к add a progress bar к the таблица компонент?

## Question Description

Specify a column на the таблица, display the content as a progress bar based на данные, и display percentвозраст текст. How к achieve this effect на Vтаблица?
![imвозраст](/vтаблица/Часто Задаваемые Вопросы/10-0.png)

## Solution

Вы можете specify the column к be progress bar тип (progress график) cell по setting `cellType` к `progressbar` в `columns`; по configuring the `style` в `columns`, Вы можете configure the style из the progress график:

```javascript
{
    поле: "значение",
    заголовок: "progress",
    cellType: "progressbar",
    style: {
      barColor: DEFAULT_BAR_COLOR,
      barBgColor: "#ddd",
      barвысота: 30,
      barBottom: 4,
      textAlign: "право"
    },
    полеFormat: (данные: любой) => {
      возврат данные.значение + "%";
    },
    ширина: 250
}
```

в style:

- barColor: progress bar цвет, which can be configured as a функция к change the цвет из different progresses
- barBgColor: progress bar фон цвет
- barвысота: progress bar высота, supports configuration percentвозраст
- barBottom: the высота из the progress bar от the низ, supports configuration percentвозраст
- ......
  Through `полеFormat`, Вы можете modify the текст content в the cell и display percentвозраст текст.
  по modifying the `barType`, the progress график can be changed к a simple bar график, which can be used к display content с both positive и negative данные.

## код пример

```javascript
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80
  },
  {
    поле: 'значение',
    заголовок: 'progress',
    cellType: 'progressbar',
    style: {
      barColor: DEFAULT_BAR_COLOR,
      barBgColor: '#ddd',
      barвысота: 30,
      barBottom: 4,
      textAlign: 'право'
    },
    полеFormat: (данные: любой) => {
      возврат данные.значение + '%';
    },
    ширина: 250
  },
  {
    поле: 'value1',
    заголовок: 'axis',
    cellType: 'progressbar',
    barType: 'negative',
    min: -50,
    max: 50,
    style: {
      barвысота: 30,
      barBottom: 4,
      textAlign: 'право'
    },
    ширина: 250
  }
];
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns
};
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-progress-bar-l69jtk)

![result](/vтаблица/Часто Задаваемые Вопросы/10-1.png)

## Quote

- [Progress bar демонстрация](https://visactor.io/vтаблица/демонстрация/cell-тип/progressbar)
- [Progress bar Tutorial](https://visactor.io/vтаблица/guide/cell_type/progressbar)
- [github](https://github.com/VisActor/Vтаблица)
