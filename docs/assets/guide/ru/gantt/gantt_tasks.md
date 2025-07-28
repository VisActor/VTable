# Vтаблица гантт Tasks

## Task тип

в the Vтаблица гантт график, tasks are divided into three predefined types, каждый с different visual representations и characteristics. The task тип is specified по the `тип` property в the данные item (the значение corresponds к the значение в the `TaskType` enumeration).

### Normal Task

The по умолчанию task тип is `TaskType.TASK`. These tasks can be dragged и resized, и their duration и progress are не affected по their sub-tasks.

```javascript
// 指定普通任务
const данные = [
  { id: 2, текст: "任务 #1", startDate: "2023-04-12", endDate: "2023-04-15", тип: "task" }
];
// 或者省略type（默认为task）
const данные = [
  { id: 2, текст: "任务 #1", startDate: "2023-04-12", endDate: "2023-04-15" }
];
```

Normal task characteristics:
- Can have one parent task и an arbitrary число из sub-tasks
- Can be dragged и resized
- Does не depend на sub-tasks, so even if their sub-tasks are dragged, the task's duration и progress will не change
- Can be displayed на project tasks

### Project Task

Project task (`TaskType.PROJECT`) is a special тип из task whose начало time depends на the earliest sub-task начало time, и the конец time depends на the latest sub-task конец time. The duration из the project task depends на its sub-tasks и will change accordingly.

```javascript
// 指定项目任务
const данные = [
  { 
    id: 1, 
    текст: "项目 #1", 
    тип: "project", 
    children: [
      { id: 2, текст: "子任务 #1", startDate: "2023-04-12", endDate: "2023-04-15" },
      { id: 3, текст: "里程碑", тип: "milestone", startDate: "2023-04-14" }
    ]
  }
];
```

Project task characteristics:
- Can have one parent task и an arbitrary число из sub-tasks
- Cannot be dragged и resized
- Depends на sub-tasks, if the user drags the sub-tasks, the project task will correspondingly adjust its duration
- Ignores the `startDate` и `endDate` свойства
- The progress из the project is independently specified и does не depend на the sub-tasks (if автоmatic calculation is needed, it needs к be implemented по oneself)


### Milestone

Milestone (`TaskType.MILESTONE`) is a task с zero duration, typically used к mark important dates в projects. Milestones are represented по a diamond иконка в the гантт график.

```javascript
// 指定里程碑
const данные = [
  { id: 3, текст: "Alpha发布", тип: "milestone", startDate: "2023-04-14" }
];
```

Milestone characteristics:
- Can have one parent task и an arbitrary число из sub-tasks
- Cannot be dragged и resized
- Has zero duration и always maintains this characteristic
- Ignores the `endDate` и `progress` свойства

## Task свойства

Vтаблица гантт график tasks can include various свойства, here is the complete список из свойства и their purposes.

### обязательный свойства

  These свойства must be defined в the данные, otherwise the гантт график will не render the task correctly:

| Property имя | тип | Description | Configuration Property имя |
|-------|------|------| --------- |
| **startDate** | Date \| строка | The planned начало date из the task, can be a date объект или date строка | taskBar.startDateполе |
| **endDate** | Date \| строка | The planned completion date из the task, can be a date объект или date строка | taskBar.endDateполе |
| **task title[любой поле имя]** | строка | The имя или description текст из the task, used к display на the task bar | No need к configure |


### необязательный свойства

These свойства are used к extend the функциональность и visual representation из tasks:

| Property имя | тип | Description | Configuration Property имя |
|-------|------|------| --------- |
| **task id[любой поле имя]** | строка \| число | task id, depends на the configuration из the link line | taskKeyполе |
| **тип** | строка | task тип, can be `task` (по умолчанию), `project` или `milestone` |  |
| **progress** | число | The percentвозраст из task completion, range 0-100 | taskBar.progressполе |
| **children** | массив | The массив из sub-tasks, used к build the task hierarchy | Fixed значение |
| **hierarchyState** | строка | The expansion state из the tree structure, can be `развернуть` или `свернуть` | Fixed значение |


### пример

Here is an пример из a task данные с multiple свойства:

```javascript
const ганттданные = [
  { 
    id: 1, 
    текст: "项目A", 
    тип: "project",
    hierarchyState: "развернуть",
    progress: 0.6,
    children: [
      { 
        id: 2, 
        текст: "调研阶段", 
        startDate: "2023-04-01", 
        endDate: "2023-04-10",
        progress: 1
      },
      { 
        id: 3, 
        текст: "开发阶段", 
        startDate: "2023-04-11", 
        endDate: "2023-04-25",
        progress: 0.7
      },
      { 
        id: 4, 
        текст: "测试阶段", 
        startDate: "2023-04-26", 
        endDate: "2023-05-05",
        progress: 0.3
      },
      { 
        id: 5, 
        текст: "里程碑：版本发布", 
        тип: "milestone", 
        startDate: "2023-05-06"
      }
    ]
  }
];
```

## Task Tree Operations

Vтаблица-гантт гантт график supports task данные с tree structure, representing the parent-child relationship и hierarchical structure between tasks.

### Parent-Child Task Relationship

в the Vтаблица-гантт гантт график, the parent-child task relationship can be established в this ways:

1. **Using the children property** (recommended):

```javascript
const данные = [
  { 
    id: 1, 
    текст: "父任务", 
    children: [
      { id: 2, текст: "子任务1", startDate: "2023-04-01", endDate: "2023-04-05" },
      { id: 3, текст: "子任务2", startDate: "2023-04-06", endDate: "2023-04-10" }
    ]
  }
];
```



### Tree Expansion State (Hierarchy State)

Vтаблица-гантт гантт график supports tree structure expansion и folding функциональность, controlled по the `hierarchyState` property из the task:

```javascript
const данные = [
  { 
    id: 1, 
    текст: "父任务", 
    hierarchyState: "свернуть",  // 初始状态为折叠
    children: [
      { id: 2, текст: "子任务1", startDate: "2023-04-01", endDate: "2023-04-05" },
      { id: 3, текст: "子任务2", startDate: "2023-04-06", endDate: "2023-04-10" }
    ]
  }
];
```

в the `Project_Sub_Tasks_Inline` mode, the expansion/folding behavior из project tasks can be controlled по the `projectSubTasksExpandable` configuration:

```javascript
const ганттOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true,  // 允许项目子任务展开/折叠
};
```

When `projectSubTasksExpandable` is set к `true` (по умолчанию значение), project tasks can be expanded/collapsed. When collapsed, sub-tasks will be displayed within the project task row; when expanded, sub-tasks will be displayed в a regular tree structure.

  When `projectSubTasksExpandable` is set к `false`, project tasks will не have an развернуть/свернуть иконка, и sub-tasks will be displayed within the project task row.


