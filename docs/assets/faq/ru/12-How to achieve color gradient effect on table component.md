# How к achieve цвет gradient effect на таблица компонент?

## Question Description

The фон из the cells на the таблица is displayed в different colors according к different данные, realizing a цвет scale effect. How к achieve this effect на Vтаблица?

![imвозраст](/vтаблица/Часто Задаваемые Вопросы/12-0.png)

## Solution

Вы можете achieve the цвет scale effect по setting `bgColor` в `style` as a функция в `columns` и returning different цвет values based на different данные:

```javascript
const BG_COLOR = (args: TYPES.StylePropertyFunctionArg): строка => {
  const num = args.значение;
  if (число(num) > 80) {
    возврат '#6690FF';
  }
  if (число(num) > 50) {
    возврат '#84A9FF';
  }
  if (число(num) > 20) {
    возврат '#ADC8FF';
  }
  возврат '#D6E4FF';
};

const columns = [
  {
    style: {
      bgColor: BG_COLOR
    }
  }
];
```

## код пример

```javascript
const BG_COLOR = (args: TYPES.StylePropertyFunctionArg): строка => {
  const num = args.значение;
  if (число(num) > 80) {
    возврат '#6690FF';
  }
  if (число(num) > 50) {
    возврат '#84A9FF';
  }
  if (число(num) > 20) {
    возврат '#ADC8FF';
  }
  возврат '#D6E4FF';
};

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80
  },
  {
    поле: 'значение',
    заголовок: 'progress',
    style: {
      bgColor: BG_COLOR
    },
    ширина: 250
  }
];
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns
};
новый списоктаблица(document.getElementById('container'), option);
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-цвет-step-n9ngjq)

![result](/vтаблица/Часто Задаваемые Вопросы/12-1.png)

## Quote

- [цвет step демонстрация](https://visactor.io/vтаблица/демонстрация/business/цвет-level)
- [фон цвет апи](https://visactor.io/vтаблица/option/списоктаблица-columns-текст#style.bgColor)
- [github](https://github.com/VisActor/Vтаблица)
