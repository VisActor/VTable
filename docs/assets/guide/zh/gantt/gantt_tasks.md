# VTable甘特图(Gantt)任务配置

## 任务类型

在VTable甘特图中，任务分为三种预定义类型，每种类型具有不同的视觉表现和行为特点。任务类型通过数据项中的`type`属性来指定（值对应`TaskType`枚举中的值）。

### 普通任务

普通任务是默认的任务类型（`TaskType.TASK`）。这些任务可以拖动、调整大小，并且其工期和进度不受子任务影响。

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

普通任务特点：
- 可以有1个父任务和任意数量的子任务
- 可以拖动和调整大小
- 不依赖子任务，即使拖动其子任务，任务本身的工期和进度不会相应改变
- 可以在项目任务上显示

### 项目任务

项目任务（`TaskType.PROJECT`）是一种特殊类型的任务，其开始时间取决于最早的子任务开始时间，结束时间取决于最晚的子任务结束时间。项目任务的持续时间依赖于其子任务，并会相应地变化。

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

项目任务特点：
- 可以有1个父任务和任意数量的子任务
- 不能拖动和调整大小
- 依赖于子任务，如果用户拖动子任务，项目任务会相应地调整其持续时间
- 忽略 `startDate`、`endDate`属性
- 项目的进度是独立指定的，不依赖于子任务（如需自动计算，需要自行实现）


### 里程碑

里程碑（`TaskType.MILESTONE`）是一种零持续时间的任务，通常用于标记项目中的重要日期。里程碑在甘特图中以菱形图标表示。

```javascript
// 指定里程碑
const data = [
  { id: 3, text: "Alpha发布", type: "milestone", startDate: "2023-04-14" }
];
```

里程碑特点：
- 可以有1个父任务和任意数量的子任务
- 不能拖动和调整大小
- 具有零持续时间并始终保持这一特性
- 忽略 `endDate`、`progress` 属性

## 任务属性

VTable甘特图中的任务对象可以包含多种属性，以下是完整的属性列表及其用途。

### 必需属性

这些属性必须在数据中定义，否则甘特图将无法正确渲染任务：

| 属性名 | 类型 | 描述 | 配置属性名 |
|-------|------|------| --------- |
| **startDate** | Date \| string | 任务计划开始的日期，可以是日期对象或日期字符串 | taskBar.startDateField |
| **endDate** | Date \| string | 任务计划完成的日期，可以是日期对象或日期字符串 | taskBar.endDateField |
| **任务名[any field name]** | string | 任务的名称或描述文本，用于显示在任务条上 | 无需 |


### 可选属性

这些属性用于扩展任务的功能和视觉表现：

| 属性名 | 类型 | 描述 | 配置属性名 |
|-------|------|------| --------- |
| **任务标识[any field name]** | string \| number | 任务的唯一标识, 依赖关联线需要有相关key的配置| taskKeyField |
| **type** | string | 任务类型，可以是`task`（默认）、`project`或`milestone` | 固定值 |
| **progress** | number | 任务完成的百分比，0-100 | taskBar.progressField |
| **children** | Array | 子任务的数组，用于构建任务层次结构 | 固定值 |
| **hierarchyState** | string | 树结构的展开状态，可以是`expand`或`collapse` | 固定值 |


### 示例

以下是一个包含多种属性的任务数据示例：

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

## 任务树操作

VTable-Gantt甘特图支持树形结构的任务数据，以表示任务之间的父子关系和层次结构。

### 父子任务关系

在VTable-Gantt甘特图中，可以通过`children`属性建立父子任务关系：

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



### 展开/折叠功能

VTable-Gantt甘特图支持树形结构的展开和折叠功能，通过任务的`hierarchyState`属性控制：

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

在`Project_Sub_Tasks_Inline`模式下，可以通过`projectSubTasksExpandable`配置控制项目任务是否可以有展开/折叠的行为：

```javascript
const ganttOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true,  // 允许项目子任务展开/折叠
};
```

当`projectSubTasksExpandable`设置为`true`时（默认值），项目任务可以展开/折叠。当折叠时，子任务将在项目任务行内显示；当展开时，子任务将按照常规树形结构显示。

当`projectSubTasksExpandable`设置为`false`时，项目任务将没有展开收起图标，子任务在项目任务整行内显示。
