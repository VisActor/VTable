# 表格组件介绍

VTable-Sheet是一个功能强大的电子表格组件，基于VTable构建，提供类似Excel的交互体验。它不仅支持基础的数据展示功能，还包括多表格页管理、单元格编辑、公式计算、数据过滤等高级特性。

## 特性一览

- **多表格页管理**：支持创建和管理多个表格页，轻松组织大量数据
- **公式计算**：提供类Excel的公式功能，支持SUM、AVERAGE、MAX、MIN、COUNT等常用函数
- **数据过滤**：支持按条件过滤和值列表过滤，快速查找所需数据
- **表格编辑**：支持单元格内容编辑，轻松修改数据
- **数据导入导出**：支持导入和导出CSV、XLSX格式数据
- **数据持久化**：支持保存和恢复表格状态
- **单元格合并**：支持合并单元格，更灵活地展示数据
- **冻结行列**：支持冻结首行首列，方便查看大型数据集
- **自定义菜单**：支持自定义顶部菜单栏，扩展功能

## 适用场景

VTable-Sheet组件适用于需要在Web应用中提供类Excel表格功能的场景，例如：

- 数据分析工具
- 财务报表系统
- 项目管理工具
- 在线电子表格应用
- 业务数据管理系统

## 组件架构

VTable-Sheet基于VTable构建，采用模块化设计，主要包含以下核心部分：

- Sheet管理器：负责多表格页的创建和切换
- 公式管理器：处理公式的解析和计算
- 菜单管理器：处理自定义菜单操作
- 事件管理器：统一处理用户交互事件

内部核心功能依赖了VTable的插件，具体请参考：[VTable插件](../plugin/usge)。

VTable-Sheet中使用的插件列表：
- [filter-plugin](../plugin/filter)
- [table-series-number-plugin](../plugin/table-series-number)
- [highlight-header-when-select-cell-plugin](../plugin/header-highlight)
- [context-menu-plugin](../plugin/context-menu)
- [table-export-plugin](../plugin/table-export)
- [table-import-plugin](../plugin/excel-import)


接下来的章节将详细介绍VTable-Sheet的基本用法和各项高级功能。

