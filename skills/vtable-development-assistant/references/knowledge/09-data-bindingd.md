# 数据绑定

## 一、ListTable 数据绑定

### records — 直接传入数据

最常用的方式，将数组数据直接传入：

```typescript
const table = new ListTable({
  records: [
    { id: 1, name: 'Alice', age: 25, city: 'Beijing' },
    { id: 2, name: 'Bob', age: 30, city: 'Shanghai' }
  ],
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: '姓名' }
  ]
});

// 更新全量数据
table.setRecords(newRecords);

// 增删改
table.addRecord({ id: 3, name: 'Charlie', age: 28 });
table.addRecords([record1, record2], 0);  // 在索引0处插入
table.deleteRecords([0, 2]);              // 删除第0、2条
table.updateRecords([updatedRecord], [1]); // 更新第1条
```

### dataSource — 数据源对象（懒加载/大数据）

用于懒加载或自定义数据获取逻辑：

```typescript
import { CachedDataSource, DataSource } from '@visactor/vtable';

// 创建数据源
const dataSource = new CachedDataSource({
  get(index) {
    // 根据索引获取数据（支持返回 Promise）
    return records[index];
  },
  length: records.length,
  getField(index, field) {
    return records[index]?.[field];
  }
});

const table = new ListTable({
  dataSource,
  columns: [...]
});
```

### field — 字段映射

`field` 支持多种形式：

```typescript
// 1. 简单字段名
{ field: 'name' }

// 2. 嵌套字段（点号分隔）
{ field: 'address.city' }

// 3. 数组路径
{ field: ['address', 'city'] }

// 4. 数字索引（数据为数组时）
{ field: 0 }
```

### fieldFormat — 格式化显示

```typescript
{
  field: 'price',
  title: '价格',
  fieldFormat: (record, col, row, table) => {
    return `¥${record.price?.toFixed(2)}`;
  }
}
```

注意: `fieldFormat` 影响的是**展示值**，`getCellValue()` 返回格式化后的值，`getCellRawValue()` 返回原始值。

### 排序

```typescript
// 方式1：列定义上开启
{
  field: 'age',
  title: '年龄',
  sort: true  // 使用默认排序
}

// 方式2：自定义排序函数
{
  field: 'name',
  title: '姓名',
  sort: (a, b, order) => {
    return order === 'asc' 
      ? a.localeCompare(b, 'zh') 
      : b.localeCompare(a, 'zh');
  }
}

// 方式3：预排序（大数据性能优化）
table.setSortedIndexMap('age', sortedMap);

// 方式4：配置初始排序状态
const table = new ListTable({
  sortState: { field: 'age', order: 'asc' }
});
```

### 过滤

```typescript
// 更新过滤规则
table.updateFilterRules([
  {
    filterKey: 'city',
    filteredValues: ['Beijing', 'Shanghai']
  }
]);

// 自定义过滤函数
table.updateFilterRules([
  {
    filterFunc: (record) => record.age > 20
  }
]);

// 获取过滤后的数据
const filtered = table.getFilteredRecords();
```

### 聚合

```typescript
{
  field: 'sales',
  title: '销售额',
  aggregation: [
    {
      aggregationType: VTable.AggregationType.SUM,
      showOnTop: false,      // 显示在底部
      formatFun: (value) => `合计: ¥${value.toLocaleString()}`
    }
  ]
}
```

支持的聚合类型：`SUM`, `COUNT`, `AVG`, `MAX`, `MIN`, `NONE`, `CUSTOM`

### 分页

```typescript
const table = new ListTable({
  pagination: {
    perPageCount: 20,    // 每页 20 条
    currentPage: 1       // 当前第 1 页
  }
});

// 翻页
table.updatePagination({ currentPage: 2 });
```

## 二、PivotTable 数据绑定

### 方式1：records + rows/columns/indicators（自动聚合）

最常用，由 VTable 内部完成数据分析：

```typescript
const table = new PivotTable({
  records: flatData,  // 平坦的原始数据
  rows: ['region', 'city'],
  columns: ['category', 'subCategory'],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额'
  }],
  dataConfig: {
    aggregationRules: [{
      indicatorKey: 'sales',
      field: 'sales',
      aggregationType: VTable.AggregationType.SUM
    }]
  }
});
```

### 方式2：rowTree/columnTree + records（自定义表头）

手动定义表头结构：

```typescript
const table = new PivotTable({
  records: flatData,
  rowTree: [
    { dimensionKey: 'region', value: '华东', children: [...] },
    { dimensionKey: 'region', value: '华北' }
  ],
  columnTree: [
    { dimensionKey: 'year', value: '2023', children: [
      { indicatorKey: 'sales' },
      { indicatorKey: 'profit' }
    ]}
  ],
  rows: [{ dimensionKey: 'region', title: '地区' }],
  indicators: [
    { indicatorKey: 'sales', title: '销售额' }
  ]
});
```

### 方式3：rowTree/columnTree 无 records（纯展示）

手动指定所有数据，不做聚合：

```typescript
// 数据可以不传 records，在 tree 节点中带数据
// 此时必须设置 parseCustomTreeToMatchRecords
```

## 三、PivotChart 数据绑定

```typescript
const table = new PivotChart({
  records: flatData,
  rows: ['region'],
  columns: ['category'],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: {
      type: 'bar',
      xField: ['category'],
      yField: 'sales'
    }
  }]
});
```

注意：PivotChart 内部自动开启数据分析，不需要手动配置 `dataConfig`。

## 四、数据更新最佳实践

```typescript
// ✅ 推荐：使用 API 更新
table.setRecords(newRecords);              // 全量更新
table.addRecords(newRecords);              // 增量添加
table.changeCellValue(col, row, value);    // 单格修改

// ❌ 不推荐：直接修改 records 数组
table.records.push(newRecord);  // 不会触发重新渲染！

// 如果必须直接修改数据源，需手动刷新
table.records[0].name = 'NewName';
table.refreshAfterSourceChange();  // ListTable 专有
```

## 五、树形数据

```typescript
const table = new ListTable({
  records: [
    {
      name: '总部',
      children: [
        { name: '研发部', children: [
          { name: '前端组' },
          { name: '后端组' }
        ]},
        { name: '市场部' }
      ]
    }
  ],
  columns: [
    { field: 'name', title: '部门', tree: true },  // tree: true 标记树形列
    { field: 'headcount', title: '人数' }
  ],
  hierarchyIndent: 20,     // 缩进像素
  hierarchyExpandLevel: 2  // 默认展开2层
});

// 动态加载子节点
table.on('tree_hierarchy_state_change', (args) => {
  if (args.hierarchyState === 'expand') {
    loadChildren(args.originData).then(children => {
      table.setRecordChildren(children, args.row);
    });
  }
});
```
