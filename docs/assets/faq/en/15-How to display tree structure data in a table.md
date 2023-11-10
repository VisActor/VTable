# How to display tree structure data in a table?

## Question Description

How can we implement the display of hierarchical data in a table component on a frontend web page, as shown in the diagram?
![image](/vtable/faq/15-0.png)

## Solution

VTable's two table forms, the basic table ListTable and the pivot table PivotTable, can achieve this kind of tree display, and the usage is quite simple.
Let me give you an example of a basic table displayed as a tree structure. There are two main configurations:
(1) You need to configure the tree bit true on the column.
(2) It needs to be data with children hierarchical structure
You can refer to the two examples on the official website:

1. Basic table tree: https://visactor.io/vtable/demo/table-type/list-table-tree
2. Pivot table tree: https://visactor.io/vtable/demo/table-type/pivot-table-tree

## Code Example

```javascript
const option = {
  records:
  [
    {
    "department": "Human Resources Department",
    "children": [
      {
        "group": "Recruiting Group",
        "children": [
          {
            "name": "John Smith",
            "position": "Recruiting Manager",
            "salary": "$8000"
          },
          {
            "name": "Emily Johnson",
            "position": "Recruiting Supervisor",
            "salary": "$6000"
          },
          {
            "name": "Michael Davis",
            "position": "Recruiting Specialist",
            "salary": "$4000"
          }
        ],
      },
      ...
  ],
  columns: [
    {
        "field": "group",
        "title": "department",
        "width": "auto",
         tree: true,
      },
      ...
    ]
};
```

## Results

[Online demo](https://visactor.io/vtable/demo/table-type/list-table-tree)

![result](/vtable/faq/15-1.png)

## Quote

- [Tree table Tutorial](https://visactor.io/vtable/guide/table_type/List_table/tree_list)
- [Related api](https://visactor.io/vtable/option/ListTable-columns-text#tree)
- [github](https://github.com/VisActor/VTable)
