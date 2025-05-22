---
title: 0 VTable Engineering


key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# VTable Engineering Guide Document


This document provides an engineering guide for the VTable project, including how to obtain the source code, install dependencies, run examples, and an overview of the project structure.

## 1. Obtain the Source Code

### Clone the repository from GitHub


```
# 克隆 VTable 仓库
git clone https://github.com/VisActor/VTable.git

# 进入项目目录
cd VTable

```
## 2. Environment Preparation

### Prerequisites


* **Node.js**: Requires Node.js installation, version requirements: `>=14.15.0 <15.0.0 || >=16.13.0 <17.0.0 || >=18.15.0 <19.0.0`

*  **Rush**: VTable uses Microsoft Rush for project management

### Install Rush


```
# 全局安装 Rush
npm install -g @microsoft/rush

```
### Install Project Dependencies


```
# 在 VTable 根目录下执行以下命令，安装所有依赖
rush update

```
## 3. Start Demo


VTable provides rich examples for developers to understand and use.

Execute the following command in the root directory to start the vtable package directory example.

```
# 启动 vtable包目录示例
rushx demo

```
This will start a local development server, usually running at `http://localhost:300*`, which you can access in your browser to view all examples.

### Methods to start examples under different feature packages:

1. Start VTable core library example

```
# 进入 vtable 包目录
cd packages/vtable
# 启动示例
rushx demo

```
2. Start React VTable Example

```
# 进入 react-vtable 包目录
cd packages/react-vtable

# 启动示例
rushx demo

```
3. Start Vue VTable Example

```
# 进入 vue-vtable 包目录
cd packages/vue-vtable

# 启动示例
rushx demo

```
4. Start Vue VTable Example

```
# 进入 vue-vtable 包目录
cd packages/openinula-vtable

# 启动示例
rushx demo

```
5. Start Gantt Chart Example


```
# 进入 vtable-gantt 包目录
cd packages/vtable-gantt

# 启动示例
rushx demo

```
6. Start Calendar Component Example


```
# 进入 vtable-calendar 包目录
cd packages/vtable-calendar

# 启动示例
rushx demo

```
7. Start Plugin Example

```
# 进入 vtable-plugins 包目录
cd packages/vtable-plugins

# 启动示例
rushx demo

```
### Start the Documentation Site


```
# 在项目根目录执行
rush docs

```
This will launch the VTable documentation site, which includes detailed tutorials, API documentation, and examples.

## 4. Command Description


In each package directory, you can execute the following command:

<table><colgroup><col style="width: 365px"><col style="width: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

Command
</td><td rowspan="1" colspan="1">

Instructions
</td></tr><tr><td rowspan="1" colspan="1">

`rushx demo`
</td><td rowspan="1" colspan="1">

Start local example service
</td></tr><tr><td rowspan="1" colspan="1">

`rushx build`
</td><td rowspan="1" colspan="1">

Build Library File
</td></tr><tr><td rowspan="1" colspan="1">

`rushx dev`
</td><td rowspan="1" colspan="1">

Development mode build (watch for file changes)
</td></tr><tr><td rowspan="1" colspan="1">

`rushx test`
</td><td rowspan="1" colspan="1">

Run unit tests
</td></tr><tr><td rowspan="1" colspan="1">

`rushx test-cov`
</td><td rowspan="1" colspan="1">

Run test coverage analysis
</td></tr><tr><td rowspan="1" colspan="1">

`rushx eslint`
</td><td rowspan="1" colspan="1">

Execute code style check
</td></tr><tr><td rowspan="1" colspan="1">

`rushx compile`
</td><td rowspan="1" colspan="1">

Only perform TypeScript type checking
</td></tr></tbody></table>
In the project root directory, you can use the following Rush commands:

<table><colgroup><col style="width: 365px"><col style="width: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

Command
</td><td rowspan="1" colspan="1">

Instructions
</td></tr><tr><td rowspan="1" colspan="1">

`rush start`
</td><td rowspan="1" colspan="1">

Start the demo under the VTable directory of the core package
</td></tr><tr><td rowspan="1" colspan="1">

`rush update`
</td><td rowspan="1" colspan="1">

Install or update all dependencies
</td></tr><tr><td rowspan="1" colspan="1">

`rush build`
</td><td rowspan="1" colspan="1">

Build all projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush rebuild`
</td><td rowspan="1" colspan="1">

Clean and rebuild all projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush test`
</td><td rowspan="1" colspan="1">

Run tests for all projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush change-all`
</td><td rowspan="1" colspan="1">

Update all changelogs after submitting code
</td></tr><tr><td rowspan="1" colspan="1">

`rush docs`
</td><td rowspan="1" colspan="1">

Start the documentation site
</td></tr></tbody></table>
## 5. Project Structure Description


The VTable project adopts a Monorepo structure managed by Rush, mainly consisting of the following parts:

### Top-level Directory Structure


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
### packages directory

The packages directory contains all VTable related packages:

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
### vtable Package Structure


The core vtable package structure is as follows:

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
## 6. Development Process


### Develop New Features or Fix Bugs


1. **Create a branch**: Create a new feature or fix branch from the main branch develop

1. **Development**: Make code modifications and development

1. **Test**: Run unit tests to ensure code quality

1. **Create demo**: Create a new demo in the packages/vtable/examples directory

1. **Compile**: Execute `rushx compile` to ensure the code compiles correctly

1. **Build**: Execute `rushx build` to ensure the code can be built successfully

1. **Submission**: Submit code, be sure to follow submission guidelines

1. **Changelog**: Run `rush change-all` to update the changelog

1. **Submit PR**: Submit a pull request to the main repository

具体过程可以参考官网教程：[贡献者指南](https://www.visactor.io/vtable/contributing/)

### Version Control


VTable uses Rush to manage versions, primarily relying on the version strategy (versionPolicyName) defined in the `rush.json` file.

## 7. Frequently Asked Questions and Solutions

### Dependency Installation Issues


If you encounter issues during the `rush update` process, you can try the following methods:

```
# 清除 Rush 缓存
rush purge

# 重新安装所有依赖
rush update --full

```
### Failed to Start Demo


If there are issues when starting the example, you can check the following points:

1. Does the Node.js version meet the requirements

1. Whether all dependencies have been successfully installed

1. Check console error messages

```
# 重新构建并启动示例
rush build
cd packages/vtable
rushx demo

```
### Build Failed


If the build process fails, you can try the following methods:

```
# 清理构建缓存
rush clean

# 重新构建
rush build

```
## 8. Contributing


We welcome all forms of contributions, including but not limited to submitting issues, improving documentation, fixing bugs, or adding new features.

参与贡献前，请务必阅读[贡献者指南](https://www.visactor.io/vtable/contributing/)，了解贡献流程和规范。

## 9. Resource Links


*  [VTable 官方网站](https://visactor.io/vtable)

*  [GitHub 仓库](https://github.com/VisActor/VTable)

*  [API 文档](https://visactor.io/vtable/option)

*  [示例集合](https://visactor.io/vtable/example)

*  [教程](https://visactor.io/vtable/guide/Getting_Started/Getting_Started)



This document was edited by the following people:

[玄魂](https://github.com/xuanhun)


