---
category: examples
group: Custom
title: 全局单元格自定义内容
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-render-global.png
order: 7-3
link: custom_define/custom_render
option: ListTable#customRender.elements
---

# 全局单元格自定义内容

通过全局配置项 customRender，设置自定义函数

## 关键配置

- `customRender` 配置该 API 返回需要渲染的内容

## 代码演示

```javascript livedemo template=vtable
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
  heightMode: 'autoHeight',
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
window['tableInstance'] = tableInstance;
```
