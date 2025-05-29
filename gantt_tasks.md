# VTable甘特图(Gantt)任务配置教程

## 目录
- [任务类型](#任务类型)
  - [普通任务](#普通任务)
  - [项目任务](#项目任务)
  - [里程碑](#里程碑)
  - [自定义任务类型](#自定义任务类型)
- [任务属性](#任务属性)
  - [必需属性](#必需属性)
  - [可选属性](#可选属性)
  - [示例](#示例)
- [任务树操作](#任务树操作)
  - [父子任务关系](#父子任务关系)
  - [展开/折叠功能](#展开折叠功能)
  - [层级关系控制](#层级关系控制)
- [任务CRUD操作](#任务crud操作)
  - [创建任务](#创建任务)
  - [读取任务](#读取任务)
  - [更新任务](#更新任务)
  - [删除任务](#删除任务)
- [任务显示模式](#任务显示模式)
  - [Tasks_Separate模式](#tasks_separate模式)
  - [Sub_Tasks_Inline模式](#sub_tasks_inline模式)
  - [Sub_Tasks_Separate模式](#sub_tasks_separate模式)
  - [Sub_Tasks_Arrange模式](#sub_tasks_arrange模式)
  - [Sub_Tasks_Compact模式](#sub_tasks_compact模式)
  - [Project_Sub_Tasks_Inline模式](#project_sub_tasks_inline模式)
- [任务条样式](#任务条样式)
  - [基础样式](#基础样式)
  - [选中状态](#选中状态)
  - [悬停状态](#悬停状态)
  - [自定义布局](#自定义布局)
- [任务依赖关系](#任务依赖关系)
  - [依赖类型](#依赖类型)
  - [创建依赖](#创建依赖)
  - [依赖样式配置](#依赖样式配置)

## 任务类型

在VTable甘特图中，任务分为三种预定义类型，每种类型具有不同的视觉表现和行为特点。任务类型通过数据项中的`type`属性来指定（值存储在`TaskType`枚举中）。

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
- 可以在时间轴中隐藏（取决于显示模式设置）

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
- 默认情况下不能拖动和调整大小（除非显式启用）
- 依赖于子任务，如果用户拖动子任务，项目任务会相应地调整其持续时间
- 忽略 `startDate`、`endDate`、`duration` 属性
- 如果没有子任务，不能拖动
- 项目的进度是独立指定的，默认不依赖于子任务（如需自动计算，需要自行实现）

在VTable甘特图中，项目任务的特殊行为通过`scenegraph/task-bar.ts`文件中的实现来处理，特别是在`initBars`方法中根据任务类型应用不同的渲染逻辑。

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
- 忽略 `endDate`、`duration`、`progress` 属性
- 可以在项目任务上显示
- 可以在时间轴中隐藏（取决于显示模式设置）

里程碑在VTable甘特图中由专门的渲染逻辑处理，在`task-bar.ts`文件中，里程碑的样式由`milestoneStyle`配置项控制，包括边框颜色、填充色、大小等属性。

### 自定义任务类型

VTable甘特图支持自定义任务类型的视觉表现。通过`taskBar`配置中的样式选项和布局渲染函数，可以为不同类型的任务定制外观。

```javascript
// 甘特图配置中自定义任务外观
const ganttOptions = {
  taskBar: {
    barStyle: (args) => {
      // 根据任务类型或其他属性返回不同的样式
      if (args.taskRecord.type === 'meeting') {
        return {
          barColor: '#F2F67E',
          borderColor: '#BFC518',
          cornerRadius: 4
        };
      }
      return defaultTaskBarStyle;
    },
    customLayout: (args) => {
      // 自定义任务条的渲染
      const { width, height, taskRecord, progress } = args;
      
      // 创建自定义图形组件并返回
      const rootContainer = new Group();
      // ... 添加自定义图形
      
      return {
        rootContainer,
        renderDefaultBar: false,
        renderDefaultText: false,
        renderDefaultResizeIcon: false
      };
    }
  }
};
```

自定义类型实现需要：
1. 在数据中设置任务的type属性为自定义值
2. 在甘特图配置中针对该类型实现特定的样式或自定义布局渲染

## 任务属性

VTable甘特图中的任务对象可以包含多种属性，以下是完整的属性列表及其用途。

### 必需属性

这些属性必须在数据中定义，否则甘特图将无法正确渲染任务：

| 属性名 | 类型 | 描述 |
|-------|------|------|
| **id** | string \| number | 任务的唯一标识，如果未设置则自动生成 |
| **startDate** | Date \| string | 任务计划开始的日期，可以是日期对象或日期字符串 |
| **endDate** | Date \| string | 任务计划完成的日期，可以是日期对象或日期字符串（与startDate二选一） |
| **duration** | number | 任务的持续时间（与endDate二选一，将根据startDate和duration计算endDate） |
| **text** | string | 任务的名称或描述文本，用于显示在任务条上 |

### 可选属性

这些属性用于扩展任务的功能和视觉表现：

| 属性名 | 类型 | 描述 |
|-------|------|------|
| **type** | string | 任务类型，可以是`task`（默认）、`project`或`milestone` |
| **progress** | number | 任务完成的百分比，取值范围0-1（例如0.5表示50%） |
| **children** | Array | 子任务的数组，用于构建任务层次结构 |
| **hierarchyState** | string | 树结构的展开状态，可以是`expand`或`collapse` |
| **color** | string | 任务条的自定义颜色 |
| **parent** | string \| number | 父任务的ID，用于构建层次结构（可选，也可用children构建） |

在VTable甘特图中，任务属性的处理主要在`Gantt.ts`和`gantt-helper.ts`文件中实现。比如，在`getTaskInfoByTaskListIndex`方法中，会根据这些属性计算任务的详细信息。

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

VTable甘特图支持树形结构的任务数据，可以表示任务之间的父子关系和层次结构。

### 父子任务关系

在VTable甘特图中，可以通过两种方式建立父子任务关系：

1. **使用children属性**（推荐）：

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

2. **使用parent属性**：

```javascript
const data = [
  { id: 1, text: "父任务" },
  { id: 2, text: "子任务1", startDate: "2023-04-01", endDate: "2023-04-05", parent: 1 },
  { id: 3, text: "子任务2", startDate: "2023-04-06", endDate: "2023-04-10", parent: 1 }
];
```

在内部实现中，VTable甘特图会统一处理这两种方式，构建完整的任务层次结构。

### 展开/折叠功能

VTable甘特图支持树形结构的展开和折叠功能，通过任务的`hierarchyState`属性控制：

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

在`Project_Sub_Tasks_Inline`模式下，可以通过`projectSubTasksExpandable`配置控制项目任务的展开/折叠行为：

```javascript
const ganttOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true,  // 允许项目子任务展开/折叠
};
```

当`projectSubTasksExpandable`设置为`true`时（默认值），项目任务可以展开/折叠。当折叠时，子任务将在项目任务行内显示；当展开时，子任务将按照常规树形结构显示。

### 层级关系控制

VTable甘特图提供了多种方法来控制和操作任务的层级关系：

1. **获取任务的层级关系**：

```javascript
const recordIndex = gantt.getRecordIndexByTaskShowIndex(taskShowIndex);
const record = gantt.getRecordByIndex(taskShowIndex);
const parentRecord = gantt.getRecordByIndex(parentIndex);
```

2. **调整任务顺序**：

通过`DataSource`类中的`adjustOrder`方法，可以调整任务的顺序和层级关系：

```javascript
// 将一个任务从一个位置移动到另一个位置
gantt.data.adjustOrder(sourceIndex, sourceSubTaskIndex, targetIndex, targetSubTaskIndex);
```

3. **任务子任务的操作**：

```javascript
// 获取特定任务的所有子任务
const children = record.children;

// 添加子任务
record.children.push(newTask);

// 更新子任务展开状态
record.hierarchyState = 'expand'; // 或 'collapse'
```

## 任务CRUD操作

VTable甘特图提供了全面的任务创建、读取、更新和删除（CRUD）操作功能。

### 创建任务

VTable甘特图支持多种方式创建新任务：

1. **通过数据添加**：

```javascript
// 添加新任务到现有数据
const newTask = { 
  id: 5, 
  text: "新任务", 
  startDate: "2023-05-01", 
  endDate: "2023-05-10",
  progress: 0
};
gantt.records.push(newTask);
gantt.setRecords(gantt.records); // 刷新甘特图数据
```

2. **通过UI交互创建**：

VTable甘特图支持通过UI交互创建任务，可以通过`taskBar.scheduleCreatable`配置启用此功能：

```javascript
const ganttOptions = {
  taskBar: {
    scheduleCreatable: true, // 允许通过UI创建任务
    scheduleCreation: {
      buttonStyle: {
        backgroundColor: '#4CAF50',
        cornerRadius: 4
      },
      maxWidth: 120,
      minWidth: 60
    }
  }
};
```

当此功能启用时，用户可以在甘特图中点击创建按钮添加新任务。

### 读取任务

VTable甘特图提供了多种方法来读取任务信息：

1. **通过索引获取任务**：

```javascript
// 获取特定索引的任务记录
const record = gantt.getRecordByIndex(taskShowIndex);

// 获取任务详细信息
const taskInfo = gantt.getTaskInfoByTaskListIndex(taskShowIndex, subTaskIndex);
console.log(taskInfo.taskRecord); // 任务数据对象
console.log(taskInfo.startDate);  // 开始日期
console.log(taskInfo.endDate);    // 结束日期
console.log(taskInfo.progress);   // 进度
```

2. **获取任务条位置信息**：

```javascript
// 获取任务条的相对位置和尺寸
const rect = gantt.getTaskBarRelativeRect(taskIndex);
console.log(rect.x, rect.y, rect.width, rect.height);
```

### 更新任务

VTable甘特图支持通过多种方式更新任务：

1. **直接更新任务数据**：

```javascript
// 更新任务记录
const record = gantt.getRecordByIndex(taskShowIndex);
record.text = "更新后的任务名称";
record.progress = 0.8;

// 更新到甘特图
gantt.updateTaskRecord(record, taskShowIndex, subTaskIndex);
```

2. **更新任务日期**：

```javascript
// 更新任务的开始日期
gantt._updateStartDateToTaskRecord(newStartDate, taskIndex, subTaskIndex);

// 更新任务的结束日期
gantt._updateEndDateToTaskRecord(newEndDate, taskIndex, subTaskIndex);

// 同时更新开始和结束日期
gantt._updateStartEndDateToTaskRecord(newStartDate, newEndDate, taskIndex, subTaskIndex);
```

3. **通过UI交互更新**：

VTable甘特图支持通过拖拽任务条来调整任务的开始时间、结束时间和持续时间。这可以通过`taskBar.moveable`和`taskBar.resizable`配置来控制：

```javascript
const ganttOptions = {
  taskBar: {
    moveable: true,           // 允许拖动任务条
    resizable: true,          // 允许调整任务条大小
    moveToExtendDateRange: true  // 拖动超出日期范围时自动扩展范围
  }
};
```

### 删除任务

VTable甘特图支持删除任务：

```javascript
// 从数据中删除任务
const index = gantt.records.findIndex(record => record.id === taskId);
if (index !== -1) {
  gantt.records.splice(index, 1);
  gantt.setRecords(gantt.records); // 刷新甘特图数据
}
```

如需支持通过UI删除任务，可以配置右键菜单：

```javascript
const ganttOptions = {
  taskBar: {
    menu: {
      contextMenuItems: [
        {
          text: "删除任务",
          onClick: (record, index) => {
            // 删除任务的逻辑
            const recordId = record[gantt.parsedOptions.taskKeyField];
            const recordIndex = gantt.records.findIndex(r => r[gantt.parsedOptions.taskKeyField] === recordId);
            if (recordIndex !== -1) {
              gantt.records.splice(recordIndex, 1);
              gantt.setRecords(gantt.records);
            }
          }
        }
      ]
    }
  }
};
```

## 任务显示模式

VTable甘特图提供了多种任务显示模式，可以通过`tasksShowMode`配置项设置。每种模式对任务的展示方式有不同的处理逻辑。

### Tasks_Separate模式

这是默认的显示模式，每个任务节点（包括父任务和子任务）都使用单独的一行来展示。

```javascript
const ganttOptions = {
  tasksShowMode: "Tasks_Separate"
};
```

这种模式下：
- 父任务占用一行
- 每个子任务分别占用一行
- 适合需要清晰展示每个任务的层次结构的场景

### Sub_Tasks_Inline模式

这种模式省去父任务节点不展示，并把所有子任务都放在同一行来展示。

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Inline"
};
```

这种模式下：
- 父任务节点不单独显示
- 所有子任务显示在同一行上
- 适合需要紧凑展示相关任务的场景

### Sub_Tasks_Separate模式

这种模式省去父任务节点不展示，且所有子任务分别用一行展示。

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Separate"
};
```

这种模式下：
- 父任务节点不显示
- 每个子任务分别占用一行
- 适合只关注具体执行任务而非分组的场景

### Sub_Tasks_Arrange模式

这种模式省去父任务节点不展示，且所有子任务会维持records中的数据顺序布局，并保证节点不重叠展示。

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Arrange"
};
```

这种模式下：
- 父任务节点不显示
- 子任务按照数据中的顺序排列
- 自动调整布局避免任务条重叠
- 适合需要保持原始数据顺序的场景

### Sub_Tasks_Compact模式

这种模式省去父任务节点不展示，且所有子任务会按照日期早晚的属性来布局，并保证节点不重叠的紧凑型展示。

```javascript
const ganttOptions = {
  tasksShowMode: "Sub_Tasks_Compact"
};
```

这种模式下：
- 父任务节点不显示
- 子任务按照开始日期排序
- 自动调整布局实现最紧凑的展示
- 适合需要最大化利用空间的场景

### Project_Sub_Tasks_Inline模式

这种模式专门处理项目类型的任务，将项目类型节点的所有子任务都放到主任务的同一行来展示，而其他类型的任务则保持默认的Tasks_Separate模式显示效果。

```javascript
const ganttOptions = {
  tasksShowMode: "Project_Sub_Tasks_Inline",
  projectSubTasksExpandable: true  // 控制项目子任务是否可以展开/折叠
};
```

这种模式下：
- 仅项目类型的任务特殊处理，其他任务正常显示
- 当项目任务折叠时，子任务会内联显示在项目任务行上
- 当项目任务展开时，子任务按照常规树形结构显示
- 通过`projectSubTasksExpandable`配置控制是否支持展开/折叠功能
- 适合需要区别对待项目任务和普通任务的场景

这种显示模式的实现主要在`scenegraph/task-bar.ts`文件的`initBars`方法中，针对`Project_Sub_Tasks_Inline`模式有特殊处理逻辑，检查记录的`hierarchyState`状态和类型来决定如何显示子任务。
