{{ target: calendar-api }}

# Calendar API

## Methods

The methods currently supported by the calendar chart are as follows:

### get table()

Get the VTable instance corresponding to the calendar chart.

### get selectedDate()

Get the currently selected date.

### jumpToDate(Function)

Jump to the specified date.

```
jumpToDate(date: Date, animation?: boolean | TYPES.ITableAnimationOption) => void

```

### jumpToCurrentMonth(Function)

Jump to the current month.

```
jumpToCurrentMonth(animation?: boolean | TYPES.ITableAnimationOption) => void

```

### getCellLocation(Function)

Get the cell location corresponding to the specified date.

```
getCellLocation(date: Date) => { col: number; row: number }
```

### getCellDate(Function)

Get the date corresponding to the specified cell location.

```
getCellDate(col: number, row: number) => Date
```

### addCustomEvent(Function)

Add a custom event.

```
addCustomEvent(event: ICustomEvent) => void
```

### addCustomEvents(Function)

Add custom events in batches.

```
addCustomEvents(events: ICustomEvent[]) => void
```

### removeCustomEvent(Function)

Remove a custom event.

```
removeCustomEvent(id: string) => void
```

### removeCustomEvents(Function)

Remove custom events in batches.

```
removeCustomEvents(ids: string[]) => void
```

### updateCustomEvent(Function)

Update custom schedule.

```
updateCustomEvents(events: ICustomEvent) => void
```

### updateCustomEvents(Function)

Batch update custom schedule.

```
updateCustomEvents(events: ICustomEvent[]) => void
```

### getCellCustomEventByLocation(Function)

Get the custom schedule corresponding to the specified cell location.

```
getCellCustomEventByLocation(col: number, row: number) => ICustomEvent[]
```

### release(Function)

Release the calendar image.

```
release() => void
```

## Events

Like VTable instances, the calendar chart also supports event monitoring, the specific events are as follows:

### CALENDAR_DATE_CLICK

Triggered when clicking the date of the calendar chart.

Event parameters:

```
{ date: Date; tableEvent: MousePointerCellEvent }
```

### SELECTED_DATE

Triggered when a date is selected.

Event parameters:

```
{ date: Date; tableEvent: SelectedCellEvent }
```

### SELECTED_DATE_CLEAR

Triggered when a date is unselected.

### DRAG_SELECT_DATE_END

Triggered when dragging the selected date ends.

Event parameters:

```
{ date: Date[]; tableEvent: MousePointerCellEvent }
```

### CALENDAR_CUSTOM_EVENT_CLICK

Triggered when clicking a custom schedule.

Event parameters:

```
{ date: Date; tableEvent: MousePointerCellEvent; customEvent: IEventData }
```