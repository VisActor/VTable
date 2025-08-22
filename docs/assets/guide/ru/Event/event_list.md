# событие событие

## introduce

таблица событие список, Вы можете списокen к the обязательный событиеs according к actual needs, и realize пользовательский business.

The specific возврат данные из the событие can be actually tested к observe whether it meets the business needs, или communicate с us.

для a more comprehensive список из событиеs, please refer к: https://visactor.io/vтаблица/апи/событиеs

| имя                                       | событие имя                                          | Description                                                                                                            |
| :----------------------------------------- | :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| Life cycle событие: initialization completed | INITIALIZED                                         | Life cycle событие: triggered after successful initialization is completed                                               |
| Rendering Complete                         | AFTER_RENDER                                        | Triggered каждый time rendering is completed                                                                            |
| списокen к график событиеs                     | Same as the событиеs specified в the vграфик tutorial | Embed the график в the таблица и use it when you need к списокen к график событиеs. Using method `onVграфиксобытие` не `на` |
| Нажать                                      | Нажать_CELL                                          | Cell Нажать событие                                                                                                       |
| Double Нажать                               | DBLНажать_CELL                                       | Cell Double Нажать событие                                                                                                |
| право Нажать                                | CONTEXTменю_CELL                                    | Cell право Нажать событие                                                                                                 |
| Keyboard Press                             | Нажать_CELL                                          | Keyboard Press событиеs                                                                                                  |
| mouse down                                 | MOUSEDOWN_CELL                                      | cell mouse down событие                                                                                                  |
| mouse Релиз                              | MOUSEUP_CELL                                        | cell mouse Релиз событие                                                                                               |
| выбрать state change                        | SELECTED_CELL                                       | Cell выбрать state change событие                                                                                         |
| выбрать state be cleared                    | SELECTED_CLEAR                                      | Cell выбрать state все be cleared событие                                                                                 |
| mouse entry                                | MOUSEENTER_CELL                                     | mouse entry cell событие                                                                                                 |
| mouse movement                             | MOUSEMOVE_CELL                                      | mouse movement событие на a cell                                                                                         |
| mouse leave                                | MOUSELEAVE_CELL                                     | mouse leave cell событие                                                                                                 |
| перетаскивание Column ширина                          | RESIZE_COLUMN                                       | Column ширина Adjustment событие                                                                                          |
| перетаскивание и отпускание column ширина конец             | RESIZE_COLUMN_END                                   | column ширина adjustment конец событие                                                                                      |
| перетаскивание Row высота                            | RESIZE_ROW                                          | Row высота Adjustment событие                                                                                            |
| перетаскивание и отпускание row высота конец               | RESIZE_ROW_END                                      | row высота adjustment конец событие                                                                                        |
| перетаскивание header                                | CHANGE_HEADER_POSITION                              | перетаскивание header к move позиция событие                                                                                     |
| Нажать к сортировка                              | сортировка_Нажать                                          | Нажать к сортировка иконка событие                                                                                               |
| After сортировка                                 | AFTER_сортировка                                          | Execute after сортировкаing событие                                                                                            |
| Нажать Fixed Column                         | FREEZE_Нажать                                        | Нажать Fixed Column иконка событие                                                                                          |
| прокрутка                                     | прокрутка                                              | прокрутка таблица событиеs                                                                                                    |
| Нажать the отпускание-down иконка                   | DROPDOWN_меню_Нажать                                  | Нажать the отпускание-down меню иконка событие                                                                                    |
| Нажать на the отпускание-down меню                | меню_Нажать                                          | Нажать на the отпускание-down меню событиеs                                                                                     |
| Mouse over miniature                       | MOUSEOVER_график_SYMBOL                              | Mouse over miniature mark событиеs                                                                                       |
| перетаскивание и отпускание box к выбрать mouse Релиз  | DRAG_SELECT_END                                     | перетаскивание и отпускание box к выбрать cell mouse Релиз событие                                                                   |
| drill Кнопка Нажать                         | DRILLменю_Нажать                                     | drill Кнопка Нажать событие                                                                                               |
| сводный таблица Tree показать свернуть             | TREE_HIERARCHY_STATE_CHANGE                         | сводный таблица Tree показать свернуть State Change событиеs                                                                     |
| Keys                                       | KEYDOWN                                             | Keyboard Press событиеs                                                                                                  |
| легенда item Нажать событие                    | легенда_ITEM_Нажать                                   | Mouse Нажатьs на an item в the легенда                                                                                  |
| легенда item навести                          | легенда_ITEM_HOVER                                   | Mouse навести an item в the легенда                                                                                      |
| легенда item unhover                        | легенда_ITEM_UNHOVER                                 | легенда item when mouse leaves навести                                                                                    |
| The mouse enters the coordinate axis       | MOUSEENTER_AXIS                                     | The mouse enters the coordinate axis компонент                                                                         |
| mouse leaves the axis                      | MOUSELEAVE_AXIS                                     | mouse leaves the axis компонент                                                                                        |
| списокen к copy                             | COPY_данные                                           | This событие is triggered when a cell is copied using the shortcut key                                                   |
| The mouse enters the таблица area            | MOUSEENTER_таблица                                    | This событие is triggered when the mouse enters the таблица area                                                           |
| The mouse leaves the таблица area            | MOUSELEAVE_таблица                                    | This событие is triggered when the mouse leaves the таблица area                                                           |
| Mouse down                                 | MOUSEDOWN_таблица                                     | This событие is triggered when the mouse is pressed в the таблица area                                                    |
| Paste данные                                 | PASTED_данные                                         | Paste данные событие                                                                                                      |

## событие monitoring method

    const {
        Нажать_CELL,
        DBLНажать_CELL,
        DBLTAP_CELL,
        MOUSEDOWN_CELL,
        MOUSEUP_CELL,
        SELECTED_CELL,
        KEYDOWN,
        MOUSEMOVE_CELL,
        MOUSEENTER_CELL,
        MOUSELEAVE_CELL,
        MOUSEOUT_CELL,
        INPUT_CELL,
        PASTE_CELL,
        RESIZE_COLUMN,
        RESIZE_ROW,
        прокрутка,
        SCROLL_VERTICAL_END,
        SCROLL_HORIZONTAL_END,
        CHANGED_VALUE,
        FREEZE_Нажать,
        сортировка_Нажать,
        AFTER_сортировка,
        DROPDOWN_меню_Нажать,
        CONTEXTменю_CELL,
      } = Vтаблица.списоктаблица.событие_TYPE;
      const таблицаInstance =новый списоктаблица(options);
      таблицаInstance.на(Нажать_CELL, (...args) => console.log(Нажать_CELL, args));
