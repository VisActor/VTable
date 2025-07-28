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

## Custom Group Title Text Format

In the option, you can configure the `groupTitleFieldFormat` property to customize the text format of group titles. This property is a function that receives the grouping field name and group value as parameters and returns the text content to be displayed.

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: 'group',
  groupTitleFieldFormat: (record, col, row, table) => {
    return record.vtableMergeName + '(' + record.children.length + ')';
  }
};
```

Example:
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
      name: 'Jessica Brown',
      position: 'Training Manager',
      salary: '$8000',
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
  groupBy: 'group',
  groupTitleFieldFormat: (record, col, row, table) => {
    return record.vtableMergeName + '(' + record.children.length + ')';
  }
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

## Group title Sticky function

In option, you can configure the `enableTreeStickCell` property to enable the group title sticky function. After enabling it, when the table is scrolled, the group title will automatically adsorb to the top of the table.

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: ['Category', 'Sub-Category'],
  enableTreeStickCell: true
};
```

## Group Title Customization

In option, you can configure the `groupTitleCustomLayout` property to customize the layout in the group title.

```javascript livedemo template=vtable
// only use for website
const {createGroup, createText, createImage} = VRender;
// use this for project
// import {createGroup, createText, createImage} from '@visactor/vtable/es/vrender';

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
  groupBy: 'group',
  groupTitleCustomLayout: args => {
    const { table, row, col, rect } = args;
    const record = table.getCellOriginRecord(col, row);
    const { height, width } = rect ?? table.getCellRect(col, row);
    const hierarchyState = table.getHierarchyState(col, row);
    const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';
    const collapseRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="0.65"/>
          </svg>`;
    const collapseDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="0.65"/>
    </svg>`;
    const container = createGroup({
      height,
      width,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'center'
    });
    const icon = createImage({
      // id: 'hierarchy',
      image: hierarchyState === 'collapse' ? collapseRight : collapseDown,
      width: 18,
      height: 18,
      boundsPadding: [0, 0, 0, 10],
      cursor: 'pointer'
    });
    icon.stateProxy = (stateName) => {
      if (stateName === 'hover') {
        return {
          background: {
            fill: '#ccc',
            cornerRadius: 5,
            expandX: 1,
            expandY: 1
          }
        };
      }
    };
    icon.addEventListener('pointerenter', event => {
      event.currentTarget.addState('hover', true, false);
      event.currentTarget.stage.renderNextFrame();
    });
    icon.addEventListener('pointerleave', event => {
      event.currentTarget.removeState('hover', false);
      event.currentTarget.stage.renderNextFrame();
    });
    container.add(icon);
    const taskGroup = createGroup({
      height,
      width: 340,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'space-between'
    });
    const leftGroup = createGroup({
      height,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'center'
    });
    const avatar = createImage({
      image: bloggerAvatar,
      width: 24,
      height: 24,
      boundsPadding: [0, 8, 0, 8],
      cursor: 'pointer',
      cornerRadius: 12
    });
    const bloggerName = createText({
      text: record.vtableMergeName,
      fontSize: 14,
      fill: 'black'
    });
    leftGroup.add(avatar);
    leftGroup.add(bloggerName);
    taskGroup.add(leftGroup);
    const info = createText({
      text: `${record.children.length} 条记录`,
      fontSize: 12
    });
    taskGroup.add(info);
    container.add(taskGroup);
    container.addEventListener('click', e => {
      const { col, row } = e.currentTarget.parent;
      const hierarchyState = table.getHierarchyState(col, row);
      icon.setAttribute('image', hierarchyState === 'collapse' ? collapseDown : collapseRight);
      table.toggleHierarchyState(col, row);
    });

    return {
      rootContainer: container,
      renderDefault: false
    };
  }
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## Group checkbox

In `rowSeriesNumber`, you can configure `enableTreeCheckbox` to enable the group checkbox.
If enabled, checkbox will be displayed in the left of group title, and it will be synced with the children checkbox.

```javascript livedemo template=vtable
// only use for website
const {createGroup, createText, createImage} = VRender;
// use this for project
// import {createGroup, createText, createImage} from '@visactor/vtable/es/vrender';

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
  groupBy: 'group',

  rowSeriesNumber: {
    width: 50,
    format: () => {
      return '';
    },
    cellType: 'checkbox',
    enableTreeCheckbox: true
  }
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
