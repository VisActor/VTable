---
title: 0 Инженерия VTable


key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Визуализация,Диаграмма,Данные,Таблица,График,ГИС,LLM
---
# Руководство по Инженерии VTable


Этот документ предоставляет инженерное руководство для проекта VTable, включая то, как получить исходный код, установить зависимости, запустить примеры и обзор структуры проекта.

## 1. Получение Исходного Кода

### Клонирование репозитория с GitHub


```
# клонировать репозиторий VTable
git clone https://github.com/VisActor/VTable.git

# войти в каталог проекта
cd VTable

```
## 2. Подготовка Среды

### Предварительные Требования


* **Node.js**: Требуется установка Node.js, требования к версии: `>=14.15.0 <15.0.0 || >=16.13.0 <17.0.0 || >=18.15.0 <19.0.0`

*  **Rush**: VTable uses Microsoft Rush для project management

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
## 3. начало Demo


VTable provides rich examples для developers к understand и use.

Execute Следующий command в the root directory к начало the VTable package directory example.

```
# 启动 vtable包目录示例
rushx demo

```
This will начало a local development server, usually running в `http://localhost:300*`, which Вы можете access в your browser к view все examples.

### Methods к начало examples under different feature packages:

1. начало VTable core library example

```
# 进入 VTable 包目录
cd packages/VTable
# 启动示例
rushx demo

```
2. начало React VTable Example

```
# 进入 react-VTable 包目录
cd packages/react-VTable

# 启动示例
rushx demo

```
3. начало Vue VTable Example

```
# 进入 vue-VTable 包目录
cd packages/vue-VTable

# 启动示例
rushx demo

```
4. начало Vue VTable Example

```
# 进入 vue-VTable 包目录
cd packages/openinula-VTable

# 启动示例
rushx demo

```
5. начало Gantt Chart Example


```
# 进入 VTable-gantt 包目录
cd packages/VTable-gantt

# 启动示例
rushx demo

```
6. начало Calendar Component Example


```
# 进入 VTable-calendar 包目录
cd packages/VTable-calendar

# 启动示例
rushx demo

```
7. начало Plugin Example

```
# 进入 VTable-plugins 包目录
cd packages/VTable-plugins

# 启动示例
rushx demo

```
### начало the Documentation Site


```
# 在项目根目录执行
rush docs

```
This will launch the VTable documentation site, which includes detailed tutorials, API documentation, и examples.

## 4. Command Description


в каждый package directory, Вы можете execute Следующий command:

<table><colgroup><col style="ширина: 365px"><col style="ширина: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

Command
</td><td rowspan="1" colspan="1">

Instructions
</td></tr><tr><td rowspan="1" colspan="1">

`rushx demo`
</td><td rowspan="1" colspan="1">

начало local example service
</td></tr><tr><td rowspan="1" colspan="1">

`rushx build`
</td><td rowspan="1" colspan="1">

Build Library File
</td></tr><tr><td rowspan="1" colspan="1">

`rushx dev`
</td><td rowspan="1" colspan="1">

Development mode build (watch для file changes)
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

Only perform TypeScript тип checking
</td></tr></tbody></table>
в the project root directory, Вы можете use Следующий Rush commands:

<table><colgroup><col style="ширина: 365px"><col style="ширина: 365px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

Command
</td><td rowspan="1" colspan="1">

Instructions
</td></tr><tr><td rowspan="1" colspan="1">

`rush начало`
</td><td rowspan="1" colspan="1">

начало the demo under the VTable directory из the core package
</td></tr><tr><td rowspan="1" colspan="1">

`rush update`
</td><td rowspan="1" colspan="1">

Install или update все dependencies
</td></tr><tr><td rowspan="1" colspan="1">

`rush build`
</td><td rowspan="1" colspan="1">

Build все projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush rebuild`
</td><td rowspan="1" colspan="1">

Clean и rebuild все projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush test`
</td><td rowspan="1" colspan="1">

Run tests для все projects
</td></tr><tr><td rowspan="1" colspan="1">

`rush change-все`
</td><td rowspan="1" colspan="1">

Update все changelogs after submitting code
</td></tr><tr><td rowspan="1" colspan="1">

`rush docs`
</td><td rowspan="1" colspan="1">

начало the documentation site
</td></tr></tbody></table>
## 5. Project Structure Description


The VTable project adopts a Monorepo structure managed по Rush, mainly consisting из Следующий parts:

### верх-level Directory Structure


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

The packages directory contains все VTable related packages:

```
packages/
  ├── VTable/             # VTable 核心库
  ├── react-VTable/       # React 集成
  ├── vue-VTable/         # Vue 集成
  ├── openinula-VTable/   # OpenInula 集成
  ├── VTable-gantt/       # 甘特图组件
  ├── VTable-editors/     # 编辑器组件
  ├── VTable-export/      # 导出工具
  ├── VTable-search/      # 搜索工具
  ├── VTable-calendar/    # 日历组件
  └── VTable-plugins/     # 插件集合

```
### VTable Package Structure


The core VTable package structure is as follows:

```
packages/VTable/
  ├── examples/           # 示例代码
  ├── site-demo/          # 站点示例
  ├── src/                # 源代码
  ├── test/               # 测试代码
  ├── nodejs/             # Node.js 环境相关代码
  ├── package.json        # 包配置
  └── README.md           # 说明文档

```
## 6. Development Process


### Develop новый Features или Fix Bugs


1. **Create a branch**: Create a новый feature или fix branch от the main branch develop

1. **Development**: Make code modifications и development

1. **Test**: Run unit tests к ensure code quality

1. **Create demo**: Create a новый demo в the packages/VTable/examples directory

1. **Compile**: Execute `rushx compile` к ensure the code compiles correctly

1. **Build**: Execute `rushx build` к ensure the code can be built successfully

1. **Submission**: Submit code, be sure к follow submission guidelines

1. **Changelog**: Run `rush change-все` к update the changelog

1. **Submit PR**: Submit a pull request к the main repository

具体过程可以参考官网教程：[贡献者指南](https://www.visactor.io/VTable/contributing/)

### Version Control


VTable uses Rush к manage versions, primarily relying на the version strategy (versionPolicyName) defined в the `rush.json` file.

## 7. Frequently Asked Questions и Solutions

### Dependency Installation Issues


If you encounter issues during the `rush update` process, Вы можете try Следующий methods:

```
# 清除 Rush 缓存
rush purge

# 重新安装所有依赖
rush update --full

```
### Failed к начало Demo


If there are issues when starting the example, Вы можете check Следующий points:

1. Does the Node.js version meet the requirements

1. Whether все dependencies have been successfully installed

1. Check console ошибка messages

```
# 重新构建并启动示例
rush build
cd packages/VTable
rushx demo

```
### Build Failed


If the build process fails, Вы можете try Следующий methods:

```
# 清理构建缓存
rush clean

# 重新构建
rush build

```
## 8. Contributing


We welcome все forms из contributions, including but не limited к submitting issues, improving documentation, fixing bugs, или adding новый features.

参与贡献前，请务必阅读[贡献者指南](https://www.visactor.io/VTable/contributing/)，了解贡献流程和规范。

## 9. Resource Links


*  [VTable 官方网站](https://visactor.io/VTable)

*  [GitHub 仓库](https://github.com/VisActor/VTable)

*  [API 文档](https://visactor.io/VTable/option)

*  [示例集合](https://visactor.io/VTable/example)

*  [教程](https://visactor.io/VTable/guide/Getting_Started/Getting_Started)



This document was edited по Следующий people:

[玄魂](https://github.com/xuanhun)


