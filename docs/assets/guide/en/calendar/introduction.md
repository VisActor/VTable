# Calendar

A calendar is a common table used to display dates and corresponding schedules. VTable-Calendar is a calendar component developed based on the VTable component. Users can quickly implement a calendar tool or customize related business functions based on the powerful capabilities of VTable. Compared with traditional calendars, VTable-Calendar has the following advantages:

- Stepless scrolling function, supports scrolling across months and years

- Users familiar with VTable api can quickly get started with custom functions

## Basic configuration of calendar

When creating a calendar, you can pass in the configuration corresponding to the calendar day:

```js
import { Calendar } from '@visactor/vtable-calendar';

const calendar = new VTableCalendar.Calendar(domContainer, options);
```

Among them, option supports the following attributes

| Attribute | Type | Description |
| --- | --- | --- |
| startDate | Date | Calendar start date |
| endDate | Date | Calendar end date |
| currentDate | Date | Calendar day displayed |
| rangeDays | number | The range of days displayed in the calendar (if startDate&endDate is not configured, the dates of rangeDays before and after currentDate will be taken as startDate&endDate, the default is 90 days) |
| dayTitles | string[] | Calendar title (can be replaced with different languages) |
| customEventOptions | ICustomEventOptions | Custom schedule configuration |
| customEvents | ICustomEvent[] | Array of custom schedules |
| tableOptions | ListTableConstructorOptions | Calendar table configuration (the configuration here will be passed to the corresponding VTable instance for deep customization) |

The properties configured in `tableOptions` can be referred to [VTable configuration](../../option/ListTable) for further configuration of the table. For example, if you want Saturday to be displayed in blue and Sunday in red in the calendar title, you can use the following configuration:

```javascript livedemo template=vtable
const calendarInstance = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID), {
  tableOptions: {
    theme: {
      headerStyle: {
        color: args => {
          if (args.col === 0) {
            return 'red'; 
          } else if (args.col === 6) {
            return 'blue';
          }
          return '#000';
        }
      }
    }
  },
});
window['calendarInstance'] = calendarInstance;
```

## Customized calendar

Calendar supports two ways to customize the calendar, one for a single day and one for a multi-day schedule. The configuration of custom schedule is as follows:

```ts
export interface ICustomEvent {
  type: 'list' | 'bar'; // Schedule type, list is a schedule within a single day, bar is a schedule across multiple days
  id: string; // Schedule id, used to distinguish different schedules

  startDate?: Date; // Schedule start date (for schedules across multiple days)
  endDate?: Date; // Schedule end date (for schedules across multiple days)
  date?: Date; // Schedule date (for schedules within a single day)

  text: string;
  color?: string; // text color
  bgColor?: string; // bar background color

  customInfo?: any; // user custom data
}
```

Custom schedules can be configured during initialization, or dynamically added, deleted, and updated through the API.

Initialization configuration:
```ts
const calendar = new Calendar(document.getElementById(CONTAINER_ID), {
  customEvents: [
    {
      date: new Date(2024, 9, 23),
      text: 'Event A',
      id: 'Event A',
      type: 'list',
      color: '#f99'
    },
    {
      id: 'Event B',
      startDate: new Date(2024, 9, 21),
      endDate: new Date(2024, 9, 23),
      text: 'Event B',
      type: 'bar',
      bgColor: '#f99',
      color: '#fff'
    }
  ]
});
```

Dynamic addition, deletion, update:
```ts
// Add
calendar.addCustomEvent({
  id: 'Event C',
  startDate: new Date(2024, 9, 22),
  endDate: new Date(2024, 10, 4),
  text: 'Event C',
  type: 'bar',
  bgColor: '#9f9',
  color: '#fff'
  });

// Delete
calendar.removeCustomEvent('Event C');

// Update
calendar.updateCustomEvent({
  id: 'Event C', // Update by id
  startDate: new Date(2024, 9, 22),
  endDate: new Date(2024, 9, 30),
});
```

Customized schedule APIs
| Methods | Parameters | Description |
| --- | --- | --- |
| addCustomEvent | ICustomEvent | Add a custom schedule |
| addCustomEvents | ICustomEvent[] | Add custom schedules in batches |
| removeCustomEvent | string | Delete custom schedules |
| removeCustomEvents | string[] | Delete custom schedules in batches |
| updateCustomEvent | ICustomEvent | Update custom schedules |
| updateCustomEvents | ICustomEvent[] | Update custom schedules in batches |

## Calendar events

Calendar supports the following events:

| Event name | Description |
| --- | --- |
| calendar_date_click | Triggered when clicking on a calendar date |
| selected_date | Triggered when a date is selected |
| selected_date_clear | Triggered when a date is unselected |
| drag_select_date_end | Triggered when dragging to select a date ends |
| calendar_custom_event_click | Triggered when clicking on a custom schedule |

If further event processing is required, all events of VTable can be monitored through `calendarInstance.table.on()`.