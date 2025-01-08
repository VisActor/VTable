{{ target: gantt-api }}

# Gantt API

## Methods

甘特图目前支持的方法如下：

### 左侧任务信息表格接口调用

因为左侧信息列表是一个完整的 ListTable，所以可直接获取左侧表格的实例，进行自定义操作。

如下为获取表格选中状态的例子：

```
  const tableInstance =new Gantt(containerDom, options);
  const selectedCells = tableInstance.taskListTableInstance.getSelectedCellInfos();
  console.log(selectedCells);
```

具体 ListTable 的接口参考：https://visactor.io/vtable/api/Methods

### updateOptions(Function)

更新 options

```
  updateOptions: (options: GanttConstructorOptions) => void
```

### setRecords(Function)

设置数据

```
  setRecords: (records: any[]) => void
```

### updateScales(Function)

更新时间刻度

```
  updateScales: (scales: ITimelineScale[]) => void
```

{{ use: common-gantt-timeline-scale }}

### updateDateRange(Function)

更新甘特图日期范围

```
  updateDateRange: (minDate: string, maxDate: string) => void
```

### updateMarkLine(Function)

更新 markLine

```
  updateMarkLine: (markLine: IMarkLine[]) => void
```

### updateTaskRecord(Function)

更新某一条数据

```
  /** 更新数据信息 可以传入具体的索引，更新子任务也可以传入索引数组 */
  updateTaskRecord(record: any, task_index: number | number[]): void;
  updateTaskRecord(record: any, task_index: number, sub_task_index: number): void;
```

### release(Function)

释放 Gantt 实例

```
  release: () => void
```

### addLink(Function)

添加依赖关系

```
  addLink: (link: ITaskLink)  => void
```

### deleteLink(Function)

删除依赖关系

```
  deleteLink: (link: ITaskLink)  => void

```

### scrollTop

竖向滚动到指定位置的滚动值获取或者设置

### scrollLeft

横向滚动到指定位置的滚动值获取或者设置

### getTaskBarRelativeRect(Function)

获取任务条的位置。相对应甘特图表左上角的位置。

```
  getTaskBarRelativeRect:(index: number) =>{
    left: number;
    top: number;
    width: number;
    height: number;
  }
```

## Events

甘特图事件列表，可以根据实际需要，监听所需事件，实现自定义业务。

具体使用方式：

```
  const tableInstance =new Gantt(containerDom, options);

  const {
      CLICK_TASK_BAR
    } = EVENT_TYPES;

  tableInstance.on(CLICK_TASK_BAR, (args) => console.log(CLICK_CELL, args));
```

支持的事件类型：

```
export interface EVENT_TYPES {
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';
  /**
   * 改变日期范围事件
   */
  CHANGE_DATE_RANGE: 'change_date_range';
  /**
   * 点击任务条事件
   */
  CLICK_TASK_BAR: 'click_task_bar';
  /**
   * 右键点击任务条事件
   */
  CONTEXTMENU_TASK_BAR: 'contextmenu_task_bar';
  /**
   * 鼠标移入任务条事件
   */
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
  /**
   * 鼠标移出任务条事件
   */
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';
  /**
   * 创建任务排期事件
   */
  CREATE_TASK_SCHEDULE: 'create_task_schedule';

  /**
   * 创建任务依赖关系
   */
  CREATE_DEPENDENCY_LINK: 'create_dependency_link';
}
```

### 左侧任务信息表格事件监听

因为左侧信息列表是一个完整的 ListTable，所以可直接获取左侧表格的实例，进行监听事件。

如下为监听表格单元格选中事件的例子：

```
  const tableInstance =new Gantt(containerDom, options);
  tableInstance.taskListTableInstance.on('click_cell', (args)=>{});
```

具体 ListTable 的事件参考：https://visactor.io/vtable/api/events

### SCROLL

滚动表格事件

事件回传参数：

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

改变日期范围事件

事件回传参数：

```
 {
    /** 改变的是第几条数据 */
    index: number;
    /** 改变后的起始日期 */
    startDate: Date;
    /** 改变后的结束日期 */
    endDate: Date;
    /** 改变前的起始日期 */
    oldStartDate: Date;
    /** 改变前的结束日期 */
    oldEndDate: Date;
    /** 改变后的数据条目 */
    record: any;
  };
```

### CLICK_TASK_BAR

点击任务条事件

事件回传参数：

```
 {
    index: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  }
```

### MOUSEENTER_TASK_BAR

鼠标移入任务条事件

事件回传参数：

```
 {
    index: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  }
```

### MOUSELEAVE_TASK_BAR

鼠标移出任务条事件

事件回传参数：

```
 {
    index: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  }
```

### CREATE_TASK_SCHEDULE

给排期的任务排期的事件

事件回传参数：

```
{
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 第几条数据 */
    index: number;
    /** 改变后的起始日期 */
    startDate: Date;
    /** 改变后的结束日期 */
    endDate: Date;
    /** 改变后的数据条目 */
    record: any;
  };
```

### CREATE_DEPENDENCY_LINK

创建任务依赖关系的事件
事件回传参数：

```
{
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
```

### CLICK_DEPENDENCY_LINK_POINT

点击依赖关系点的事件
事件回传参数：

```
{
   event: Event;
    /** 点击的是起始点还是结束点 */
    point: 'start' | 'end';
    /** 第几条数据 */
    index: number;
    /** 点击连接点的数据信息 */
    record: any;
  };
```

### CONTEXTMENU_DEPENDENCY_LINK

右键点击依赖关系的事件
事件回传参数：

```
{
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
```

### DELETE_DEPENDENCY_LINK
删除了任务依赖关系
事件回传参数：
```
{
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
```