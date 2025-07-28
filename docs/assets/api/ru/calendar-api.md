{{ target: calendar-api }}

# API календаря

## Методы

Методы, в настоящее время поддерживаемые диаграммой календаря, следующие:

### get table()

Получить экземпляр VTable, соответствующий диаграмме календаря.

### get selectedDate()

Получить текущую выбранную дату.

### jumpToDate(Function)

Перейти к указанной дате.

```
jumpToDate(date: Date, animation?: boolean | TYPES.ITableAnimationOption) => void

```

### jumpToCurrentMonth(Function)

Перейти к текущему месяцу.

```
jumpToCurrentMonth(animation?: boolean | TYPES.ITableAnimationOption) => void

```

### getCellLocation(Function)

Получить расположение ячейки, соответствующее указанной дате.

```
getCellLocation(date: Date) => { col: number; row: number }
```

### getCellDate(Function)

Получить дату, соответствующую указанному расположению ячейки.

```
getCellDate(col: number, row: number) => Date
```

### addCustomEvent(Function)

Добавить пользовательское событие.

```
addCustomEvent(event: ICustomEvent) => void
```

### addCustomEvents(Function)

Добавить пользовательские события пакетно.

```
addCustomEvents(events: ICustomEvent[]) => void
```

### removeCustomEvent(Function)

Удалить пользовательское событие.

```
removeCustomEvent(id: string) => void
```

### removeCustomEvents(Function)

Удалить пользовательские события пакетно.

```
removeCustomEvents(ids: string[]) => void
```

### updateCustomEvent(Function)

Обновить пользовательское расписание.

```
updateCustomEvents(events: ICustomEvent) => void
```

### updateCustomEvents(Function)

Пакетное обновление пользовательского расписания.

```
updateCustomEvents(events: ICustomEvent[]) => void
```

### getCellCustomEventByLocation(Function)

Получить пользовательское расписание, соответствующее указанному расположению ячейки.

```
getCellCustomEventByLocation(col: number, row: number) => ICustomEvent[]
```

### release(Function)

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