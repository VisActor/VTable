# Custom Rendering

In the field of data analysis, to present data more intuitively, we often use charts or grids. In some specific scenarios, we wish to add more expressive and personalized display effects to certain cells of a table. At this time, the custom rendering function of table cell content becomes particularly important. Through custom rendering of cell content, we can achieve the following types of scenario needs:

1. Rich text display. Display text with various styles and layouts within a cell, making it easy for users to quickly grasp key information.

2. Mixed text and image display. Display images or icons in cells according to data, making the data more intuitive.

3. Graphical data display. Display data in a graphical way, such as circles, rectangles, etc., making data comparison and analysis more intuitive.

4. Custom cell layout. Arrange custom rendering elements in any layout within a cell to meet special layout needs.

In the VTable library, we can achieve the above scenario needs by defining `custom rendering of table cell content`. Because it is more flexible, it can be customized according to business data, but the cost to the integrator is also higher, requiring their own calculation of positions, etc. (While drawing custom content, if you want to draw the default content according to the internal logic of VTable, please set renderDefault to true.)

## Case Analysis

Next, we will explain the implementation process using the effect shown in the following figure as an example.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170d.png)

### Preparing Data:

The body data cell part of the table in the figure above has two rows, corresponding to the two pieces of data in our records.

```
    records:[
      {
        'type': 'important',
        "urgency": ['crisis','urgent problem','tasks that must be completed within a limited time'],
        "not_urgency": ['preventive measures','development relationship','identify new development opportunities','establish long-term goals'],
      },
      {
        'type': 'Not\nimportant',
        "urgency": ['Receive visitors','Certain calls, reports, letters, etc','Urgent matters','Public activities'],
        "not_urgency": ['Trivial busy work','Some letters','Some phone calls','Time-killing activities','Some pleasant activities'],
      },
    ],
```

### Content Decomposition

Let's analyze the composition of each cell's display content:

- Title
- List of items
- Title background rectangle
- List symbols (circle, rectangle, star)

Therefore, we need to use a variety of custom elements:

- The title corresponds to the [text](../../option/ListTable#customRender.elements.text.type) type
- The text part of the item list uses [text](../../option/ListTable#customRender.elements.text.type)
- The title background rectangle uses [rect](../../option/ListTable#customRender.elements.rect.type) element
- List symbols (circle, rectangle, star) correspond to [circle](../../option/ListTable#customRender.elements.circle.type), [rect](../../option/ListTable#customRender.elements.rect.type), [icon](../../option/ListTable#customRender.elements.icon.type) types respectively

### How to Use Custom Rendering Interface

In VTable, we can define custom rendering in the following two ways:

- `customRender` for global custom rendering settings, recommended if the layout of each column is basically consistent;
- `columns.customRender` for column-specific custom rendering, recommended if the layout of each column is different;

The configuration content supports two forms:

- Object form
- Function form, which can return different results combined with business logic

For specific parameter descriptions, refer to the API documentation [customRender](https://visactor.io/vtable/option/ListTable#customRender.elements)

From the example effect diagram above, it can be seen that the layouts of the `urgency` and `not urgency` columns are consistent, so here I adopt the global setting method.

```javascript livedemo  template=vtable
const option = {
  columns: [
    {
      field: 'type',
      title: '',
      width: 170,
      headerStyle: {
        bgColor: '#a23be1'
      },
      style: {
        fontFamily: 'Arial',
        fontWeight: 600,
        bgColor: '#a23be1',
        fontSize: 26,
        padding: 20,
        lineHeight: 32,
        color: 'white'
      }
    },
    {
      field: 'urgency',
      title: 'urgency',
      width: 400,
      headerStyle: {
        lineHeight: 50,
        fontSize: 26,
        fontWeight: 600,
        bgColor: '#a23be1',
        color: 'white',
        textAlign: 'center'
      }
    },
    {
      field: 'not_urgency',
      title: 'not urgency',
      width: 400,
      headerStyle: {
        lineHeight: 50,
        bgColor: '#a23be1',
        color: 'white',
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 600
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  ],
  records: [
    {
      type: 'important',
      urgency: ['crisis', 'urgent problem', 'tasks that must be completed within a limited time'],
      not_urgency: [
        'preventive measures',
        'development relationship',
        'identify new development opportunities',
        'establish long-term goals'
      ]
    },
    {
      type: 'Not\nimportant',
      urgency: ['Receive visitors', 'Certain calls, reports, letters, etc', 'Urgent matters', 'Public activities'],
      not_urgency: [
        'Trivial busy work',
        'Some letters',
        'Some phone calls',
        'Time-killing activities',
        'Some pleasant activities'
      ]
    }
  ],
  defaultRowHeight: 80,
  autoRowHeight: true,
  widthMode: 'standard',
  autoWrapText: true,
  customRender(args) {
    if (args.row === 0 || args.col === 0) return null;
    console.log(args);
    const { width, height } = args.rect;
    const { dataValue, table, row, col } = args;
    const elements = [];
    let top = 30;
    const left = 15;
    let maxWidth = 0;
    elements.push({
      type: 'rect',
      fill: '#a23be1',
      x: left + 20,
      y: top - 20,
      width: 300,
      height: 28
    });
    elements.push({
      type: 'text',
      fill: 'white',
      fontSize: 20,
      fontWeight: 500,
      textBaseline: 'middle',
      text:
        col === 1
          ? row === 1
            ? 'important & urgency'
            : 'not important but urgency'
          : row === 1
          ? 'important but not urgency'
          : 'not important & not urgency',
      x: left + 50,
      y: top - 5
    });
    dataValue.forEach((item, i) => {
      top += 35;
      if (col == 1) {
        if (row === 1)
          elements.push({
            type: 'icon',
            svg: '<svg t="1687586728544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1480" width="200" height="200"><path d="M576.4 203.3c46.7 90.9 118.6 145.5 215.7 163.9 97.1 18.4 111.5 64.9 43.3 139.5s-95.6 162.9-82.3 265.2c13.2 102.3-24.6 131-113.4 86.2s-177.7-44.8-266.6 0-126.6 16-113.4-86.2c13.2-102.3-14.2-190.7-82.4-265.2-68.2-74.6-53.7-121.1 43.3-139.5 97.1-18.4 169-73 215.7-163.9 46.6-90.9 93.4-90.9 140.1 0z" fill="#733FF1" p-id="1481"></path></svg>',
            x: left - 6,
            y: top - 6,
            width: 12,
            height: 12
          });
        else
          elements.push({
            type: 'circle',
            stroke: '#000',
            fill: 'yellow',
            x: left,
            y: top,
            radius: 3
          });
      } else {
        elements.push({
          type: 'rect',
          stroke: '#000',
          fill: 'blue',
          x: left - 3,
          y: top - 3,
          width: 6,
          height: 6
        });
      }
      elements.push({
        type: 'text',
        fill: 'blue',
        font: '14px sans-serif',
        baseline: 'top',
        text: item,
        x: left + 10,
        y: top + 5
      });
      maxWidth = Math.max(maxWidth, table.measureText(item, { fontSize: '15' }).width);
    });
    return {
      elements,
      expectedHeight: top + 20,
      expectedWidth: maxWidth + 20
    };
  }
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

## Custom Rendering for Header Cells

To customize the rendering of header cells, you can use `columns.headerCustomRender`. Its usage is similar to `columns.customRender`.

## Custom Rendering for Body Cells

The demo mentioned above, `customRender`, is for custom rendering of body cells.

## Auto Layout Usage

In some scenarios, we want the custom-rendered elements to automatically layout to fit the cell size. Or, if you prefer to layout in a more flexible way, using an approach closer to html/react for coding, then you can refer to the tutorial [Custom Rendering Auto Layout](../custom_define/custom_layout).
