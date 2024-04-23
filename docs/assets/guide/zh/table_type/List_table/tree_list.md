## 基本表格树形结构

在本教程中，我们将学习如何使用 VTable 中的基本表格树形展示功能。

## 使用场景

基本表格树形展示功能适用于多种场景，例如：

- 组织结构管理：企业组织结构通常是一个多层级的树形结构。
- 商品分类管理：电商平台通常需要管理大量的商品分类，这些分类通常也是一个多层级的树形结构。
- 项目管理：在一个大型项目中，可能会有多个子项目和任务。
- 文件管理：在一个大型的文件库中，可能存在多个文件夹和子文件夹。
- 数据分析：在一个数据分析应用中，可能需要展示多个维度和指标。

## 使用方式

**1.** 在 colums 具体展示为树形结构的列配置中指定 tree 为 true。

**2.** 数据中增加 children 数据嵌套结构来表达展示为 tree 层级结构。如下数据：

```
{
    "group": "Human Resources Department",
    "monthly_expense": "$45000",
    "children": [
      {
        "group": "Recruiting Group",
        "monthly_expense": "$25000",
        "children": [
          {
            "group": "John Smith",
            "position": "Recruiting Manager",
            "salary": "$8000"
          },
      }
    ]
}
```

## 示例

```javascript livedemo template=vtable
const records = [
  {
    group: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    children: [
      {
        group: 'Recruiting Group',
        children: [
          {
            group: 'John Smith',
            position: 'Recruiting Manager',
            salary: '$8000'
          },
          {
            group: 'Emily Johnson',
            position: 'Recruiting Supervisor',
            salary: '$6000'
          },
          {
            group: 'Michael Davis',
            position: 'Recruiting Specialist',
            salary: '$4000'
          }
        ],
        total_children: 15,
        monthly_expense: '$25000',
        new_hires_this_month: 4,
        resignations_this_month: 2,
        complaints_and_suggestions: 1
      },
      {
        group: 'Training Group',
        children: [
          {
            group: 'Jessica Brown',
            position: 'Training Manager',
            salary: '$8000'
          },
          {
            group: 'Andrew Wilson',
            position: 'Training Supervisor',
            salary: '$6000'
          }
        ],
        total_children: 15,
        monthly_expense: '$20000',
        new_hires_this_month: 2,
        resignations_this_month: 1,
        complaints_and_suggestions: 1
      }
    ]
  }
];
const columns = [
  {
    field: 'group',
    title: 'department',
    width: 'auto',
    tree: true
  },
  {
    field: 'total_children',
    title: 'memebers count',
    width: 'auto',
    fieldFormat(rec) {
      if (rec?.['position']) {
        return `position:  ${rec['position']}`;
      } else return rec?.['total_children'];
    }
  },
  {
    field: 'monthly_expense',
    title: 'monthly expense',
    width: 'auto',
    fieldFormat(rec) {
      if (rec?.['salary']) {
        return `salary:  ${rec['salary']}`;
      } else return rec?.['monthly_expense'];
    }
  },
  {
    field: 'new_hires_this_month',
    title: 'new hires this month',
    width: 'auto'
  },
  {
    field: 'resignations_this_month',
    title: 'resignations this month',
    width: 'auto'
  },
  {
    field: 'complaints_and_suggestions',
    title: 'recived complaints counts',
    width: 'auto'
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## 指定节点的收起或者展开状态

上述示例中可以设置数据节点的 `hierarchyState` 来指定节点的收起或者展开状态，其值为 `expand` 或者 `collapse`。

例如指定第一个节点为展开状态：`hierarchyState: 'expand'`。

```javascript
const records = [
  {
    group: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    hierarchyState: 'expand',
    children: [
      // ...
    ]
  }
];
```

## 懒加载子节点数据场景

在一些场景下，子节点数据可能比较大，鉴于后台数据库性能压力过大，并不想一次性获取到全部数据，需要在点击展开时才进行调用接口来加载数据。那么可以使用如下方式来实现：

1. 将对应数据的 children 设置为 true 而非具体的数据集合，以使该单元格可以显示折叠状态的图标；
2. 当用户点击状态图标时，会触发事件`VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE`，前端代码需要监听该事件，来请求 children 数据
3. 将获取到的数据回传到表格组件中，可调用接口`instance.setRecordChildren(childrenData, col, row)`;

具体示例可以看：https://visactor.io/vtable/demo/table-type/list-table-tree-lazy-load
