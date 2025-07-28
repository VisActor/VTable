# How к merge cells с the same content в таблица компонент?

## Question Description

If there are multiple consecutive cells из the same данные в a certain column из the таблица, these cells will be автоmatically merged и the content will be displayed в the центр. How к achieve this effect на Vтаблица?
![imвозраст](/vтаблица/Часто Задаваемые Вопросы/14-0.png)

## Solution

Вы можете set `mergeCell` к true в columns, и cells с the same content before и after в the column will be автоmatically merged:

```javascript
const columns = [
  {
    // ......
    mergeCell: true
  }
];
```

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
    заголовок: 'число',
    ширина: 100,
    mergeCell: true
  }
];
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns
};
новый списоктаблица(document.getElementById('container'), option);
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-merge-cell-23wwmk)

![result](/vтаблица/Часто Задаваемые Вопросы/14-1.png)

## Quote

- [Merge Cell демонстрация](https://visactor.io/vтаблица/демонстрация/базовый-функциональность/merge)
- [mergeCell апи](https://visactor.io/vтаблица/option/списоктаблица-columns-текст#mergeCell)
- [github](https://github.com/VisActor/Vтаблица)
