<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Plugins</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns.React-VTable is a React wrapper of VTable.

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/react-vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/react-vvtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

# Usage

## 可选依赖

部分高级功能需要额外的依赖：

- **甘特图导出功能**：需要安装 `@visactor/vtable-gantt`

  ```bash
  npm install @visactor/vtable-gantt
  ```
  
  可以通过两种方式使用：
  
  1. 直接从主包导入（推荐，自动处理依赖缺失情况）：
  ```js
  import { ExportGanttPlugin } from '@visactor/vtable-plugins';
  
  const exportPlugin = new ExportGanttPlugin();
  // 如果未安装甘特图依赖，会收到友好的警告信息
  ```
  
  2. 从专用入口导入（明确表示需要额外依赖）：
  ```js
  import { ExportGanttPlugin } from '@visactor/vtable-plugins/gantt-extensions';
  ```

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vtable-search)

```bash
// npm
npm install @visactor/vtable-plugins

// yarn
yarn add @visactor/vtable-plugins
```

##

[More demos and detailed tutorials](https://visactor.io/vtable)

# Related Links

- [Official website](https://visactor.io/vtable)

# Ecosystem

| Project                                                  | Description                   |
| -------------------------------------------------------- | ----------------------------- |
| [AI-generated Components](https://visactor.io/ai-vtable) | AI-generated table component. |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) 和 [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# License

- **MIT License** - [LICENSE](../../LICENSE)
- **Apache 2.0 License** - [LICENSE-APACHE](./LICENSE-APACHE)

> **Note**: The auto-fill functionality references [Univer](https://github.com/dream-num/univer)'s implementation and is subject to Apache 2.0 license terms.
