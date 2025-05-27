# VTable Gantt Tasks

## Task Type

In the VTable Gantt chart, tasks are divided into three predefined types, each with different visual representations and characteristics. The task type is specified by the `type` property in the data item (the value corresponds to the value in the `TaskType` enumeration).

### Normal Task

The default task type is `TaskType.TASK`. These tasks can be dragged and resized, and their duration and progress are not affected by their sub-tasks.

```javascript
// 指定普通任务
const data = [
  { id: 2, text: "任务 #1", startDate: "2023-04-12", endDate: "2023-04-15", type: "task" }
];
// 或者省略type（默认为task）
const data = [
  { id: 2, text: "任务 #1", startDate: "2023-04-12", endDate: "2023-04-15" }
];
```

Normal task characteristics:
- Can have one parent task and an arbitrary number of sub-tasks
- Can be dragged and resized
- Does not depend on sub-tasks, so even if their sub-tasks are dragged, the task's duration and progress will not change
- Can be displayed on project tasks

### Project Task

Project task (`TaskType.PROJECT`) is a special type of task whose start time depends on the earliest sub-task start time, and the end time depends on the latest sub-task end time. The duration of the project task depends on its sub-tasks and will change accordingly.

```javascript
// 指定项目任务
const data = [
  { 
    id: 1, 
    text: "项目 #1", 
    type: "project", 
    children: [
      { id: 2, text: "子任务 #1", startDate: "2023-04-12", endDate: "2023-04-15" },
      { id: 3, text: "里程碑", type: "milestone", startDate: "2023-04-14" }
    ]
  }
];
```

Project task characteristics:
- Can have one parent task and an arbitrary number of sub-tasks
- Cannot be dragged and resized
- Depends on sub-tasks, if the user drags the sub-tasks, the project task will correspondingly adjust its duration
- Ignores the `startDate` and `endDate` properties
- The progress of the project is independently specified and does not depend on the sub-tasks (if automatic calculation is needed, it needs to be implemented by oneself)


### Milestone

Milestone (`TaskType.MILESTONE`) is a task with zero duration, typically used to mark important dates in projects. Milestones are represented by a diamond icon in the Gantt chart.

```javascript
// 指定里程碑
const data = [
  { id: 3, text: "Alpha发布", type: "milestone", startDate: "2023-04-14" }
];
```

Milestone characteristics:
- Can have one parent task and an arbitrary number of sub-tasks
- Cannot be dragged and resized
- Has zero duration and always maintains this characteristic
- Ignores the `endDate` and `progress` properties

## Task Properties

VTable Gantt chart tasks can include various properties, here is the complete list of properties and their purposes.

### Required Properties

  These properties must be defined in the data, otherwise the Gantt chart will not render the task correctly:

| Property Name | Type | Description | Configuration Property Name |
|-------|------|------| --------- |
| **startDate** | Date \| string | The planned start date of the task, can be a date object or date string | taskBar.startDateField |
| **endDate** | Date \| string | The planned completion date of the task, can be a date object or date string (choose one of startDate and endDate) | taskBar.endDateField |
| **text** | string | The name or description text of the task, used to display on the task bar | No need to configure |


### Optional Properties

These properties are used to extend the functionality and visual representation of tasks:

| Property Name | Type | Description | Configuration Property Name |
|-------|------|------| --------- |
| **id** | string \| number | 任务的唯一标识，如果未设置则自动生成 | taskKeyField |
| **type** | string | 任务类型，可以是`task`（默认）、`project`或`milestone` | 固定值 |
| **progress** | number | The percentage of task completion, range 0-1 (e.g., 0.5 represents 50%) | taskBar.progressField |
| **children** | Array | The array of sub-tasks, used to build the task hierarchy | Fixed value |
| **hierarchyState** | string | The expansion state of the tree structure, can be `expand` or `collapse` | Fixed value |


### Example

Here is an example of a task data with multiple properties:

```javascript
const ganttData = [
  { 
    id: 1, 
    text: "项目A", 
    type: "project",
    hierarchyState: "expand",
    progress: 0.6,
    children: [
      { 
        id: 2, 
        text: "调研阶段", 
        startDate: "2023-04-01", 
        endDate: "2023-04-10",
        progress: 1
      },
      { 
        id: 3, 
        text: "开发阶段", 
        startDate: "2023-04-11", 
        endDate: "2023-04-25",
        progress: 0.7
      },
      { 
        id: 4, 
        text: "测试阶段", 
        startDate: "2023-04-26", 
        endDate: "2023-05-05",
        progress: 0.3
      },
      { 
        id: 5, 
        text: "里程碑：版本发布", 
        type: "milestone", 
        startDate: "2023-05-06"
      }
    ]
  }
];
```

## Task Tree Operations

VTable-Gantt Gantt chart supports task data with tree structure, representing the parent-child relationship and hierarchical structure between tasks.

### Parent-Child Task Relationship

In the VTable-Gantt Gantt chart, the parent-child task relationship can be established in two ways:

1. **Using the children property** (recommended):

```javascript
const data = [
  { 
    id: 1, 
    text: "父任务", 
    children: [
      { id: 2, text: "子任务1", startDate: "2023-04-01", endDate: "2023-04-05" },
      { id: 3, text: "子任务2", startDate: "2023-04-06", endDate: "2023-04-10" }
    ]
  }
];
```



### Tree Expansion State (Hierarchy State)

VTable-Gantt Gantt chart supports tree structure expansion and folding functionality, controlled by the `hierarchyState` property of the task:

```javascript
const data = [
  { 
    id: 1, 
    text: "父任务", 
    hierarchyState: "collapse",  // 初始状态为折叠
    children: [
      { id: 2, text: "子任务1", startDate: "2023-04-01", endDate: "2023-04-05" },
      { id: 3, text: "子任务2", startDate: "2023-04-06", endDate: "2023-04-10" }
    ]
  }
];
```

In the `Project_Sub_Tasks_Inline` mode, the expansion/folding behavior of project tasks can be controlled by the `projectSubTasksExpandable` configuration:

```javascript
const ganttOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true,  // 允许项目子任务展开/折叠
};
```

When `projectSubTasksExpandable` is set to `true` (default value), project tasks can be expanded/collapsed. When collapsed, sub-tasks will be displayed within the project task row; when expanded, sub-tasks will be displayed in a regular tree structure.

  When `projectSubTasksExpandable` is set to `false`, project tasks will not have an expand/collapse icon, and sub-tasks will be displayed within the project task row.

## Task Display Mode

VTable Gantt chart provides multiple task display modes, which can be set through the `tasksShowMode` configuration item. Each mode has different processing logic for task display.

### Tasks_Separate mode

This is the default display mode, where each task node (including parent and sub-tasks) is displayed on a separate line.

```javascript
const ganttOptions = {
  tasksShowMode: "Tasks_Separate"
};
```

In this mode:
- The parent task occupies one line
- Each sub-task occupies one line
- Suitable for scenarios where it is necessary to clearly show the hierarchical structure of each task

### Sub_Tasks_Inline模式

This mode does not display the parent task node and displays all sub-tasks on the same line.

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Inline"
};
```

In this mode:
- The parent task node is not displayed separately
- All sub-tasks are displayed on the same line
- Suitable for scenarios where it is necessary to display related tasks compactly

### Sub_Tasks_Separate模式

This mode does not display the parent task node and displays all sub-tasks on separate lines.

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Separate"
};
```

In this mode:
- The parent task node is not displayed
- Each sub-task occupies one line
- Suitable for scenarios where only specific tasks are focused on rather than grouped

### Sub_Tasks_Arrange模式

This mode does not display the parent task node and displays all sub-tasks in the order of the data in `records`, ensuring that the nodes are not overlapped.

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Arrange"
};
```

In this mode:
- The parent task node is not displayed
- The sub-tasks are arranged in the order of the data in `records`, ensuring that the nodes are not overlapped
- Suitable for scenarios where it is necessary to maintain the original data order

### Sub_Tasks_Compact模式

This mode does not display the parent task node and displays all sub-tasks in a compact manner, arranged by the start date, ensuring that the nodes are not overlapped.

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Compact"
};
```

In this mode:
- The parent task node is not displayed
- The sub-tasks are arranged by the start date, ensuring that the nodes are displayed in a compact manner without overlapping
- Suitable for scenarios where it is necessary to maximize the use of space

### Project_Sub_Tasks_Inline模式

This mode specifically handles project type tasks, displaying all sub-tasks of the project type node on the same line as the main task, while other types of tasks remain in the default Tasks_Separate mode.

```javascript
const ganttOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true  // 控制项目子任务是否可以展开/折叠
};
```

In this mode:
- Only project type tasks are specially processed, and other tasks are displayed normally
- When the project task is folded, the sub-tasks are displayed inline on the project task row
- When the project task is expanded, the sub-tasks are displayed in a regular tree structure
- Controlled by the `projectSubTasksExpandable` configuration to support expand/collapse functionality
- Suitable for scenarios where it is necessary to treat project tasks differently from normal tasks

This display mode is mainly implemented in the `initBars` method of the `scenegraph/task-bar.ts` file, with special processing logic for the `Project_Sub_Tasks_Inline` mode, checking the `hierarchyState` status and type of the record to determine how to display the sub-tasks.
