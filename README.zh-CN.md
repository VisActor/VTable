<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable</h1>
</div>

<div align="center">

VTable，不只是一款高性能的多维数据分析表格，更是一个在行列间创作的方格艺术家。

<p align="center">
  <a href="">简介</a> •
  <a href="">demo</a> •
  <a href="">教程</a> •
  <a href="">API</a>•
</p>

![](https://github.com/visactor/vtable/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vtable/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>

<div align="center">

（video）

</div>

# 简介

VTable 是 VisActor 可视化体系中的表格组件库，基于可视化渲染引擎 [VRender](https://github.com/VisActor/VRender) 进行封装。
核心能力如下：
1. 性能极致：支持百万级数据快速运算与渲染
2. 多维分析：多维数据自动分析与呈现
3. 表现力强：提供灵活强大的图形能力，无缝融合[VChart](https://github.com/VisActor/VChart)

# 仓库简介

本仓库包含如下 package

1. vtable 表格组件
2. vtable-docs: 教程文档

# Usage使用

## 安装

[npm package](https://www.npmjs.com/package/@visactor/vtable)

```bash
// npm
npm install @visactor/vtable

// yarn
yarn add @visactor/vtable
```

## 快速上手

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

[更多 demo 和详细教程](https://visactor.io/vtable)
## ⌨️ 开发

首先，全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

接着将代码 clone 至本地：

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
# 相关链接

- [官网](https://visactor.io/vtable)

# 生态

| 项目                                             | 介绍                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| [智能生成组件](https://visactor.io/ai-vtable)    | 基于 AI 的智能表格生成组件                                                |                                                        |

# 参与贡献

如想参与贡献，请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# 许可证

[MIT 协议](./LICENSE)
