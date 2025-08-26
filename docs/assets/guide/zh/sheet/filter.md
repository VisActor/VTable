# 数据过滤

VTable-Sheet提供强大的数据过滤功能，帮助用户快速找到所需数据。过滤功能支持多种过滤模式，包括值列表过滤和条件过滤。

## 开启过滤功能

### 全局开启

可以在表格页配置中启用过滤功能：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      filter: true,  // 为整个表格页启用过滤功能
      // ...其他配置
    }
  ]
});
```

### 针对特定列开启

也可以只为特定列启用过滤功能：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      columns: [
        { title: '姓名', filter: true },  // 只为姓名列启用过滤
        { title: '年龄' },                // 不启用过滤
        { title: '部门', filter: true }   // 只为部门列启用过滤
      ],
      // ...其他配置
    }
  ]
});
```

### 自定义过滤模式

可以指定支持的过滤模式：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      // 只启用条件过滤模式
      filter: { filterModes: ['byCondition'] },
      // ...其他配置
    }
  ]
});
```

支持的过滤模式有：
- `'byValue'`：基于值列表的过滤
- `'byCondition'`：基于条件的过滤

## 使用过滤功能

启用过滤功能后，表头单元格会显示过滤图标。点击图标将打开过滤菜单，用户可以选择过滤方式。

### 值列表过滤

值列表过滤显示列中的所有唯一值，用户可以通过勾选值来筛选数据：

【注：此处需要添加值列表过滤功能截图】

### 条件过滤

条件过滤允许用户设置更复杂的过滤条件，如"大于"、"包含"等：

【注：此处需要添加条件过滤功能截图】

## 通过API控制过滤

VTable-Sheet提供FilterManager API，可以在代码中控制过滤行为：

```typescript
// 获取过滤管理器
const filterManager = sheetInstance.getFilterManager();

// 值列表过滤示例
filterManager.setFilter('col1', {
  type: FilterType.VALUE_LIST,
  values: ['技术部', '市场部'],  // 只显示这两个部门
  exclude: false               // false表示包含这些值，true表示排除这些值
});

// 条件过滤示例
filterManager.setFilter('col2', {
  type: FilterType.CONDITION,
  operator: 'greaterThan',     // 大于
  value: 30                    // 年龄大于30
});

// 区间条件过滤示例
filterManager.setFilter('col3', {
  type: FilterType.CONDITION,
  operator: 'between',         // 介于
  value: 5000,                 // 最小值
  value2: 10000                // 最大值
});

// 重置所有过滤器
filterManager.resetFilters();

// 重置特定列的过滤器
filterManager.resetFilter('col1');
```

## 支持的过滤操作符

条件过滤支持以下操作符：

| 操作符 | 说明 | 适用类型 |
|-------|------|---------|
| equals | 等于 | 所有类型 |
| notEquals | 不等于 | 所有类型 |
| greaterThan | 大于 | 数值、日期 |
| greaterThanOrEqual | 大于等于 | 数值、日期 |
| lessThan | 小于 | 数值、日期 |
| lessThanOrEqual | 小于等于 | 数值、日期 |
| contains | 包含 | 文本 |
| notContains | 不包含 | 文本 |
| startsWith | 开始于 | 文本 |
| endsWith | 结束于 | 文本 |
| between | 介于 | 数值、日期 |

## 过滤事件监听

可以监听过滤状态变化：

```typescript
// 监听过滤器变化事件
sheetInstance.on('filterChange', (evt) => {
  console.log('过滤器变化:', evt);
  console.log('过滤列:', evt.columnKey);
  console.log('过滤条件:', evt.filter);
});

// 监听过滤器重置事件
sheetInstance.on('filterReset', () => {
  console.log('所有过滤器已重置');
});
```

## 完整过滤示例

以下是一个完整的数据过滤示例：

```typescript
// 创建产品数据表
const productData = [
  ['产品', '价格', '库存', '销量', '评分'],
  ['笔记本电脑', 5999, 120, 78, 4.5],
  ['智能手机', 3999, 200, 156, 4.2],
  ['平板电脑', 2599, 150, 92, 4.0],
  ['耳机', 899, 300, 210, 4.7],
  ['鼠标', 129, 500, 310, 4.3],
  ['键盘', 239, 400, 180, 4.4],
  ['显示器', 1299, 100, 60, 4.6],
  ['摄像头', 399, 200, 85, 3.9],
  ['音箱', 599, 150, 75, 4.1],
  ['移动硬盘', 499, 250, 120, 4.2],
  ['充电器', 99, 600, 350, 4.0],
  ['手表', 1999, 80, 45, 4.8],
  ['路由器', 349, 180, 95, 4.3],
  ['打印机', 799, 70, 30, 4.0],
  ['投影仪', 3499, 40, 15, 4.5]
];

// 初始化VTableSheet
const sheet = new VTableSheet({
  container: document.getElementById('filter-sheet-container'),
  showToolbar: true,
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      title: "产品数据",
      key: "products",
      data: productData,
      filter: true  // 启用过滤功能
    }
  ]
});

// 使用API设置过滤器
window.addEventListener('load', () => {
  const filterManager = sheet.getFilterManager();
  
  // 设置价格过滤条件：价格大于1000的产品
  filterManager.setFilter('col1', {
    type: FilterType.CONDITION,
    operator: 'greaterThan',
    value: 1000
  });
  
  // 设置评分过滤条件：评分高于4.5的产品
  filterManager.setFilter('col4', {
    type: FilterType.CONDITION,
    operator: 'greaterThanOrEqual',
    value: 4.5
  });
  
  // 监听过滤变化
  sheet.on('filterChange', (evt) => {
    console.log(`列 ${evt.columnKey} 的过滤条件已变更`, evt.filter);
  });
});
```

## 高级过滤功能

### 值列表过滤的扩展选项

值列表过滤支持排除模式，即显示除所选值以外的所有值：

```typescript
filterManager.setFilter('col0', {
  type: FilterType.VALUE_LIST,
  values: ['笔记本电脑', '智能手机'],
  exclude: true  // 排除这些值，显示其他所有值
});
```

### 复合过滤条件

可以为不同的列设置多个过滤条件，这些条件会同时生效（逻辑与关系）：

```typescript
// 价格在1000-5000之间
filterManager.setFilter('col1', {
  type: FilterType.CONDITION,
  operator: 'between',
  value: 1000,
  value2: 5000
});

// 库存大于100
filterManager.setFilter('col2', {
  type: FilterType.CONDITION,
  operator: 'greaterThan',
  value: 100
});

// 结果将同时满足上述两个条件
```

### 过滤状态持久化

可以保存和恢复过滤状态：

```typescript
// 获取当前的过滤状态
const filterState = filterManager.getFilterState();

// 将过滤状态保存到本地存储
localStorage.setItem('tableFilterState', JSON.stringify(filterState));

// 从本地存储恢复过滤状态
const savedState = JSON.parse(localStorage.getItem('tableFilterState'));
if (savedState) {
  filterManager.setFilterState(savedState);
}
```

通过这些过滤功能，用户可以快速筛选出所需数据，提高数据分析和处理的效率。

【注：此处需要添加应用了多个过滤条件后的表格效果截图】
