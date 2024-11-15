{{ target: calendar }}

# Calendar

甘特图配置，对应的类型为 CalendarConstructorOptions，具体配置项如下：

## startDate(Date)

日历的起始日期。

## endDate(Date)

日历的结束日期。

## currentDate(Date)

日历的当前日期。

## rangeDays(number)

在日历中显示的日期范围（如果没有配置startDate&endDate，会从currentDate取前后rangeDays的日期作为startDate&endDate，默认90天）。

## dayTitles(string[])

日历的标题（可以替换为不同语言）。

## customEventOptions(ICustomEventOptions)

自定义日程的配置。

{{ use: common-calendar-custom-event-option(prefix = '###') }}

## customEvents(ICustomEvent[])

自定义日程的数组。

{{ use: common-calendar-custom-event(prefix = '###') }}

## tableOptions(ListTableConstructorOptions)

日历表格的配置（这里的配置会被传给对应的VTable实例，用于深度自定义）。
