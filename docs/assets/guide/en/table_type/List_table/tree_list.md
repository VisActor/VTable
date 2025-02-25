## Basic table tree structure

In this tutorial, we will learn how to use the basic table tree presentation feature in VTable.

## usage scenario

The basic table tree display function is suitable for a variety of scenarios, such as:

- Organizational structure management: Enterprise organizational structure is usually a multi-level tree structure.
- Commodity classification management: E-commerce platforms usually need to manage a large number of commodity classifications, which are usually also a multi-level tree structure.
- Project Management: In a large project, there may be multiple sub-projects and tasks.
- File management: In a large file library, there may be multiple folders and subfolders.
- Data analytics: In a data analytics application, it may be necessary to demonstrate multiple Dimensions and Metirc.

## How to use

**1.** Specify tree to be true in the column configuration where colums are embodied as a tree structure.

**2.** Add children data nested structure to the data to express and display as a tree hierarchy. The following data:

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

## example

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
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  widthMode: 'standard'
};
const tableInstance = new ListTable(option);
window['tableInstance'] = tableInstance;
```

## Specify the collapsed or expanded state of a node

In the above example, you can set the `hierarchyState` of the data node to specify the collapsed or expanded state of the node, and its value is `expand` or `collapse`.

For example, specify the first node as expanded: `hierarchyState: 'expand'`.

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

## Default expansion level of tree structure

In a tree structure, the default expansion level can be specified through the `hierarchyExpandLevel` configuration item.

For example, to specify the default expansion to the third level: `hierarchyExpandLevel: 3`。

```javascript
const option = {
  records,
  columns,
  widthMode: 'standard',
  hierarchyExpandLevel: 3
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

## Lazy loading of child node data scenarios

In some scenarios, the child node data may be relatively large. In view of the excessive performance pressure on the backend database, and you do not want to obtain all the data at once, you need to call the interface to load the data when you click to expand. Then you can use the following method to achieve:

0. (Optional) Register the loading icon

```javascript
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading', // Define the name of the icon, which will be used as the key value for caching in the internal cache
  positionType: VTable.TYPES.IconPosition.absoluteRight, // Specify the position, which can be before or after the text, or left or right of the cell
  marginLeft: 0, // The left content interval in the specific position
  marginRight: 4, // The right content interval in the specific position
  visibleTime: 'always', // The display time, 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // The size of the hot area
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});
```

1. Set the children of the corresponding data to true instead of a specific data collection so that the cell can display the folded icon;
2. When the user clicks the status icon, the event `VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE` will be triggered. The front-end code needs to listen to this event to request children data.
3. (Optional) Before loading the data, call the `instance.setLoadingHierarchyState(col, row)` method to display the loading icon;
4. Pass the obtained data back to the table component, you can call the interface `instance.setRecordChildren(childrenData, col, row)`;

For specific examples, please see: https://visactor.io/vtable/demo/table-type/list-table-tree-lazy-load

## Merge cells in the tree structure

In some scenarios, you want to display the parent node as a merged cell in the entire row, you can configure `vtableMerge` and `vtableMergeName` in the data, where `vtableMerge` is true, indicating that the parent node is a merged cell, and `vtableMergeName` is the name displayed in the merged cell. At the same time, you need to add the `enableTreeNodeMerge` configuration to true in the option.

```javascript livedemo template=vtable
const records = [
  {
    group: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    vtableMerge: true,
    vtableMergeName: 'Human Resources Department(merge)',
    children: [
      {
        group: 'Recruiting Group',
        vtableMerge: true,
        vtableMergeName: 'Recruiting Group(merge)',
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
        vtableMerge: true,
        vtableMergeName: 'Training Group(merge)',
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
  widthMode: 'standard',
  enableTreeNodeMerge: true,
  hierarchyExpandLevel: Infinity
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
