# How can the таблица column ширина показать different effects according к the число из данные columns?

## Question Description

When using Vтаблица таблица library к display report данные, if the total число из columns is не enough к support the ширина из the entire container, I think it can автоmatically widen к adapt к the container размер, but when the total ширина из the column is larger than the container ширина, Вы можете прокрутка horizontally. How can this effect be achieved?

## Solution

Based на your question, my understanding is that you want к dynamically adjust the ширина mode based на the total column ширина из the данные. в Vтаблица, the ширина mode ширинаMode has:

- standard sets the ширина из каждый column according к the с setting
- автоширина автоmatically calculates column ширина based на cell content
- adaptive scales according к the ширина из the container к fill the ширина из the container.
  That is, if the число из columns is too small к cover the container, you want the adaptive effect. If the total column ширина exceeds the container ширина, you want the standard или автоширина effect. There are two ways к do this:

1. Вы можете use the интерфейс из the Vтаблица instance, getAllColsширина, к get the total column ширина и the ширина из the container для comparison, и then change the ширинаMode according к the situation.
2. A relatively trouble-free way, Vтаблица provides a very optimized configuration item `автоFillширина`. Configuring this can perfectly achieve the effect you want. There is also a corresponding высота setting `автоFillширина`.

![](/vтаблица/Часто Задаваемые Вопросы/13-0.png)

## код пример

```javascript
const option = {
  records,
  columns,
  limitMaxавтоширина: 800,
  автоFillширина: true
  // ширинаMode: "автоширина",
  // высотаMode: "автовысота"
};
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-autfillширина-6kz69n)

![result](/vтаблица/Часто Задаваемые Вопросы/13-1.png)

## Quote

- [Column ширина Tutorial](https://visactor.io/vтаблица/guide/базовый_function/row_высота_column_ширина)
- [Related апи](https://visactor.io/vтаблица/option/списоктаблица#автоFillширина)
- [github](https://github.com/VisActor/Vтаблица)
