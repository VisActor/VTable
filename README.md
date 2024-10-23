<div align="center">
   <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns.

<p align="center">
  <a href="https://visactor.io/vtable">Introduction</a> •
  <a href="https://visactor.io/vtable/example">demo</a> •
  <a href="https://visactor.io/vtable/guide/Getting_Started/Getting_Started">Tutorial</a> •
  <a href="https://visactor.io/vtable/option/ListTable">API</a>•
</p>

![](https://github.com/visactor/vtable/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vtable/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md)

</div>

<div align="center">

（video）

</div>

# Introduction

VTable is based on visual rendering engine [VRender](https://github.com/VisActor/VRender).

The core capabilities are as follows:

1. Extreme performance: Supports fast computation and rendering of millions of data points.
2. Multidimensional analysis: Automatically analyzes and presents multidimensional data.
3. Strong expressiveness: Provides flexible and powerful graphic capabilities, seamlessly integrating with charts of [VChart](https://github.com/VisActor/VChart).

# Repository Introduction

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
npm install @visactor/vtable

// yarn
yarn add @visactor/vtable
```

## Quick Start

```javascript
// this demo you can run on codesanbox https://codesandbox.io/s/vtable-simple-demo-g8q738
import * as VTable from '@visactor/vtable';

const columns = [
  {
    field: 'Order ID',
    caption: 'Order ID'
  },
  {
    field: 'Customer ID',
    caption: 'Customer ID'
  },
  {
    field: 'Product Name',
    caption: 'Product Name'
  },
  {
    field: 'Sales',
    caption: 'Sales'
  },
  {
    field: 'Profit',
    caption: 'Profit'
  }
];

const option = {
  container: document.getElementById(CONTAINER_ID),
  records: [
    {
      'Order ID': 'CA-2018-156720',
      'Customer ID': 'JM-15580',
      'Product Name': 'Bagged Rubber Bands',
      Sales: '3.024',
      Profit: '-0.605'
    },
    {
      'Order ID': 'CA-2018-115427',
      'Customer ID': 'EB-13975',
      'Product Name': 'GBC Binding covers',
      Sales: '20.72',
      Profit: '6.475'
    }
    // ...
  ],
  columns
};
const tableInstance = new VTable.ListTable(option);
```

##

[More demos and detailed tutorials](https://visactor.io/vtable)

# ⌨️ Development

First of all, please install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

Then clone locally:

```bash
# clone
$ git clone git@github.com:VisActor/VTable.git
$ cd VTable
# install dependencies
$ rush update
# start vtable demo
$ cd packages/vtable
# execute in file path: ./packages/vtable
$ rushx demo
# start site development server, execute in file path: ./
$ rush docs
# after execut git commit, please run the following command to update the change log. Please execute in file path: ./
$ rush change-all
```

# 📖 Documents

After installation & clone & update, run docs to preview VTable documents locally.

```bash
# start vtable document server. execute in file path: ./
$ rush docs
```

## 🔗 Related Links

- [Official website](https://visactor.io/vtable)
- [Usage Trend](https://npm-compare.com/@visactor/vtable)

# 💫 Ecosystem

| Project                                                                      | Description               |
| ---------------------------------------------------------------------------- | ------------------------- |
| [React-VTable](https://www.visactor.io/vtable/guide/Developer_Ecology/react) | VTable in React component |

# ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=visactor/vtable&type=Date)](https://star-history.com/#visactor/vtable&Date)

# 🤝 Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) and [ Guide](./CONTRIBUTING.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# License

[MIT License](./LICENSE)
