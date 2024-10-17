{{ target: gantt-api }}

# Gantt API

## Methods

The methods currently supported by the Gantt chart are as follows:

### Left Task Information Table Interface Call

Since the left information list is a complete ListTable, you can directly obtain the instance of the left table for custom operations.

The following is an example of obtaining the selected state of the table:

```
  const tableInstance = new Gantt(containerDom, options);
  const selectedCells = tableInstance.taskListTableInstance.getSelectedCellInfos();
  console.log(selectedCells);
```

For specific ListTable interfaces, refer to: https://visactor.io/vtable/api/Methods

### setRecords(Function)

Set data

```
  setRecords: (records: any[]) => void
```

### updateScales(Function)

Update timeline scales

```
  updateScales: (scales: ITimelineScale[]) => void
```

{{ use: common-gantt-timeline-scale }}

### updateTaskRecord(Function)

Update a specific data record

```
  updateTaskRecord: (record: any, index: number) => void
```

### release(Function)

Release the Gantt instance

```
  release: () => void
```

## Events

The Gantt chart event list allows you to listen to the required events and implement custom business logic as needed.

Usage example:

```
  const tableInstance = new Gantt(containerDom, options);

  const {
      CLICK_TASK_BAR
    } = EVENT_TYPES;

  tableInstance.on(CLICK_TASK_BAR, (args) => console.log(CLICK_CELL, args));
```

Supported event types:

```
export interface EVENT_TYPES {
  /**
   * Scroll table event
   */
  SCROLL: 'scroll';
  /**
   * Change date range event
   */
  CHANGE_DATE_RANGE: 'change_date_range';
  /**
   * Click task bar event
   */
  CLICK_TASK_BAR: 'click_task_bar';
  /**
   * Mouse enter task bar event
   */
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
  /**
   * Mouse leave task bar event
   */
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';

  /**
   * Create task schedule event
   */
  CREATE_TASK_SCHEDULE: 'create_task_schedule';
  /**
   * Create dependency line event
   */
  CREATE_DEPENDENCY_LINK: 'create_dependency_link';
}
```

### Left Task Information Table Event Listener

Since the left information list is a complete ListTable, you can directly obtain the instance of the left table to listen to events.

The following is an example of listening to the table cell selection event:

```
  const tableInstance = new Gantt(containerDom, options);
  tableInstance.taskListTableInstance.on('click_cell', (args) => {});
```

For specific ListTable events, refer to: https://visactor.io/vtable/api/events

### SCROLL

Scroll table event

Event callback parameters:

```
 {
    scrollLeft: number;
    scrollTop: number;
    scrollDirection: 'horizontal' | 'vertical';
    scrollRatioX?: number;
    scrollRatioY?: number;
  }
```

### CHANGE_DATE_RANGE

Change date range event

Event callback parameters:

```
 {
    /** The index of the data being changed */
    index: number;
    /** The new start date */
    startDate: Date;
    /** The new end date */
    endDate: Date;
    /** The old start date */
    oldStartDate: Date;
    /** The old end date */
    oldEndDate: Date;
    /** The updated data record */
    record: any;
  };
```

### CLICK_TASK_BAR

Click task bar event

Event callback parameters:

```
 {
    index: number;
    record: any;
    event: Event;
  }
```

### MOUSEENTER_TASK_BAR

Mouse enter task bar event

Event callback parameters:

```
 {
    index: number;
    record: any;
    event: Event;
  }
```

### MOUSELEAVE_TASK_BAR

Mouse leave task bar event

Event callback parameters:

```
 {
    index: number;
    record: any;
    event: Event;
  }
```

### CREATE_TASK_SCHEDULE

Events that schedule scheduled tasks

Event return parameters:

```
{
event: Event;
/** The first data */
index: number;
/** The starting date after the change */
startDate: Date;
/** The changed end date */
endDate: Date;
/** The changed data entry */
record: any;
};
```

### CREATE_DEPENDENCY_LINK

Events that create dependency lines
Event return parameters:

```
{
   event: Event;
    /** dependency link */
    link: ITaskLink;
  };
```
