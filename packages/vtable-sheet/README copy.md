<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Gantt</h1>
</div>

<div align="center">

VTable-Gantt create an efficient and flexible Gantt chart solution to make project management easier. Through simple configuration and custom layout, you can quickly get started and meet various complex needs. Improve team collaboration efficiency and achieve transparency of project progress.

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

English| [简体中文](./README.zh-CN.md)

</div>

<div align="center">

（video）

</div>

# Introduction

VTable-Gantt is a Gantt chart component library in the VisActor visualization system, based on the table component VTable and the visualization rendering engine VRender. It is designed specifically for project management and task tracking, providing powerful visualization and interaction features. The core capabilities are as follows:

1. High performance: Supports fast computation and rendering of large-scale project data, ensuring a smooth user experience.
2. Flexible layout: Supports custom timeline, task bar styles, and layouts to meet different project management needs.
3. Powerful interaction: Provides drag-and-drop, zoom, and edit functions for tasks, simplifying project management operations.
4. Rich visualization capabilities: supports custom rendering of information cells and task bars, provides tree structure display, and improves the diversity and intuitiveness of data display.

# Repo Intro

This repository includes the following packages:

1. packages/vtable: The core code repository of VTable
2. packages/vtable-gantt: Gantt chart component code
3. packages/vtable-editors: Table editor component code
4. packages/vtable-export: Table export tool code
5. packages/vtable-search: Table search tool code
6. packages/react-vtable: React version of the table component
7. packages/vue-vtable: Vue version of the table component
8. docs: Include VTable site tutorials, demos,apis and options, and also contains all Chinese and English documents.

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vtable)

```bash
// npm
npm install @visactor/vtable-gantt

// yarn
yarn add @visactor/vtable-gantt
```

## Quick Start

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

[More demos and detailed tutorials](https://visactor.io/vtable)

# Related Links

- [Official website](https://visactor.io/vtable)

# Ecosystem

| Project                                                     | Description                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [AI-generated Components](https://visactor.io/ai-vtable)    | AI-generated table component.                                                          |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) 和 [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# License

[MIT License](./LICENSE)
