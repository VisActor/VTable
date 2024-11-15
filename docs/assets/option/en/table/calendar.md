{{ target: calendar }}

# Calendar

Gantt chart configuration, the corresponding type is CalendarConstructorOptions, the specific configuration items are as follows:

## startDate(Date)

The start date of the calendar.

## endDate(Date)

The end date of the calendar.

## currentDate(Date)

The current date of the calendar.

## rangeDays(number)

The date range displayed in the calendar (if startDate&endDate is not configured, the dates before and after rangeDays will be taken from currentDate as startDate&endDate, the default is 90 days).

## dayTitles(string[])

The title of the calendar (can be replaced with different languages).

## customEventOptions(ICustomEventOptions)

Configuration of custom schedules.

{{ use: common-calendar-custom-event-option(prefix = '###') }}

## customEvents(ICustomEvent[])

Array of custom events.

{{ use: common-calendar-custom-event(prefix = '###') }}

## tableOptions(ListTableConstructorOptions)

Calendar table configuration (the configuration here will be passed to the corresponding VTable instance for deep customization).