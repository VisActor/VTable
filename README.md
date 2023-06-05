<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns.

<p align="center">
  <a href="">Introduction</a> •
  <a href="">demo</a> •
  <a href="">Tutorial</a> •
  <a href="">API</a>•
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

English| [简体中文](./README.zh-CN.md)

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

# Repo Intro

This repository includes the following packages:

1. vtable: VTable components
2. vtable-docs: VTable documentation

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
import * as VTable from '@visactor/vtable';

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
    },
    {
        "field": "230517143221041",
        "caption": "Profit",
    }
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records:[
      {
      "230517143221027": "CA-2018-156720",
      "230517143221030": "JM-15580",
      "230517143221032": "Bagged Rubber Bands",
      "230517143221040": "3.024",
      "230517143221041": "-0.605"
  },
  {
      "230517143221027": "CA-2018-115427",
      "230517143221030": "EB-13975",
      "230517143221032": "GBC Binding covers",
      "230517143221040": "20.72",
      "230517143221041": "6.475"
  },
  ...
  ],
  columns,
  widthMode:'standard'
};
const tableInstance = new VTable.ListTable(option);




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
