## 基本表格分组展示

在本教程中，我们将学习如何使用 VTable 中的基本表格分组展示功能。

## 使用场景

基本表格分组展示功能适用于多种场景，例如：

- 财务报表：可以按照不同的账户类型（如收入、支出、资产、负债）进行分组展示，帮助更清晰地了解财务状况。
- 销售数据分析：可以按照产品类别、地区、销售人员等进行分组，方便比较和分析不同类别或区域的销售表现。
- 项目管理：可以按照项目阶段、负责团队、优先级等进行分组，帮助更好地跟踪和管理项目进度。
- 人力资源管理：可以按照部门、职位、工作年限等进行分组，方便进行员工管理和绩效评估。

## 使用方式

ListTable的option中，配置`groupBy`字段，值为分组字段名称，可以配置一个字段，也可以配置多个字段组成的数组。
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

## 示例

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
  groupBy: 'group'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## 自定义分组标题文本格式

在option中，可以配置`groupTitleFieldFormat`属性，用于自定义分组标题的文本格式。该属性是一个函数，接收分组字段名称和分组值作为参数，返回要显示的文本内容。

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: 'group',
  groupTitleFieldFormat: (record, col, row, table) => {
    return record.vtableMergeName + '(' + record.children.length + ')';
  }
};
```

示例：
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

## 指定分组标题显示样式

在theme中，可以配置groupTitleStyle属性，用于指定分组标题的显示样式。其中，如果需要指定不同层级的分组标题的样式，可以使用函数，通过`table.getGroupTitleLevel(col, row)`方法获取当前节点的层级，去指定不同层级的样式。

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: ['Category', 'Sub-Category'],
  theme: VTable.themes.DEFAULT.extends({
    groupTitleStyle: {
      fontWeight: 'bold',
      bgColor: args => {
        const { col, row, table } = args;
        const index = table.getGroupTitleLevel(col, row); // 获取当前节点的层级
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

## 分组标题吸附功能

在option中，可以配置`enableTreeStickCell`属性，用于开启分组标题吸附功能。开启后，当表格滚动时，分组标题会自动吸附到表格的顶部。

```ts
const option: VTable.ListTableConstructorOptions = {
  // ...
  groupBy: ['Category', 'Sub-Category'],
  enableTreeStickCell: true
};
```

## 分组标题自定义

在option中，可以配置`groupTitleCustomLayout`属性，用于在分组标题中进行自定义布局。

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

## 分组复选框

可以在`rowSeriesNumber`中配置`enableTreeCheckbox`属性，用于开启分组复选框。开启后，分组标题的左侧会出现复选框，会和子元素的选中状态同步。

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