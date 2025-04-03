## 基本表格表头分组及折叠

在本教程中，我们将学习如何使用 VTable 实现多层表头分组及折叠功能，通过树形结构展示复杂表头层级。

## 使用场景

表头分组及折叠功能适用于以下场景：

- **多维数据分析**：需要将多个关联字段合并为逻辑分组（如“销售数据”包含“销售额”“利润”等子列）。
- **复杂数据结构**：数据表字段具有明确的层级关系（如“地区-省份-城市”三级结构）。
- **空间优化**：通过折叠功能隐藏非关键列，提升表格可读性。
- **动态交互**：允许用户按需展开/收起特定分组，灵活查看数据。

## 使用方式

### 1. 配置多层表头结构

在 `columns` 配置中使用嵌套结构定义表头层级。每个分组通过 `columns` 字段添加子列，形成树形关系。

### 2. 启用树形折叠功能

设置 `headerHierarchyType: 'grid-tree'` 开启表头树形折叠交互。

### 3. 设置默认展开层级

通过 `headerExpandLevel` 指定初始展开层级（默认值为 `1`，即仅展示第一级分组）。

## 示例

```javascript livedemo template=vtable
const records = [
  { region: 'North', province: 'A', city: 'City1', revenue: 1000, cost: 600 },
  { region: 'North', province: 'A', city: 'City2', revenue: 1500, cost: 800 },
  { region: 'South', province: 'B', city: 'City3', revenue: 2000, cost: 1100 }
];

const columns = [
  {
    title: 'Region',
    field: 'region',
    width: 150,
    columns: [
      {
        title: 'Province',
        field: 'province',
        width: 150,
        columns: [
          {
            title: 'City',
            field: 'city',
            width: 150
          }
        ]
      }
    ]
  },
  {
    title: 'Financial Metrics',
    field: 'metrics',
    width: 180,
    columns: [
      { title: 'Revenue', field: 'revenue', width: 150 },
      { title: 'Cost', field: 'cost', width: 150 }
    ]
  }
];

const option = {
  records,
  columns,
  headerHierarchyType: 'grid-tree', // 启用树形折叠
  headerExpandLevel: 2, // 默认展开至第二级
  widthMode: 'standard',
  defaultRowHeight: 40
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

---

## 高级配置

### 监听折叠事件

获取用户交互行为并执行自定义逻辑：

```javascript
tableInstance.on(VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.cellLocation === 'columnHeader') {
    console.log('表头状态变化：', args);
  }
});
```

### 动态更新表头状态

手动控制表头展开/收起：

```javascript
// 切换指定列的展开状态
tableInstance.toggleHierarchyState(col, row);
```

---

通过上述配置，可快速实现多层表头的结构化展示与动态交互，适用于复杂数据场景下的灵活分析需求。
