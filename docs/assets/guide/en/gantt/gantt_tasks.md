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
| **endDate** | Date \| string | The planned completion date of the task, can be a date object or date string | taskBar.endDateField |
| **task title[any field name]** | string | The name or description text of the task, used to display on the task bar | No need to configure |


### Optional Properties

These properties are used to extend the functionality and visual representation of tasks:

| Property Name | Type | Description | Configuration Property Name |
|-------|------|------| --------- |
| **task id[any field name]** | string \| number | task id, depends on the configuration of the link line | taskKeyField |
| **type** | string | task type, can be `task` (default), `project` or `milestone` |  |
| **progress** | number | The percentage of task completion, range 0-100 | taskBar.progressField |
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

In the VTable-Gantt Gantt chart, the parent-child task relationship can be established in this ways:

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


