---
title: 0 VTable 工程化

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# VTable 工程化指引文档

本文档提供了 VTable 项目的工程化指南，包括如何获取源代码、安装依赖、运行示例以及项目结构的概述。

## 1. 获取源代码

### 从 GitHub 克隆代码库

```
# 克隆 VTable 仓库
git clone https://github.com/VisActor/VTable.git

# 进入项目目录
cd VTable

```
## 2. 环境准备

### 前置要求

*  **Node.js**: 需要安装 Node.js，版本要求：`>=14.15.0 <15.0.0 || >=16.13.0 <17.0.0 || >=18.15.0 <19.0.0`

*  **Rush**: VTable 使用 Microsoft Rush 进行项目管理

### 安装 Rush

```
# 全局安装 Rush
npm install -g @microsoft/rush

```
### 安装项目依赖

```
# 在 VTable 根目录下执行以下命令，安装所有依赖
rush update

```
## 3. 启动 Demo

VTable 提供了丰富的示例供开发者了解和使用。

在根目录执行以下命令，启动 vtable包目录示例。

```
# 启动 vtable包目录示例
rushx demo

```
这将启动一个本地开发服务器，通常在 `http://localhost:300*` 上运行，你可以在浏览器中访问查看所有示例。

### 启动不同功能包下面示例的方法：

1. 启动 VTable 核心库示例

```
# 进入 vtable 包目录
cd packages/vtable
# 启动示例
rushx demo

```
2. 启动 React VTable 示例

```
# 进入 react-vtable 包目录
cd packages/react-vtable

# 启动示例
rushx demo

```
3. 启动 Vue VTable 示例

```
# 进入 vue-vtable 包目录
cd packages/vue-vtable

# 启动示例
rushx demo

```
4. 启动 Vue VTable 示例

```
# 进入 vue-vtable 包目录
cd packages/openinula-vtable

# 启动示例
rushx demo

```
5. 启动甘特图示例

```
# 进入 vtable-gantt 包目录
cd packages/vtable-gantt

# 启动示例
rushx demo

```
6. 启动日历组件示例

```
# 进入 vtable-calendar 包目录
cd packages/vtable-calendar

# 启动示例
rushx demo

```
7. 启动插件示例

```
# 进入 vtable-plugins 包目录
cd packages/vtable-plugins

# 启动示例
rushx demo

```
### 启动文档站点

```
# 在项目根目录执行
rush docs

```
这将启动 VTable 的文档站点，包含详细的教程、API 文档和示例。

## 4. 命令说明

在各个包目录下，你可以执行以下命令：

<table><colgroup><col style="width: 365px"><col style="width: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

命令
</td><td rowspan="1" colspan="1">

说明
</td></tr><tr><td rowspan="1" colspan="1">

`rushx demo`
</td><td rowspan="1" colspan="1">

启动本地示例服务
</td></tr><tr><td rowspan="1" colspan="1">

`rushx build`
</td><td rowspan="1" colspan="1">

构建库文件
</td></tr><tr><td rowspan="1" colspan="1">

`rushx dev`
</td><td rowspan="1" colspan="1">

开发模式构建（监听文件变化）
</td></tr><tr><td rowspan="1" colspan="1">

`rushx test`
</td><td rowspan="1" colspan="1">

运行单元测试
</td></tr><tr><td rowspan="1" colspan="1">

`rushx test-cov`
</td><td rowspan="1" colspan="1">

运行测试覆盖率分析
</td></tr><tr><td rowspan="1" colspan="1">

`rushx eslint`
</td><td rowspan="1" colspan="1">

执行代码风格检查
</td></tr><tr><td rowspan="1" colspan="1">

`rushx compile`
</td><td rowspan="1" colspan="1">

仅执行 TypeScript 类型检查
</td></tr></tbody></table>
在项目根目录，你可以使用以下 Rush 命令：

<table><colgroup><col style="width: 365px"><col style="width: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

命令
</td><td rowspan="1" colspan="1">

说明
</td></tr><tr><td rowspan="1" colspan="1">

`rush start`
</td><td rowspan="1" colspan="1">

启动核心包VTable目录下的demo
</td></tr><tr><td rowspan="1" colspan="1">

`rush update`
</td><td rowspan="1" colspan="1">

安装或更新所有依赖
</td></tr><tr><td rowspan="1" colspan="1">

`rush build`
</td><td rowspan="1" colspan="1">

构建所有项目
</td></tr><tr><td rowspan="1" colspan="1">

`rush rebuild`
</td><td rowspan="1" colspan="1">

清理并重新构建所有项目
</td></tr><tr><td rowspan="1" colspan="1">

`rush test`
</td><td rowspan="1" colspan="1">

运行所有项目的测试
</td></tr><tr><td rowspan="1" colspan="1">

`rush change-all`
</td><td rowspan="1" colspan="1">

在提交代码后更新所有变更日志
</td></tr><tr><td rowspan="1" colspan="1">

`rush docs`
</td><td rowspan="1" colspan="1">

启动文档站点
</td></tr></tbody></table>
## 5. 项目结构说明

VTable 项目采用 Rush 管理的 Monorepo 结构，主要由以下部分组成：

### 顶层目录结构

```
VTable/
  ├── .github/            # GitHub 相关配置
  ├── .vscode/            # VS Code 配置
  ├── common/             # Rush 配置文件和公共依赖
  ├── docs/               # 文档站点源码
  ├── packages/           # 所有包的源代码
  ├── share/              # 共享配置（ESLint、TypeScript等）
  ├── tools/              # 开发工具和脚本
  ├── types/              # 公共类型定义
  ├── CONTRIBUTING.md     # 贡献指南
  ├── README.md           # 项目说明
  └── rush.json           # Rush 配置文件

```
### packages 目录

packages 目录包含所有 VTable 相关的包：

```
packages/
  ├── vtable/             # VTable 核心库
  ├── react-vtable/       # React 集成
  ├── vue-vtable/         # Vue 集成
  ├── openinula-vtable/   # OpenInula 集成
  ├── vtable-gantt/       # 甘特图组件
  ├── vtable-editors/     # 编辑器组件
  ├── vtable-export/      # 导出工具
  ├── vtable-search/      # 搜索工具
  ├── vtable-calendar/    # 日历组件
  └── vtable-plugins/     # 插件集合

```
### vtable 包结构

核心的 vtable 包结构如下：

```
packages/vtable/
  ├── examples/           # 示例代码
  ├── site-demo/          # 站点示例
  ├── src/                # 源代码
  ├── test/               # 测试代码
  ├── nodejs/             # Node.js 环境相关代码
  ├── package.json        # 包配置
  └── README.md           # 说明文档

```
## 6. 开发流程

### 开发新功能或修复 Bug

1. **创建分支**：从主分支develop创建新的功能或修复分支

1. **开发**：进行代码修改和开发

1. **测试**：运行单元测试确保代码质量

1. **创建demo**：在packages/vtable/examples目录下创建新的demo

1. **编译compile**：执行 `rushx compile` 确保代码可以正常编译

1. **构建build**：执行 `rushx build` 确保代码可以正常构建

1. **提交**：提交代码，注意遵循提交规范

1. **更新日志**：运行 `rush change-all` 更新变更日志

1. **提交 PR**：向主仓库提交拉取请求

具体过程可以参考官网教程：[贡献者指南](https://www.visactor.io/vtable/contributing/)

### 版本管理

VTable 使用 Rush 来管理版本，主要依赖于 `rush.json` 文件中定义的版本策略（versionPolicyName）。

## 7. 常见问题与解决方案

### 依赖安装问题

如果在 `rush update` 过程中遇到问题，可以尝试以下方法：

```
# 清除 Rush 缓存
rush purge

# 重新安装所有依赖
rush update --full

```
### 启动 Demo 失败

如果启动示例时出现问题，可以检查以下几点：

1. Node.js 版本是否符合要求

1. 是否已成功安装所有依赖

1. 检查控制台报错信息

```
# 重新构建并启动示例
rush build
cd packages/vtable
rushx demo

```
### 构建失败

如果构建过程失败，可以尝试以下方法：

```
# 清理构建缓存
rush clean

# 重新构建
rush build

```
## 8. 参与贡献

我们欢迎所有形式的贡献，包括但不限于提交问题、改进文档、修复 Bug 或添加新功能。

参与贡献前，请务必阅读[贡献者指南](https://www.visactor.io/vtable/contributing/)，了解贡献流程和规范。

## 9. 资源链接

*  [VTable 官方网站](https://visactor.io/vtable)

*  [GitHub 仓库](https://github.com/VisActor/VTable)

*  [API 文档](https://visactor.io/vtable/option)

*  [示例集合](https://visactor.io/vtable/example)

*  [教程](https://visactor.io/vtable/guide/Getting_Started/Getting_Started)



本文档由以下人员参与编辑：

[玄魂](https://github.com/xuanhun)


