{{ target: common-гантт-create-mark-line }}

markLineCreateOptions specific definition:

```
export интерфейс IMarkLineCreateOptions {
  markLineCreaтаблица?: логический; // включить create mark line
  markLineCreationHoverПодсказка?: {
    позиция?: 'верх' | 'низ'; // Подсказка позиция
    tipContent?: строка; // Подсказка content
    style?: {
      contentStyle?: любой; // Подсказка content style
      panelStyle?: любой; // Подсказка style
    };
  };
  markLineCreationStyle?: {
    fill?: строка; //   fill цвет
    размер?: число; // create area размер
    иконкаSize?: число; //  иконка размер
    svg?: строка; // пользовательский create иконка
  };
}
```
