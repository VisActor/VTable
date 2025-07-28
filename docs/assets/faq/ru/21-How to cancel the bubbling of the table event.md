# How к отмена the bubbling из the таблица mousedown событие

## Problem Description

в my business scenario, I need к перетаскивание the entire таблица к move the позиция. However, if the mouse point is dragged на the cell, it will trigger the box selection interaction из the таблица. в this way, I do не expect к перетаскивание the entire таблица. When the mouse point is Нажатьed, Then respond к the entire таблица dragging behavior в the blank area из the таблица.

Based на this demand фон, how к determine whether the Нажать is на a cell или a blank area из the таблица?

## solution

This problem can be handled в Vтаблица по списокening к the `mousedown_cell` событие, but it should be noted that Vтаблица internally списокens к pointer событиеs!

Therefore, if you отмена bubbling directly, Вы можете only отмена the pointerdown событие.
```
  таблицаInstance.на('mousedown_cell', arg => {
    arg.событие.stopPropagation();
  });
```
Therefore, you need к списокen к mousedown again к determine the organization событие. для correct processing, Вы можете see Следующий пример:

## код пример

```javascript
  const таблицаInstance = новый Vтаблица.списоктаблица(option);
  window.таблицаInstance = таблицаInstance;
  let isPointerDownOnтаблица = false;
  таблицаInstance.на('mousedown_cell', arg => {
    isPointerDownOnтаблица = true;
    setTimeout(() => {
      isPointerDownOnтаблица = false;
    }, 0);
    arg.событие?.stopPropagation();
  });
  таблицаInstance.getElement().addсобытиесписокener('mousedown', e => {
    if (isPointerDownOnтаблица) {
      e.stopPropagation();
    }
  });
```

## Related documents

- [Tutorial](https://visactor.io/vтаблица/guide/событие/событие_список)
- [github](https://github.com/VisActor/Vтаблица)