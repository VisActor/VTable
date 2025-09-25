# 筛选插件

VTable 提供了功能强大的筛选插件，支持按值筛选和按条件筛选两种模式，帮助用户快速过滤和查找表格数据。

## 功能特性

- **按值筛选**：从列的所有唯一值中选择要显示的数据
- **按条件筛选**：使用操作符设置筛选条件（等于、大于、包含等）
- **多种操作符**：支持文本、数值、布尔值等不同类型的筛选操作
- **列级别控制**：可以为特定列启用或禁用筛选功能
- **状态持久化**：支持筛选状态的保存和恢复
- **智能图标**：自动显示筛选状态图标

## 筛选插件配置选项

`FilterPlugin` 筛选插件可以配置以下参数：

```typescript
export interface FilterOptions {
  /** 筛选器 ID，用于唯一标识筛选器 */
  id?: string;
  /** 筛选器图标 */
  filterIcon?: VTable.TYPES.ColumnIconOption;
  /** 筛选器激活图标 */
  filteringIcon?: VTable.TYPES.ColumnIconOption;
  /** 筛选功能启用钩子函数，返回指定列是否启用筛选功能 */
  enableFilter?: (field: number | string, column: VTable.TYPES.ColumnDefine) => boolean;
  /** 默认是否启用筛选（当 enableFilter 未定义时使用） */
  defaultEnabled?: boolean;
  /** 筛选模式：按值筛选、按条件筛选 */
  filterModes?: FilterMode[];
}
```

### 配置参数说明

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `id` | string | `filter-${Date.now()}` | 插件实例唯一标识符 |
| `filterIcon` | ColumnIconOption | 默认筛选图标 | 未激活状态的筛选图标 |
| `filteringIcon` | ColumnIconOption | 默认激活图标 | 激活状态的筛选图标 |
| `enableFilter` | function | - | 自定义列筛选启用逻辑 |
| `defaultEnabled` | boolean | true | 默认是否启用筛选 |
| `filterModes` | FilterMode[] | ['byValue', 'byCondition'] | 支持的筛选模式 |

### 筛选操作符

插件支持以下筛选操作符：

**通用操作符**
- `equals` - 等于
- `notEquals` - 不等于

**数值操作符**
- `greaterThan` - 大于
- `lessThan` - 小于
- `greaterThanOrEqual` - 大于等于
- `lessThanOrEqual` - 小于等于
- `between` - 介于
- `notBetween` - 不介于

**文本操作符**
- `contains` - 包含
- `notContains` - 不包含
- `startsWith` - 开始于
- `notStartsWith` - 不开始于
- `endsWith` - 结束于
- `notEndsWith` - 不结束于

**布尔操作符**
- `isChecked` - 已选中
- `isUnchecked` - 未选中

## 使用示例

### 基本使用

```javascript
import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '@visactor/vtable-plugins';

// 创建筛选插件
const filterPlugin = new FilterPlugin({});

// 创建表格配置
const option = {
  records: data,
  columns: [
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 100 },
    { field: 'department', title: '部门', width: 150 },
    { field: 'salary', title: '薪资', width: 120 }
  ],
  plugins: [filterPlugin]
};

// 创建表格实例
const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

### 高级配置

```javascript
// 自定义筛选启用逻辑
const filterPlugin = new FilterPlugin({
  // 自定义哪些列启用筛选
  enableFilter: (field, column) => {
    // ID 列不启用筛选
    return field !== 'id' && column.title;
  },

  // 只启用按值筛选
  filterModes: ['byValue'],

  // 自定义图标
  filterIcon: {
    name: 'custom-filter',
    type: 'svg',
    width: 16,
    height: 16,
    svg: '<svg>...</svg>'
  }
});
```

### 列级别筛选控制

```javascript
const columns = [
  { field: 'name', title: '姓名', width: 120 }, // 默认启用筛选
  { field: 'age', title: '年龄', width: 100, filter: false }, // 禁用筛选
  { field: 'department', title: '部门', width: 150 }, // 默认启用筛选
];
```

### 状态持久化

```javascript
// 获取当前筛选状态
const filterState = filterPlugin.getFilterState();

// 保存到本地存储
localStorage.setItem('tableFilterState', JSON.stringify(filterState));

// 从本地存储恢复
const savedState = JSON.parse(localStorage.getItem('tableFilterState'));
if (savedState) {
  filterPlugin.setFilterState(savedState);
}
```

## 完整示例

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包 @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// 正常使用方式 const filterPlugin = new FilterPlugin({});
// 官网编辑器中将 VTable.plugins 重命名成了 VTablePlugins

const generateDemoData = (count) => {
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部'];
  const statuses = ['在职', '请假', '离职'];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    department: departments[i % departments.length],
    salary: 5000 + Math.floor(Math.random() * 15000),
    status: statuses[i % statuses.length],
    isFullTime: i % 3 !== 0
  }));
};

const filterPlugin = new VTablePlugins.FilterPlugin({
  filterModes: ['byValue', 'byCondition']
});

const option = {
  records: generateDemoData(50),
  columns: [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 100 },
    { field: 'department', title: '部门', width: 120 },
    { field: 'salary', title: '薪资', width: 120,
      fieldFormat: (record) => '￥' + record.salary },
    { field: 'status', title: '状态', width: 100 },
    { field: 'isFullTime', title: '全职', width: 80, cellType: 'checkbox' }
  ],
  plugins: [filterPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## 使用说明

1. **点击筛选图标**：点击列标题右侧的筛选图标打开筛选面板
2. **按值筛选**：在筛选面板中选择要显示的值
3. **按条件筛选**：选择操作符并输入筛选条件
4. **应用筛选**：点击"确认"按钮应用筛选条件
5. **清除筛选**：点击"清除筛选"链接移除当前列的筛选

## 注意事项

- 筛选插件目前仅支持 `ListTable`，不支持 `PivotTable`
- 使用列级别筛选控制时，需要在列定义中添加 `filter` 属性
- 筛选状态会在表格配置更新时自动同步
- 建议为大数据量表格启用筛选功能以提升用户体验

# 本插件贡献者及文档作者

[PoorShawn](https://github.com/PoorShawn)
