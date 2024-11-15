{{ target: calendar-api }}

# Calendar API

## Methods

日历图目前支持的方法如下：

### get table()

获取日历图对应的 VTable 实例。

### get selectedDate()

获取当前选中的日期。

### jumpToDate(Function)

跳转到指定日期。

```
jumpToDate(date: Date, animation?: boolean | TYPES.ITableAnimationOption) => void
```

### jumpToCurrentMonth(Function)

跳转到当前月份。

```
jumpToCurrentMonth(animation?: boolean | TYPES.ITableAnimationOption) => void
```

### getCellLocation(Function)

获取指定日期对应的单元格位置。

```
getCellLocation(date: Date) => { col: number; row: number }
```

### getCellDate(Function)

获取指定单元格位置对应的日期。

```
getCellDate(col: number, row: number) => Date
```

### addCustomEvent(Function)

添加自定义日程。

```
addCustomEvent(event: ICustomEvent) => void
```

### addCustomEvents(Function)

批量添加自定义日程。

```
addCustomEvents(events: ICustomEvent[]) => void
```

### removeCustomEvent(Function)

移除自定义日程。

```
removeCustomEvent(id: string) => void
```

### removeCustomEvents(Function)

批量移除自定义日程。

```
removeCustomEvents(ids: string[]) => void
```

### updateCustomEvent(Function)

更新自定义日程。

```
updateCustomEvents(events: ICustomEvent) => void
```

### updateCustomEvents(Function)

批量更新自定义日程。

```
updateCustomEvents(events: ICustomEvent[]) => void
```

### getCellCustomEventByLocation(Function)

获取指定单元格位置对应的自定义日程。

```
getCellCustomEventByLocation(col: number, row: number) => ICustomEvent[]
```

### release(Function)

释放日历图。

```
release() => void
```

## Events

与 VTable 实例相同，日历图也支持事件监听，具体事件如下：

### CALENDAR_DATE_CLICK

点击日历图的日期时触发。

事件参数：

```
{ date: Date; tableEvent: MousePointerCellEvent }
```

### SELECTED_DATE

选中日期时触发。

事件参数：

```
{ date: Date; tableEvent: SelectedCellEvent }
```

### SELECTED_DATE_CLEAR

取消选中日期时触发。

### DRAG_SELECT_DATE_END

拖拽选中日期结束时触发。

事件参数：

```
{ date: Date[]; tableEvent: MousePointerCellEvent }
```

### CALENDAR_CUSTOM_EVENT_CLICK

点击自定义日程时触发。

事件参数：

```
{ date: Date; tableEvent: MousePointerCellEvent; customEvent: IEventData }
```