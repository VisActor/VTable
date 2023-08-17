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
  <a href="">Introduction</a> •
  <a href="">demo</a> •
  <a href="">Tutorial</a> •
  <a href="">API</a>•
</p>

![](https://github.com/visactor/vtable/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vtable/actions/workflows/unit-test.yml/badge.svg)
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
// this demo you can run on codesanbox https://codesandbox.io/s/vtable-simple-demo-g8q738
import * as VTable from '@visactor/vtable';

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
    },
    {
        "field": "Sales",
        "caption": "Sales",
    },
    {
        "field": "Profit",
        "caption": "Profit",
    }
];

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:[
    {
      "Order ID": "CA-2018-156720",
      "Customer ID": "JM-15580",
      "Product Name": "Bagged Rubber Bands",
      "Sales": "3.024",
      "Profit": "-0.605"
    },
    {
      "Order ID": "CA-2018-115427",
      "Customer ID": "EB-13975",
      "Product Name": "GBC Binding covers",
      "Sales": "20.72",
      "Profit": "6.475"
    },
    // ...
  ],
  columns,
};
const tableInstance = new VTable.ListTable(option);

```

##

[More demos and detailed tutorials](https://visactor.io/vtable)

## ⌨️ Development

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
$ rushx demo
```
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
