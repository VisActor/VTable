## Basic table grouping display

In this tutorial, we will learn how to use the basic table grouping display function in VTable.

## Usage scenario

The basic table grouping display function is applicable to a variety of scenarios, such as:

- Financial statements: You can group and display according to different account types (such as income, expenditure, assets, liabilities) to help you understand the financial situation more clearly.

- Sales data analysis: You can group by product category, region, salesperson, etc., to facilitate comparison and analysis of sales performance in different categories or regions.

- Project management: You can group by project stage, responsible team, priority, etc. to help better track and manage project progress.

- Human resource management: You can group by department, position, years of work, etc. to facilitate employee management and performance evaluation.

## Usage method

In the option of ListTable, configure the `groupBy` field, the value is the grouping field name, you can configure a single field, or you can configure an array of multiple fields.
```
{
  // ...
  groupBy: 'key',
}
```
或
```
{
  // ...
  groupBy: ['key1', 'key2'],
}
```
## Example
```javascript livedemo template=vtable
const records = [
   {
      name: 'John Smith',
      position: 'Recruiting Manager',
      salary: '$8000',
      group: 'Recruiting Group'
    },
    {
      name: 'Emily Johnson',
      position: 'Recruiting Supervisor',
      salary: '$6000',
      group: 'Recruiting Group'
    },
    {
      name: 'Michael Davis',
      position: 'Recruiting Specialist',
      salary: '$4000',
      group: 'Recruiting Group'
    },
    {
      name: 'Jessica Brown',
      position: 'Training Manager',
      salary: '$8000',
      group: 'Training Group',
    },
    {
      name: 'Andrew Wilson',
      position: 'Training Supervisor',
      salary: '$6000',
      group: 'Training Group',
    }
];
const columns = [
  {
    field: 'name',
    title: 'Name',
    width: 'auto',
  },
  {
    field: 'position',
    title: 'Position',
    width: 'auto',
  },
  {
    field: 'salary',
    title: 'Salary',
    width: 'auto',
  },
];

const option = {
  records,
  columns,
  widthMode: 'standard',
  groupBy: 'group'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## Specify the display style of the group title

In the theme, you can configure the groupTitleStyle property to specify the display style of the group title. If you need to specify the style of group titles at different levels, you can use the function to get the level of the current node through the `table.getGroupTitleLevel(col, row)` method to specify the styles of different levels.

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: ['Category', 'Sub-Category'],
  theme: VTable.themes.DEFAULT.extends({
    groupTitleStyle: {
      fontWeight: 'bold',
      bgColor: args => {
        const { col, row, table } = args;
        const index = table.getGroupTitleLevel(col, row); // Get the level of the current node
        if (index !== undefined) {
          return titleColorPool[index % titleColorPool.length];
        }
      }
    }
  })
};
```

<div style="width: 80%; text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-group.jpeg" />
</div>
