{{ target: calendar-api }}

# API календаря

## Методы

Методы, в настоящее время поддерживаемые диаграммой календаря, следующие:

### get table()

Получить экземпляр VTable, соответствующий диаграмме календаря.

### get selectedDate()

Получить текущую выбранную дату.

### jumpToDate(функция)

Перейти к указанной дате.

```
jumpToDate(date: Date, animation?: логический | TYPES.ITableAnimationOption) => void

```

### jumpToCurrentMonth(функция)

Перейти к текущему месяцу.

```
jumpToCurrentMonth(animation?: логический | TYPES.ITableAnimationOption) => void

```

### getCellLocation(функция)

Получить расположение ячейки, соответствующее указанной дате.

```
getCellLocation(date: Date) => { col: число; row: число }
```

### getCellDate(функция)

Получить дату, соответствующую указанному расположению ячейки.

```
getCellDate(col: число, row: число) => Date
```

### addCustomEvent(функция)

Добавить пользовательское событие.

```
addCustomEvent(event: ICustomEvent) => void
```

### addCustomEvents(функция)

Добавить пользовательские события пакетно.

```
addCustomEvents(events: ICustomEvent[]) => void
```

### removeCustomEvent(функция)

Удалить пользовательское событие.

```
removeCustomEvent(id: строка) => void
```

### removeCustomEvents(функция)

Удалить пользовательские события пакетно.

```
removeCustomEvents(ids: строка[]) => void
```

### updateCustomEvent(функция)

Обновить пользовательское расписание.

```
updateCustomEvents(events: ICustomEvent) => void
```

### updateCustomEvents(функция)

Пакетное обновление пользовательского расписания.

```
updateCustomEvents(events: ICustomEvent[]) => void
```

### getCellCustomEventByLocation(функция)

Получить пользовательское расписание, соответствующее указанному расположению ячейки.

```
getCellCustomEventByLocation(col: число, row: число) => ICustomEvent[]
```

### release(функция)

Освободить изображение календаря.

```
release() => void
```

## События

Как и экземпляры VTable, диаграмма календаря также поддерживает мониторинг событий, конкретные события следующие:

### CALENDAR_DATE_CLICK

Срабатывает при клике на дату диаграммы календаря.

Параметры события:

```
{ date: Date; tableEvent: MousePointerCellEvent }
```

### SELECTED_DATE

Срабатывает при выборе даты.

Параметры события:

```
{ date: Date; tableEvent: SelectedCellEvent }
```

### SELECTED_DATE_CLEAR

Срабатывает при отмене выбора даты.

### DRAG_SELECT_DATE_END

Срабатывает когда завершается перетаскивание выбранной даты.

Параметры события:

```
{ date: Date[]; tableEvent: MousePointerCellEvent }
```

### CALENDAR_CUSTOM_EVENT_CLICK

Срабатывает при клике на пользовательское расписание.

Параметры события:

```
{ date: Date; tableEvent: MousePointerCellEvent; customEvent: IEventData }
```