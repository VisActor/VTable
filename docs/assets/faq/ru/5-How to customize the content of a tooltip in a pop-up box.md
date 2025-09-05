# Vтаблица Usвозраст Issue: How к пользовательскийize the content из a Подсказка в a pop-up box?

## Question Description

When hovering the mouse over a cell, I want к display contextual information about that cell, и I want the Подсказка box к have a completely пользовательскийized style. How can I achieve this using Vтаблица?

## Solution

One flexible approach is к списокen к the `mouseenter_cell` и `mouseleave_cell` событиеs из the Vтаблица instance. показать или скрыть the пользовательский DOM elements accordingly, и calculate the позиция к display the Подсказка based на the `cellRange` параметр от the Vтаблица событие. демонстрация: https://visactor.io/vтаблица/демонстрация/компонент/Подсказка_пользовательский_content

## код пример

```javascript
таблицаInstance.на('mouseenter_cell', args => {
  const { cellRange, col, row } = args;
  showПодсказка(cellRange); //yourself функция
});
таблицаInstance.на('mouseleave_cell', args => {
  const { cellRange, col, row } = args;
  hideПодсказка(); //yourself функция
});
```

## Results

[Online демонстрация](https://visactor.io/vтаблица/демонстрация/компонент/Подсказка_пользовательский_content)

![result](/vтаблица/Часто Задаваемые Вопросы/5-0.png)

## Quote

- [таблица Подсказка демонстрация](https://visactor.io/vтаблица/демонстрация/компонент/Подсказка_пользовательский_content)
- [Подсказка Tutorial](https://visactor.io/vтаблица/guide/компонентs/Подсказка)
- [github](https://github.com/VisActor/Vтаблица)
