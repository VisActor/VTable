# в таблица компонент, how can the truncated текст, which exceeds the ширина из the cell, be displayed в a всплывающее окно window к показать the complete content?

## Question Description

в the таблица компонент, after using the fixed column ширина к limit the cell ширина, некоторые текст that exceeds the ширина will be omitted. How к realize that when the cell content is omitted, навести к the corresponding позиция, и a prompt box will pop up к display the complete content.

## Solution

Vтаблица can configure `isShowOverflowTextПодсказка` к realize навести pop-up poptip к display the complete текст that has been omitted.

## код пример

```javascript
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns,
  Подсказка: {
    isShowOverflowTextПодсказка: true
  }
};

// 创建 Vтаблица 实例
const vтаблицаInstance = новый Vтаблица.списоктаблица(
  document.getElementById("container")!,
  option
);
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-showoverflowtextПодсказка-qq597m)

![result](/vтаблица/Часто Задаваемые Вопросы/4-0.gif)

## Quote

- [Подсказка демонстрация](https://visactor.io/vтаблица/демонстрация/компонент/Подсказка)
- [Подсказка Tutorial](https://visactor.io/vтаблица/guide/компонентs/Подсказка)
- [Related апи](https://visactor.io/vтаблица/option/списоктаблица#Подсказка.isShowOverflowTextПодсказка)
- [github](https://github.com/VisActor/Vтаблица)
