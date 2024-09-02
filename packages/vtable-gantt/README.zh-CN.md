<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Gantt</h1>
</div>

<div align="center">

VTable-Gantt 打造高效、灵活的甘特图解决方案，让项目管理更轻松。通过简单的配置和自定义布局，快速上手并满足各种复杂需求。提升团队协作效率，实现项目进度透明化。.

<p align="center">
  <a href="https://visactor.io/vtable/guide/gantt/introduction">Introduction</a> •
  <a href="https://visactor.io/vtable/demo/gantt/gantt-basic">Demo</a> •
  <a href="https://visactor.io/vtable/guide/gantt/Getting_Started">Tutorial</a> •
  <a href="https://visactor.io/vtable/option/Gantt">API</a>•
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable-gantt.svg)](https://www.npmjs.com/package/@visactor/vtable-gantt)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable-gantt.svg)](https://www.npmjs.com/package/@visactor/vtable-gantt)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

简体中文| [English](./README.md)

</div>

<div align="center">

（video）

</div>

# 介绍

VTable-Gantt 是 VisActor 可视化体系中的甘特图组件库，基于表格组件VTabe和可视化渲染引擎 VRender 进行封装。它专为项目管理和任务跟踪设计，提供了强大的可视化和交互功能。核心能力如下：

1. 高效性能：支持大规模项目数据的快速运算与渲染，确保流畅的用户体验。
2. 灵活布局：支持自定义时间轴、任务条样式和布局，满足不同项目管理需求。
3. 强大交互：提供任务的拖拽、缩放和编辑功能，简化项目管理操作。
4. 丰富的可视化能力：支持信息单元格及任务条的自定义渲染，提供树形结构展示，提升数据展示的多样性和直观性。

# 代码仓库介绍

主要包含以下几个子项目:

1. packages/vtable：表格组件代码
2. packages/vtable-gantt: 甘特图组件代码
3. packages/vtable-editors: 表格编辑器组件代码
4. packages/vtable-export: 表格导出工具代码
5. packages/vtable-search: 表格搜索工具代码
6. packages/react-vtable: React 版本的表格组件
7. packages/vue-vtable: Vue 版本的表格组件
8. docs: 教程文档

# 用法

## 安装

[npm package](https://www.npmjs.com/package/@visactor/vtable)

```bash
// npm
npm install @visactor/vtable-gantt

// yarn
yarn add @visactor/vtable-gantt
```

## 快速上手

```javascript
import {Gantt} from '@visactor/vtable-gantt';

const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0',
  },
  {
    id: 2,
    title: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    start: '07/24/2024',
    end: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-04',
    end: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 4,
    title: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  }
];

const columns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    columns,
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress'
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'day',
        step: 1,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
};
const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID), option);

```

##

[更多 demo 和详细教程](https://visactor.io/vtable)

# 相关链接

- [官网](https://visactor.io/vtable)

# 生态系统

| Project                                                     | Description                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [AI-generated Components](https://visactor.io/ai-vtable)    | AI-generated table component.                                                          |

# 参与贡献

如想参与贡献，请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# 许可证

[MIT 协议](./LICENSE)
