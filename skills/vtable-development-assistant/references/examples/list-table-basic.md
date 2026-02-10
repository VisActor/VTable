# ListTable 基础示例

## 1. 最简 ListTable

```javascript
import * as VTable from '@visactor/vtable';

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: [
    { name: '张三', age: 28, city: '北京' },
    { name: '李四', age: 35, city: '上海' },
    { name: '王五', age: 22, city: '深圳' }
  ],
  columns: [
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 80 },
    { field: 'city', title: '城市', width: 120 }
  ]
});
```

## 2. 带排序和格式化

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: salesData,
  columns: [
    { field: 'product', title: '产品', width: 150, sort: true },
    {
      field: 'revenue',
      title: '收入',
      width: 120,
      sort: true,
      fieldFormat: (record) => `¥${record.revenue.toLocaleString()}`,
      style: {
        textAlign: 'right',
        color: (args) => args.dataValue > 10000 ? '#52c41a' : '#333'
      }
    },
    {
      field: 'date',
      title: '日期',
      width: 120,
      sort: {
        orderFn: (a, b) => new Date(a.date) - new Date(b.date)
      }
    }
  ],
  sortState: { field: 'revenue', order: 'desc' }
});
```

## 3. 分页

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: bigDataset, // 所有数据
  columns: [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: '名称', width: 150 },
    { field: 'value', title: '值', width: 100 }
  ],
  pagination: {
    perPageCount: 20,
    currentPage: 1
  }
});

// 翻页
function changePage(pageNum) {
  table.updatePagination({ currentPage: pageNum });
}
```

## 4. 冻结列与自适应宽度

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: '名称', width: 200 },
    { field: 'category', title: '分类', width: 120 },
    { field: 'price', title: '价格', width: 100 },
    { field: 'stock', title: '库存', width: 80 },
    { field: 'description', title: '描述', width: 'auto' }
  ],
  frozenColCount: 2,           // 冻结前2列
  rightFrozenColCount: 1,      // 冻结最后1列
  widthMode: 'autoWidth',      // 自动列宽
  heightMode: 'autoHeight',    // 自动行高
  autoWrapText: true            // 自动换行
});
```

## 5. 多列排序 + 条件样式

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    { field: 'name', title: '姓名', width: 120, sort: true },
    {
      field: 'score',
      title: '得分',
      width: 100,
      sort: true,
      style: {
        bgColor: (args) => {
          if (args.dataValue >= 90) return '#f6ffed';
          if (args.dataValue >= 60) return '#fffbe6';
          return '#fff2f0';
        },
        color: (args) => {
          if (args.dataValue >= 90) return '#52c41a';
          if (args.dataValue >= 60) return '#faad14';
          return '#ff4d4f';
        }
      }
    },
    { field: 'grade', title: '等级', width: 80, sort: true }
  ],
  multipleSort: true,
  sortState: [
    { field: 'grade', order: 'asc' },
    { field: 'score', order: 'desc' }
  ]
});
```

## 6. 聚合统计行

```javascript
const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    { field: 'category', title: '分类', width: 120 },
    {
      field: 'amount',
      title: '金额',
      width: 120,
      aggregation: [
        { aggregationType: VTable.TYPES.AggregationType.SUM, showOnTop: false, formatFun: (val) => `合计: ¥${val.toFixed(2)}` },
      ]
    },
    {
      field: 'count',
      title: '数量',
      width: 100,
      aggregation: { aggregationType: VTable.TYPES.AggregationType.AVG, formatFun: (val) => `均值: ${val.toFixed(1)}` }
    }
  ]
});
```
