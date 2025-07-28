{{ target: регистрация-тема }}

# тема.регистрация

Form событие список, Вы можете списокen к the обязательный событиеs according к the actual needs, к achieve пользовательскийized business.

Specific ways к use it:
``
const таблицаInstance =новый Vтаблица.списоктаблица(options);

const {
Нажать_CELL
} = Vтаблица.списоктаблица.событие_TYPE;

таблицаInstance.на(Нажать_CELL, (args) => console.log(Нажать_CELL, args));
``

Supported событие types（не все）:

`таблица_событие_TYPE = {
  Нажать_CELL: 'Нажать_cell',
  DBLНажать_CELL: 'dblНажать_cell',
  MOUSEDOWN_CELL: 'mousedown_cell',
  MOUSEUP_CELL: 'mouseup_cell',
  SELECTED_CELL: 'selected_cell',
  KEYDOWN: 'keydown',
  MOUSEENTER_таблица: 'mouseenter_таблица',
  MOUSELEAVE_таблица: 'mouseleave_таблица',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTменю_CELL: 'contextменю_cell',
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  RESIZE_ROW: 'resize_row',
  RESIZE_ROW_END: 'resize_row_end',
  CHANGE_HEADER_POSITION: 'change_header_position',
  сортировка_Нажать: 'сортировка_Нажать',
  AFTER_сортировка: 'after_сортировка',
  FREEZE_Нажать: 'freeze_Нажать',
  прокрутка: 'прокрутка',
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end',
  SCROLL_VERTICAL_END: 'scroll_vertical_end',
  DROPDOWN_меню_Нажать: 'dropdown_меню_Нажать',
  MOUSEOVER_график_SYMBOL: 'mouseover_график_symbol',
  DRAG_SELECT_END: 'drag_select_end',
  DROPDOWN_иконка_Нажать: 'dropdown_иконка_Нажать',
  DROPDOWN_меню_CLEAR: 'dropdown_меню_clear',
  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change',
  SHOW_меню: 'show_меню',
  HIDE_меню: 'hide_меню',
  иконка_Нажать: 'иконка_Нажать',
  // сводный таблица-specific событиеs
   DRILLменю_Нажать: 'drillменю_Нажать',
  сводный_сортировка_Нажать: 'сводный_сортировка_Нажать'
}`

## Нажать_CELL

Mouse Нажать на cell событие.

{{ use: MousePointerCellсобытие() }}

## DBLНажать_CELL

Mouse double-Нажать cell событие.

Refer к the параметр types introduced в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSEDOWN_CELL

Mouse press событие на cell

Refer к the параметр types described в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSEUP_CELL

Cell mouse Релиз событие

Refer к the параметр types described в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## SELECTED_CELL

Cell selected state change событие

{{ use: SelectedCellсобытие() }}

## KEYDOWN

keystrхорошоe событие

{{ use: Keydownсобытие() }}

## MOUSEENTER_таблица

Mouse over form событие

Refer к the параметр types introduced в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSELEAVE_таблица

Mouse off form событие

Refer к the параметр types introduced в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSEMOVE_CELL

Mouse over a cell событие

Refer к the параметр types introduced в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSEENTER_CELL

Mouse into cell событие

Refer к the параметр types described в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## MOUSELEAVE_CELL

Mouse-out-из-cell событие

Refer к the параметр types described в the Нажать_CELL событие для the параметр types из the событие обратный вызов функция.

## CONTEXTменю_CELL

Cell право-Нажать событиеs

{{ use: MousePointerMultiCellсобытие() }}

## RESIZE_COLUMN

Column ширина adjustment событиеs.

событие обратный вызов функция параметр types.
``

{
col: число;
colширина: число
}

``

## RESIZE_COLUMN_END

Column ширина adjustment конец событие.

событие обратный вызов функция параметр types.
``

{
col: число;
colширинаs: число[]
}

``

## RESIZE_ROW

Row высота adjustment событиеs.

событие обратный вызов функция параметр types.
``

{
row: число;
rowвысота: число
}

``

## RESIZE_ROW_END

Row высота adjustment конец событие.

событие обратный вызов функция параметр types.
``

{
row: число;
rowвысота: число
}

``

## CHANGE_HEADER_POSITION

перетаскивание и отпускание the таблица header к move the позиция из the событие

параметр types для событие обратный вызов functions.
``
{
source: CellAddress.
target: CellAddress
}

``

## сортировка_Нажать

Нажать на the сортировка иконка событие.

параметр types для событие обратный вызов functions.
`  {
    поле: строка;
    порядок: 'asc' | 'desc' | 'normal';
    событие: событие;
  }`

## AFTER_сортировка

After сортировкаing событие.
параметр types для событие обратный вызов functions.
`{
  порядок: 'asc' | 'desc' | 'normal';
  поле: строка;
  событие: событие;
}`

## FREEZE_Нажать

Нажать на the fixed column иконка к freeze или unfreeze the событие.

событие обратный вызов функция параметр types.
`{
  col: число;
  row: число;
  полеs: строка[];
  colCount: число;
}`

## прокрутка

прокрутка form событиеs.

событие обратный вызов функция параметр types.
`    {
      scrollLeft: число;
      scrollTop: число;
      scrollширина: число;
      scrollвысота: число;
      viewширина: число;
      viewвысота: число;
    }`

## SCROLL_HORIZONTAL_END

прокрутка horizontally к the право к конец the событие

событие обратный вызов функция параметр types.
`    {
    scrollLeft: число;
    scrollTop: число;
    scrollширина: число;
    scrollвысота: число;
    viewширина: число;
    viewвысота: число;
}`

## SCROLL_VERTICAL_END

Vertical прокрутка bar scrolls к the конец позиция

событие обратный вызов функция параметр types.
`    {
    scrollLeft: число;
    scrollTop: число;
    scrollширина: число;
    scrollвысота: число;
    viewширина: число;
    viewвысота: число;
}`

## DROPDOWN_меню_Нажать

Нажать the отпускание-down меню иконка событие.

{{ use: DropDownменюсобытиеArgs() }}

## MOUSEOVER_график_SYMBOL

Mouse over mini-graph marker событие

{{ use: MousePointerSparklineсобытие() }}

## DRAG_SELECT_END

перетаскивание-и-отпускание boxed cell mouse Релиз событие

{{ use: MousePointerMultiCellсобытие() }}

## DRILLменю_Нажать

Drill-down Кнопка Нажать событие. **сводный таблица proprietary событие**

{{ use: DrillменюсобытиеInfo() }}

## DROPDOWN_иконка_Нажать

Нажать на the отпускание-down меню Кнопка

{{ use: CellAddress() }}

## DROPDOWN_меню_CLEAR

Clear отпускание-down меню событие (Нажатьing на other areas while the меню is displayed)

{{ use: CellAddress() }}

## TREE_HIERARCHY_STATE_CHANGE

Tree structure развернуть и свернуть Нажать событиеs

## SHOW_меню

Displays меню событиеs.

событие обратный вызов функция параметр types.
`    {
      x: число.
      y: число.
      col: число.
      row: число.
      тип: 'выпадающий список' | 'contextменю' | 'пользовательский';
    }`

## HIDE_меню

скрыть меню событиеs

## иконка_Нажать

иконка иконка Нажать событие.

событие обратный вызов функция параметр types.
`    {
      имя: строка;
      col: число.
      row: число.
      x: число.
      y: число.
      funcType?: иконкаFuncTypeEnum | строка;
      иконка: иконка.
    }`

## сводный_сортировка_Нажать

сортировка иконка Нажать событие в the сводный таблица.

параметр types для событие обратный вызов functions.
`    {
      col: число.
      row: число.
      порядок: 'asc' | 'desc' | 'normal'.
      dimensionInfo: IDimensionInfo[];
      cellLocation: CellLocation.
    }`
Among them:
{{ use: common-IDimensionInfo()}}
{{ use: CellLocation()}}
