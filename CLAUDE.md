# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VTable is a high-performance multidimensional data analysis table component built on the VRender canvas engine. This is a Rush monorepo containing the core VTable library and related packages.

## Essential Commands

### Development Setup
```bash
# Install dependencies (required first time and after package.json changes)
rush update

# Build all packages
rush build

# Start development server for core vtable package
cd packages/vtable && rushx demo

# Start documentation site
rush docs

# Run tests
rush test

# Run linting
rush eslint

# Fix dependency issues
rush purge && rush update
```

### Working with Individual Packages
```bash
# Build specific package
cd packages/[package-name] && rushx build

# Run tests for specific package
cd packages/[package-name] && rushx test

# Start demo for specific package
cd packages/[package-name] && rushx demo
```

### Git Workflow
```bash
# After making changes, update changelogs before committing
rush change-all

# Commit with conventional message format
git commit -m "type: description"
```

## Architecture Overview

### Package Structure
- **packages/vtable**: Core VTable library with ListTable, PivotTable, and PivotChart components
- **packages/vtable-gantt**: Gantt chart component
- **packages/vtable-editors**: Table editor components
- **packages/vtable-plugins**: Plugin system for extending functionality
- **packages/vtable-export**: Export functionality (Excel, CSV, etc.)
- **packages/vtable-search**: Search capabilities
- **packages/vtable-calendar**: Calendar component
- **packages/vtable-sheet**: Spreadsheet functionality (current development branch)
  - **项目特性**: 电子表格组件，支持多sheet tab页签管理
  - **核心架构**:
    - `workSheetInstances`: 管理所有sheet tab实例的核心容器
    - `work-sheet`: 单个sheet页签的实现，包含对应vtable实例
  - **依赖关系**: 依赖vtable核心插件系统，需先安装vtable插件
  - **当前开发重点**: 跨sheet tab公式计算支持
  - **技术实现**: 基于VTable核心库扩展，每个sheet对应独立的VTable实例
- **packages/react-vtable**: React wrapper
- **packages/vue-vtable**: Vue wrapper
- **packages/openinula-vtable**: OpenInula wrapper

### Core Architecture
The library is built on a canvas-based rendering system using VRender:

1. **Table Types**:
   - `ListTable`: Basic table with columns and rows
   - `PivotTable`: Multi-dimensional data analysis
   - `PivotChart`: Chart integration with tables

2. **Rendering Pipeline**:
   - Scenegraph-based rendering in `src/scenegraph/`
   - Canvas-based graphics using VRender engine
   - Custom layout system in `src/render/layout/`

3. **Data Management**:
   - Data source abstraction in `src/data/`
   - Statistics and aggregation in `src/dataset/`
   - Event system for data updates

4. **Extension Points**:
   - Plugin system for custom functionality
   - Theme system for styling
   - Custom cell renderers and editors

### Testing Strategy
- **Framework**: Jest with ts-jest preset
- **Environment**: jest-electron for DOM/canvas testing
- **Coverage Requirements**: 60% minimum for all metrics
- **Test Location**: `__tests__/` directories within each package

### Key Dependencies
- **@visactor/vrender-***: Canvas rendering engine (v1.0.14)
- **@visactor/vutils**: Utility functions (~0.19.1)
- **lodash**: Utility library (4.17.21)

### Development Notes
- This is a Rush monorepo - always use `rush` commands instead of npm/yarn directly
- Current branch: `feat/vtable-sheet` (spreadsheet functionality)
- Main branches: `main`, `develop`
- Node.js versions supported: 14.15.0+, 16.13.0+, 18.15.0+

## vtable-sheet 项目详细信息

### 项目路径
`/Users/bytedance/VisActor/VTable/packages/vtable-sheet`

### 核心功能需求
- **跨sheet tab公式计算支持**: 实现不同sheet页签间的公式引用和计算
- **多页签管理**: 支持创建、切换、删除sheet页签
- **数据同步**: 确保跨sheet数据引用的实时更新

### 技术架构
- **核心入口**: vtable-sheet文件是整个组件的入口点
- **实例管理**: workSheetInstances负责管理所有sheet实例
- **单sheet实现**: 每个work-sheet包含独立的VTable实例
- **插件依赖**: 依赖VTable核心插件系统提供基础功能

### 跨Sheet公式功能实现

#### 新增核心组件
1. **CrossSheetFormulaManager** (`src/formula/cross-sheet-formula-manager.ts`)
   - 管理跨Sheet公式引用关系
   - 处理依赖关系映射和缓存
   - 支持公式验证和错误处理

2. **CrossSheetDataSynchronizer** (`src/formula/cross-sheet-data-synchronizer.ts`)
   - 处理跨Sheet数据同步
   - 支持批量数据更新
   - 提供实时更新通知机制

3. **CrossSheetFormulaValidator** (`src/formula/cross-sheet-formula-validator.ts`)
   - 验证跨Sheet公式语法
   - 检测循环依赖
   - 提供详细的错误信息

4. **CrossSheetFormulaHandler** (`src/formula/cross-sheet-formula-handler.ts`)
   - 统一的跨Sheet公式处理接口
   - 集成缓存、验证、同步功能
   - 提供高性能的计算引擎

#### 支持的公式类型
- **基本引用**: `=Sheet1!A1`, `=Sheet2!B2:C4`
- **函数计算**: `=SUM(Sheet1!A1:A10)`, `=AVERAGE(Sheet1!B1:B10)`
- **跨表运算**: `=Sheet1!A1 + Sheet2!B1`
- **条件判断**: `=IF(Sheet1!A1>100, "达标", "未达标")`
- **复杂嵌套**: `=IF(AVERAGE(Sheet1!A1:A10)>50, SUM(Sheet1!B1:B10)*1.1, SUM(Sheet1!B1:B10))`

#### 核心功能特性
- ✅ **实时计算**: 源数据变化时自动更新依赖公式
- ✅ **智能缓存**: 1秒TTL缓存机制，平衡性能与实时性
- ✅ **错误处理**: 完善的错误检测和提示机制
- ✅ **依赖管理**: 自动识别和管理跨Sheet依赖关系
- ✅ **批量处理**: 支持批量公式计算和数据更新
- ✅ **性能优化**: 异步处理，避免阻塞UI

#### 使用示例
```typescript
// 设置跨Sheet公式
const cell = { sheet: 'Summary', row: 1, col: 1 };
const formula = '=SUM(SalesData!B2:E4)';
await formulaManager.setCrossSheetFormula(cell, formula);

// 获取计算结果
const result = await formulaManager.getCrossSheetValue(cell);
console.log(result.value); // 计算结果
console.log(result.calculationTime); // 计算耗时

// 验证公式
const validation = formulaManager.validateCrossSheetFormula(cell);
console.log(validation.valid); // 是否有效

// 获取依赖关系
const dependencies = formulaManager.getCrossSheetDependencies();
```

#### 测试覆盖
- **单元测试**: `__tests__/cross-sheet-formula-simple.test.ts`
- **集成测试**: `__tests__/integration/cross-sheet-integration.test.ts`
- **演示页面**: `examples/cross-sheet-demo.html`
- **使用文档**: `docs/cross-sheet-formula-guide.md`

#### 性能指标
- 100个跨Sheet公式计算 < 5秒
- 20个公式批量重新计算 < 2秒
- 缓存命中率 > 80%
- 内存使用优化，支持大规模数据


#### 使用限制
- 跨Sheet公式目前主要用于读取操作，写入操作仍在原Sheet中进行
- 复杂的跨Sheet引用可能需要异步处理以获得最佳性能
- 循环依赖检测基于静态分析，运行时循环依赖需要额外的错误处理