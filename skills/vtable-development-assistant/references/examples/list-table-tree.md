# ListTable 树形与分组示例

## 1. 基础树形表格

```javascript
import * as VTable from '@visactor/vtable';

const records = [
  {
    name: '技术部',
    budget: 500000,
    children: [
      {
        name: '前端组',
        budget: 200000,
        children: [
          { name: '张三', budget: 80000 },
          { name: '李四', budget: 120000 }
        ]
      },
      {
        name: '后端组',
        budget: 300000,
        children: [
          { name: '王五', budget: 150000 },
          { name: '赵六', budget: 150000 }
        ]
      }
    ]
  },
  {
    name: '产品部',
    budget: 300000,
    children: [
      { name: '小明', budget: 150000 },
      { name: '小红', budget: 150000 }
    ]
  }
];

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records,
  columns: [
    {
      field: 'name',
      title: '名称',
      width: 250,
      tree: true  // 开启树形展开
    },
    {
      field: 'budget',
      title: '预算',
      width: 150,
      fieldFormat: (record) => `¥${record.budget.toLocaleString()}`
    }
  ],
  hierarchyIndent: 20,        // 缩进像素
  hierarchyExpandLevel: 1     // 默认展开1层
});
```

## 2. 自定义展开层级与事件

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: treeData,
  columns: [
    { field: 'name', title: '名称', width: 250, tree: true },
    { field: 'type', title: '类型', width: 100 },
    { field: 'size', title: '大小', width: 100 }
  ],
  hierarchyExpandLevel: Infinity,  // 全部展开
  hierarchyTextStartAlignment: true // 同级文字对齐
});

// 监听展开/折叠
table.on('tree_hierarchy_state_change', (args) => {
  console.log('节点状态变更:', args.col, args.row, args.hierarchyState);
});

// API: 展开/折叠指定节点
table.toggleHierarchyState(0, 3); // 切换第3行的展开状态

// API: 展开所有 / 折叠所有
table.setAllHierarchyState('expand');
table.setAllHierarchyState('collapse');
```

## 3. 分组表格

```javascript
const records = [
  { category: '电子产品', product: '手机', price: 3999, stock: 150 },
  { category: '电子产品', product: '笔记本', price: 6999, stock: 80 },
  { category: '食品', product: '牛奶', price: 59, stock: 500 },
  { category: '食品', product: '面包', price: 15, stock: 300 },
  { category: '服装', product: 'T恤', price: 99, stock: 200 }
];

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records,
  columns: [
    { field: 'category', title: '分类', width: 120, tree: true },
    { field: 'product', title: '产品', width: 150 },
    { field: 'price', title: '价格', width: 100 },
    { field: 'stock', title: '库存', width: 80 }
  ],
  groupConfig: {
    groupBy: 'category',  // 按 category 字段分组
    titleCustomLayout: (args) => {
      const { table, row, col, rect } = args;
      const record = table.getCellOriginRecord(col, row);
      const { Group, Text } = VTable.CustomLayout;
      return {
        rootContainer: (
          <Group display="flex" flexDirection="row" alignItems="center" padding={[4, 8]}>
            <Text text={`📂 ${record.category}`} fontSize={14} fontWeight="bold" fill="#1890ff" />
            <Text text={` (${record.children?.length || 0}项)`} fontSize={12} fill="#999" margin={[0, 0, 0, 4]} />
          </Group>
        ),
        renderDefault: false
      };
    }
  }
});
```

## 4. 懒加载树形

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: rootNodes, // 只包含顶层节点
  columns: [
    {
      field: 'name',
      title: '组织',
      width: 250,
      tree: true
    },
    { field: 'count', title: '人数', width: 100 }
  ],
  hierarchyExpandLevel: 0 // 默认全部折叠
});

// 监听展开事件，懒加载子节点
table.on('tree_hierarchy_state_change', async (args) => {
  if (args.hierarchyState === 'expand') {
    const record = table.getCellOriginRecord(args.col, args.row);
    if (!record.children || record.children.length === 0) {
      // 异步加载子节点
      const children = await fetchChildren(record.id);
      record.children = children;
      // 刷新表格
      table.setRecords(table.records);
    }
  }
});
```
