# 自定义渲染

在数据分析领域，为了更直观地展示数据，我们经常会使用图表或格来呈现。而在某些特定场景下，我们希望为表格的某些单元格添加更富有表现力和个性化的展示效果。这时，表格单元格内容自定义渲染功能就显得尤为重要。通过单元格内容自定义渲染，我们可以实现以下几类场景需求：

1. 富文本展示。在单元格内展示具有多种样式和排布的文本，方便用户快速获取关键信息。

2. 图文混排。在单元格内根据数据展示图片或图标，使得数据更直观。

3. 图形化展示数据。以图形化方式来展示数据，如圆形，矩形等，使数据比较和分析更直观。

4. 单元格自定义排版布局。在单元格内任意排列自定义渲染元素，实现特殊布局需求。

在 VTable 库中，我们可以通过定义`表格单元格内容自定义渲染`来实现以上场景需求。因为更具灵活性，可根据业务数据进行定制展示，但对于接入方的成本也较大，需要自己计算位置等。（绘制自定义内容的同时，允许按 VTable 内部逻辑绘制出默认内容，请将 renderDefault 设置为 true。）

## 案例分析

我们接下来以实现下图效果为例来讲解实现过程。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170d.png)

### 准备数据：

上图表格中 body 数据单元格部分一共有两行，对应到我们 records 中的两条数据。

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

### 内容拆解

分析每个单元格的展示内容组成：

- 标题
- 事项列表
- 标题背景矩形
- 列表符号（圆形，矩形，星行）

所以这里我们需要用到多种自定义图元：

- 标题对应使用 [text](../../option/ListTable#customRender.elements.text.type)类型
- 事项列表文字部分使用 [text](../../option/ListTable#customRender.elements.text.type)
- 标题背景矩形使用 [rect](../../option/ListTable#customRender.elements.rect.type)图元
- 列表符号（圆形，矩形，星行）分别对应 [circle](../../option/ListTable#customRender.elements.circle.type)， [rect](../../option/ListTable#customRender.elements.rect.type)， [icon](../../option/ListTable#customRender.elements.icon.type)类型

### 如何使用自定义渲染接口

在 VTable 中，我们可以通过以下两种方式定义自定义渲染：

- `customRender` 全局设置自定义渲染，如果每一列的布局基本一致建议使用全局方式；
- `columns.customRender` 按列设置自定义渲染，如果每一列的布局不同，建议每一列单独配置；

配置内容支持两种形式：

- 对象形式
- 函数形式，可结合业务逻辑返回不同的结果

具体参数说明可参考 API 说明[customRender](https://visactor.io/vtable/option/ListTable#customRender.elements)

从上述示例效果图中可以看出`urgency`和`not urgency`这两列的布局是一致的，所以我这里采用全局设置的方式。

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

## 表头单元格自定义渲染

如果想要对表头单元格进行自定义渲染可以使用 columns.headerCustomRender。用法同 columns.customRender。

## body 单元格自定义渲染

上文讲到的 demo 即 customRender 是对 body 单元格的自定义渲染。

## 自动布局用法

在某些场景下，我们希望自定义渲染的元素能够自动布局，以适应单元格的大小。或者期望使用更灵活的方式来布局，用更接近 html/react 的写法来写代码，那么可以参考教程[自定义渲染自动布局](../custom_define/custom_layout)。
