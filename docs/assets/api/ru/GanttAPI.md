{{ target: гантт-апи }}

# гантт апи

## методы

The методы currently supported по the гантт график are as follows:

### лево Task Information таблица интерфейс Call

Since the лево information список is a complete списоктаблица, Вы можете directly obtain the instance из the лево таблица для пользовательский operations.

Следующий is an пример из obtaining the selected state из the таблица:

```
  const таблицаInstance = новый гантт(containerDom, options);
  const selectedCells = таблицаInstance.taskсписоктаблицаInstance.getSelectedCellInfos();
  console.log(selectedCells);
```

для specific списоктаблица interfaces, refer к: https://visactor.io/vтаблица/апи/методы

### updateOption(функция)

Update options

```
  updateопция: (options: ганттConstructorOptions) => void
```

### setRecords(функция)

Set данные

```
  setRecords: (records: любой[]) => void
```

### updateScales(функция)

Update timeline scales

```
  updateScales: (scales: ITimelineScale[]) => void
```

{{ use: common-гантт-timeline-scale }}

### updateDateRange(функция)

update гантт график date range

```
  updateDateRange: (minDate: строка, maxDate: строка) => void
```

### updateMarkLine(функция)

update markLine

```
  updateMarkLine: (markLine: IMarkLine[]) => void
```

### addMarkLine(функция)

add markLine

```
  addMarkLine: (markLine: IMarkLine) => void
```

### updateCurrentMarkLine(функция)

update one markLine。 date и content are обязательный

```
  updateCurrentMarkLine: (markLine: IMarkLine) => void
```

### updateTaskRecord(функция)

Update a specific данные record

```
  /** Updating данные information can be passed into a specific index, и updating subtasks can also be passed into an index массив */
  updateTaskRecord(record: любой, task_index: число | число[]): void;
  updateTaskRecord(record: любой, task_index: число, sub_task_index: число): void;
```

### Релиз(функция)

Релиз the гантт instance

```
  Релиз: () => void
```

### addLink(функция)

Add Dependencies

```
addссылка: (ссылка: ITaskLink) => void
```

### deleteLink(функция)

Removing Dependencies

```
deleteссылка: (ссылка: ITaskLink) => void

```

### scrollTop

Get или set the vertical прокрутка значение к a specified позиция.

### scrollLeft

Get или set the horizontal прокрутка значение к a specified позиция.

### getTaskBarRelativeRect(функция)

Get the позиция из the task bar. The позиция relative к the верх-лево corner из the гантт график.

```
  getTaskBarRelativeRect:(index: число) =>{
    лево: число;
    верх: число;
    ширина: число;
    высота: число;
  }
```

## событиеs

The гантт график событие список allows you к списокen к the обязательный событиеs и implement пользовательский business logic as needed.

Usвозраст пример:

```
  const таблицаInstance = новый гантт(containerDom, options);

  const {
      Нажать_TASK_BAR
    } = событие_TYPES;

  таблицаInstance.на(Нажать_TASK_BAR, (args) => console.log(Нажать_CELL, args));
```

Supported событие types:

```
export интерфейс событие_TYPES {
  /**
   * прокрутка таблица событие
   */
  прокрутка: 'прокрутка';
  /**
   * Change date range событие
   */
  CHANGE_DATE_RANGE: 'change_date_range';
  /**
   * Нажать task bar событие
   */
  Нажать_TASK_BAR: 'Нажать_task_bar';
  /**
   * право-Нажать task bar событие
   */
  CONTEXTменю_TASK_BAR: 'contextменю_task_bar';
  /**
   * Mouse enter task bar событие
   */
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
  /**
   * Mouse leave task bar событие
   */
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';

  /**
   * Create task schedule событие
   */
  CREATE_TASK_SCHEDULE: 'create_task_schedule';
  /**
   * Create dependency line событие
   */
  CREATE_DEPENDENCY_ссылка: 'create_dependency_link';
}
```

### лево Task Information таблица событие списокener

Since the лево information список is a complete списоктаблица, Вы можете directly obtain the instance из the лево таблица к списокen к событиеs.

Следующий is an пример из списокening к the таблица cell selection событие:

```
  const таблицаInstance = новый гантт(containerDom, options);
  таблицаInstance.taskсписоктаблицаInstance.на('Нажать_cell', (args) => {});
```

для specific списоктаблица событиеs, refer к: https://visactor.io/vтаблица/апи/событиеs

### прокрутка

прокрутка таблица событие

событие обратный вызов parameters:

```
 {
    scrollLeft: число;
    scrollTop: число;
    scrollDirection: 'horizontal' | 'vertical';
    scrollRatioX?: число;
    scrollRatioY?: число;
  }
```

### CHANGE_DATE_RANGE

Change date range событие

событие обратный вызов parameters:

```
 {
    /** The index из the данные being changed */
    index: число;
    /** The новый начало date */
    startDate: Date;
    /** The новый конец date */
    endDate: Date;
    /** The старый начало date */
    oldStartDate: Date;
    /** The старый конец date */
    oldEndDate: Date;
    /** The updated данные record */
    record: любой;
  };
```

### Нажать_TASK_BAR

Нажать task bar событие

событие обратный вызов parameters:

```
 {
    index: число;
    record: любой;
    событие: событие;
    federatedсобытие: FederatedPointerсобытие;
  }
```

### MOUSEENTER_TASK_BAR

Mouse enter task bar событие

событие обратный вызов parameters:

```
 {
    index: число;
    record: любой;
    событие: событие;
    federatedсобытие: FederatedPointerсобытие;
  }
```

### MOUSELEAVE_TASK_BAR

Mouse leave task bar событие

событие обратный вызов parameters:

```
 {
    index: число;
    record: любой;
    событие: событие;
    federatedсобытие: FederatedPointerсобытие;
  }
```

### CREATE_TASK_SCHEDULE

событиеs that schedule scheduled tasks

событие возврат parameters:

```
{
federatedсобытие: FederatedPointerсобытие;
событие: событие;
/** The первый данные */
index: число;
/** The starting date after the change */
startDate: Date;
/** The changed конец date */
endDate: Date;
/** The changed данные entry */
record: любой;
};
```

### CREATE_DEPENDENCY_LINK

событиеs that create dependency lines
событие возврат parameters:

```
{
    federatedсобытие: FederatedPointerсобытие;
    событие: событие;
    /** dependency link */
    ссылка: ITaskLink;
  };
```

### Нажать_DEPENDENCY_LINK_POINT

событиеs that Нажать dependency line point
событие возврат parameters:

```
{
   событие: событие;
    /** Нажать начало или конец link point */
    point: 'начало' | 'конец';
    /** the данные order */
    index: число;
    /** the данные информация */
    record: любой;
  };
```

### CONTEXTменю_DEPENDENCY_LINK

событиеs that право-Нажать dependency line
событие возврат parameters:

```
{
    federatedсобытие: FederatedPointerсобытие;
    событие: событие;
    /** dependency link */
    ссылка: ITaskLink;
  };
```

### DELETE_DEPENDENCY_LINK

событиеs that delete dependency line
событие возврат parameters:

```
{
    событие: событие;
    /** dependency link */
    ссылка: ITaskLink;
  };
```

### Нажать_MARKLINE_CREATE

点击创建 markLine 事件
событиеs that Нажать к create markLine
событие возврат parameters:

```
{
    событие: событие;
    данные: ITimelineDateInfo; // time information
    позиция: IPosition; // позиция information
  };
```

### Нажать_MARKLINE_CONTENT

событиеs that Нажать markLine content
событие возврат parameters:

```
{
    событие: событие;
    данные: IMarkLine; // markLine information
    позиция: IPosition; // позиция information
  };
```
