# How к specify the ширина из a column и включить автоmatic line wrapping в a таблица компонент?

## Question Description

Specify the ширина из a column в a таблица, и включить автоmatic line wrapping based на the ширина limit, while allowing the высота из the cells к be determined по the actual число из content lines.How can I achieve this effect?

![](/vтаблица/Часто Задаваемые Вопросы/2-0.png)

## Solution

Add Следующий configuration к the таблица options.

```javascript
высотаMode: 'автовысота', // the высота из каждый row is determined по the content и will развернуть accordingly.
автоWrapText: true, // включить автоmatic line wrapping.
```

## код пример

```javascript
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns,
  высотаMode: 'автовысота',
  автоWrapText: true
};
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-автовысота-dktrk4)

![result](/vтаблица/Часто Задаваемые Вопросы/2-1.gif)

## Quote

- [github](https://github.com/VisActor/Vтаблица)
