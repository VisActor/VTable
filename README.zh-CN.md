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

VTable，不只是一款高性能的多维数据分析表格，更是一个在行列间创作的方格艺术家。

<p align="center">
  <a href="https://visactor.io/vtable">简介</a> •
  <a href="https://visactor.io/vtable/example">demo</a> •
  <a href="https://visactor.io/vtable/guide/Getting_Started/Getting_Started">教程</a> •
  <a href="https://visactor.io/vtable/option/ListTable">API</a>•
</p>

![](https://github.com/visactor/vtable/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vtable/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文 | [日本語](./README.ja-JP.md)

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

1. packages/vtable：表格组件代码
2. packages/vtable-gantt: 甘特图组件代码
3. packages/vtable-editors: 表格编辑器组件代码
4. packages/vtable-export: 表格导出工具代码
5. packages/vtable-search: 表格搜索工具代码
6. packages/react-vtable: React 版本的表格组件
7. packages/vue-vtable: Vue 版本的表格组件
8. docs: 教程文档

# Usage 使用

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

[更多 demo 和详细教程](https://visactor.io/vtable)

# ⌨️ 开发

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
# execute in file path: ./packages/vtable
$ rushx demo
# start site development server, execute in file path: ./
$ rush docs
# after execut git commit, please run the following command to update the change log. Please execute in file path: ./
$ rush change-all
```

# 📖 Documents

安装并且更新依赖后，可以执行 docs 命令，开启 VTable 的本地文档预览

```bash
# start vtable document server. execute in file path: ./
$ rush docs
```

# 🔗 相关链接

- [官网](https://visactor.io/vtable)
- [使用趋势](https://npm-compare.com/@visactor/vtable)

# 💫 生态系统

| Project                                                                      | Description       |
| ---------------------------------------------------------------------------- | ----------------- |
| [React-VTable](https://www.visactor.io/vtable/guide/Developer_Ecology/react) | VTable React 组件 |

# ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=visactor/vtable&type=Date)](https://star-history.com/#visactor/vtable&Date)

# 🤝 参与贡献

如想参与贡献，请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# 许可证

[MIT 协议](./LICENSE)
