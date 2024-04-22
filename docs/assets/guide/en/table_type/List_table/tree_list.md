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

## Lazy loading of child node data scenarios

In some scenarios, the child node data may be relatively large. In view of the excessive performance pressure on the backend database, and you do not want to obtain all the data at once, you need to call the interface to load the data when you click to expand. Then you can use the following method to achieve:

1. Set the children of the corresponding data to true instead of a specific data collection so that the cell can display the folded icon;
2. When the user clicks the status icon, the event `VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE` will be triggered. The front-end code needs to listen to this event to request children data.
3. Pass the obtained data back to the table component, you can call the interface `instance.setRecordChildren(childrenData, col, row)`;

For specific examples, please see: https://visactor.io/vtable/demo/table-type/list-table-tree-lazy-load
