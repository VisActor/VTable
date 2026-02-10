# VTable 整体架构概览

## 项目简介

VTable 是一款基于 VRender Canvas 引擎构建的高性能多维数据分析表格组件。它支持百万级数据量的流畅渲染，提供丰富的单元格类型和强大的自定义能力。

## 核心包

| 包名 | npm 包名 | 说明 |
|---|---|---|
| vtable | `@visactor/vtable` | 核心表格库 |
| vtable-editors | `@visactor/vtable-editors` | 编辑器组件（输入框、日期选择等） |
| vtable-export | `@visactor/vtable-export` | 导出功能（Excel、CSV） |
| vtable-search | `@visactor/vtable-search` | 搜索高亮功能 |
| vtable-plugins | `@visactor/vtable-plugins` | 官方插件集 |
| vtable-gantt | `@visactor/vtable-gantt` | 甘特图组件 |
| vtable-calendar | `@visactor/vtable-calendar` | 日历组件 |
| react-vtable | `@visactor/react-vtable` | React 封装 |
| vue-vtable | `@visactor/vue-vtable` | Vue 封装 |
| openinula-vtable | `@visactor/openinula-vtable` | OpenInula 封装 |

## 三种核心表格类型

### 1. ListTable — 基本表格
用于展示扁平的列表数据，类似传统的 HTML table。

```typescript
import { ListTable } from '@visactor/vtable';

const table = new ListTable({
  container: document.getElementById('container'),
  records: [{ name: 'Alice', age: 25 }],
  columns: [
    { field: 'name', title: '姓名', cellType: 'text' },
    { field: 'age', title: '年龄', cellType: 'text' }
  ]
});
```

**适用场景**: 数据列表、可编辑表格、树形表格、分组表格

### 2. PivotTable — 透视表
用于多维数据分析，支持行/列维度交叉展示。

```typescript
import { PivotTable } from '@visactor/vtable';

const table = new PivotTable({
  container: document.getElementById('container'),
  records: data,
  rows: ['region', 'city'],
  columns: ['category'],
  indicators: [{ indicatorKey: 'sales', title: '销售额' }]
});
```

**适用场景**: 数据聚合分析、多维度交叉报表

### 3. PivotChart — 透视图
在透视表的基础上嵌入 VChart 图表，实现图表矩阵。

```typescript
import { PivotChart } from '@visactor/vtable';

const table = new PivotChart({
  container: document.getElementById('container'),
  records: data,
  rows: ['region'],
  columns: ['category'],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: { type: 'bar' }
  }]
});
```

**适用场景**: 图表矩阵、多维图表分析

## 类型继承体系

```
BaseTableConstructorOptions          ← 公共配置（container, theme, widthMode, hover, select, menu...）
  ├── ListTableConstructorOptions    ← records, columns, transpose, sortState, editor, pagination...
  ├── PivotTableConstructorOptions   ← rows, columns, indicators, rowTree, columnTree, dataConfig, corner...
  └── PivotChartConstructorOptions   ← 同 PivotTable + axes, chartDimensionLinkage
```

## 核心导出

```typescript
// 表格类
import { ListTable, PivotTable, PivotChart } from '@visactor/vtable';

// 类型命名空间
import type * as VTable from '@visactor/vtable';

// 内置主题
import { themes } from '@visactor/vtable';
// themes.DEFAULT, themes.ARCO, themes.BRIGHT, themes.DARK, themes.SIMPLIFY

// 注册系统
import { register } from '@visactor/vtable';
// register.bindChartModule(VChart) — 注册 VChart 模块用于 PivotChart

// JSX 布局原语
import { Group, Text, Rect, Circle, Image, Tag, Line, Checkbox, Radio } from '@visactor/vtable';
```

## 渲染架构

VTable 基于 Canvas 场景图（Scenegraph）模式渲染：
1. **数据层**: DataSource / records → 数据管理
2. **布局层**: LayoutMap → 行列映射、合并计算
3. **场景图层**: Scenegraph → Group/Cell 节点树
4. **渲染层**: VRender → Canvas 绑定绘制

## 源码目录结构（packages/vtable/src/）

| 目录 | 说明 |
|---|---|
| `ts-types/` | 用户可见的 TypeScript 类型定义 |
| `core/` | 核心基础类（BaseTable、动画、样式计算） |
| `scenegraph/` | 场景图渲染系统 |
| `event/` | 事件系统（鼠标、键盘、滚动） |
| `state/` | 状态管理（选择、hover、冻结、排序） |
| `data/` | 数据源抽象 |
| `dataset/` | 数据集与统计 |
| `layout/` | 布局计算 |
| `themes/` | 内置主题定义 |
| `render/` | 渲染布局与 JSX |
| `components/` | 内置组件（tooltip, menu, legend, title） |
| `plugins/` | 插件系统 |
| `edit/` | 编辑管理 |
| `body-helper/` | body 区域样式计算 |
| `header-helper/` | 表头区域样式计算 |
| `tools/` | 工具函数 |
