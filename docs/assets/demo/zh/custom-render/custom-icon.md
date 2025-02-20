---
category: examples
group: Custom
title: 自定义图标
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-icon.png
order: 7-2
link: custom_define/custom_icon
---

# 自定义图标

在单元格中显示图标内容。

通过`VTable.register.icon`全局注册图标信息，然后直接在 column 中的 icon 或者 headerIcon 配置注册名称，或者在 icon 或者 headerIcon 配置完整的图标信息

## 关键配置

- `VTable.register.icon` 注册自定义的 icon 可以配合 columns[x].icon 或者 columns[x].headerIcon 使用。或者重置内部的图标

内置功能图标名称具体有：
`'sort_upward',
'sort_downward',
'sort_normal',
'frozen',
'frozen',
'frozenCurrent',
'dropdownIcon',
'dropdownIcon_hover',
'expand',
'collapse',`

## 代码演示

```javascript livedemo template=vtable
// #region 为自定义弹出框做准备
const container = document.getElementById(CONTAINER_ID);
const popup = document.createElement('div');
Object.assign(popup.style, {
  position: 'fixed',
  width: '300px',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
});
function showTooltip(infoList, x, y) {
  popup.innerHTML = '';
  popup.id = 'popup';
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = 'Customer Information:';
  heading.style.margin = '0px';
  popup.appendChild(heading);
  for (let i = 0; i < infoList.length; i++) {
    const info = infoList[i];
    const info1 = document.createElement('p');
    info1.textContent = info;
    popup.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(popup);
}

function hideTooltip() {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}
// #endregion 为自定义弹出框做准备

VTable.register.icon('freeze', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/freeze.svg',
  width: 22,
  height: 22,
  name: 'freeze',
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
VTable.register.icon('frozenCurrent', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/frozenCurrent.svg',
  width: 22,
  height: 22,
  name: 'frozenCurrent',
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

VTable.register.icon('frozen', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/frozen.svg',
  width: 22,
  height: 22,
  name: 'frozen',
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

VTable.register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
  // tooltip: {
  //   style: {
  //     bgColor:'gray',
  //     fontSize:6
  //   },
  //   // 气泡框，按钮的的解释信息
  //   title: '点击可复制',
  //   placement: VTable.TYPES.Placement.top,
  // },
});

VTable.register.icon('text-button', {
  type: 'text',
  content: 'click',
  name: 'text-button',
  positionType: VTable.TYPES.IconPosition.left,
  style: {
    fill: 'red',
    cursor: 'pointer'
  }
});

VTable.register.icon('text-button1', {
  type: 'text',
  content: 'click',
  name: 'text-button',
  positionType: VTable.TYPES.IconPosition.left,
  marginLeft: 10,
  style: {
    cursor: 'pointer',
    fill: 'blue'
  }
});

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach((data, index) => {
      data['avatar'] = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/avatar/' + (index % 10) + '.jpeg';
    });
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto',
        icon: 'order'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Customer Name',
        title: 'Customer',
        width: 'auto',
        icon: {
          type: 'image',
          src: 'avatar',
          name: 'avatar_pic',
          shape: 'circle',
          //定义文本内容行内图标，第一个字符展示
          width: 30, // Optional
          height: 30,
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginRight: 20,
          marginLeft: 0,
          cursor: 'pointer'
        }
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto',
        headerIcon: [
          {
            name: 'question',
            type: 'svg',
            marginLeft: 10,
            positionType: VTable.TYPES.IconPosition.contentRight,
            width: 20,
            height: 20,
            svg: `<svg t="1706853751091" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4226" width="200" height="200"><path d="M533.333333 85.333333c-247.426667 0-448 200.573333-448 448s200.573333 448 448 448 448-200.573333 448-448-200.573333-448-448-448z m0 853.333334c-223.86 0-405.333333-181.473333-405.333333-405.333334s181.473333-405.333333 405.333333-405.333333 405.333333 181.473333 405.333334 405.333333-181.473333 405.333333-405.333334 405.333334z m21.333334-192a21.333333 21.333333 0 1 1-21.333334-21.333334 21.333333 21.333333 0 0 1 21.333334 21.333334z m-21.333334-85.333334a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 6.246667-15.086666c13.1-13.093333 28.9-24.886667 45.633333-37.333334C601.333333 516.966667 640 488.1 640 448c0-58.813333-47.853333-106.666667-106.666667-106.666667s-106.666667 47.853333-106.666666 106.666667a21.333333 21.333333 0 0 1-42.666667 0 149.333333 149.333333 0 0 1 298.666667 0c0 28.113333-10.6 53.873333-32.406667 78.74-17.593333 20.046667-39.593333 36.466667-60.873333 52.34-12.666667 9.453333-24.76 18.473333-34.72 27.433333V640a21.333333 21.333333 0 0 1-21.333334 21.333333z" fill="#5C5C66" p-id="4227"></path></svg>`,
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: 'this is product name',
              placement: VTable.TYPES.Placement.right
            }
          }
        ]
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'null',
        title: 'text icon',
        width: 'auto',
        icon: ['text-button', 'text-button1']
      },
      {
        field: '2234',
        title: 'single line',
        width: 120,
        icon: [
          {
            name: 'edit',
            type: 'svg',
            marginLeft: 10,
            positionType: VTable.TYPES.IconPosition.left,
            width: 20,
            height: 20,
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/edit.svg',
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '编辑',
              placement: VTable.TYPES.Placement.right
            }
          },
          {
            name: 'delete',
            type: 'svg',
            marginLeft: 20,
            positionType: VTable.TYPES.IconPosition.left,
            width: 20,
            height: 20,
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/delete.svg',
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '删除',
              placement: VTable.TYPES.Placement.right
            }
          }
        ]
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      allowFrozenColCount: 3,
      frozenColCount: 1,
      rightFrozenColCount: 2
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

    tableInstance.on('click_cell', args => {
      console.log('click_cell', args);
      const { col, row, targetIcon } = args;
      if (targetIcon) {
        if (targetIcon.name === 'edit') {
          window?.alert?.('编辑第 ' + (row - tableInstance.columnHeaderLevelCount + 1) + ' 条数据');
        } else if (targetIcon.name === 'delete') {
          data.splice(row - tableInstance.columnHeaderLevelCount, 1);
          tableInstance.setRecords(data);
        } else if (targetIcon.name === 'order') {
          const value = tableInstance.getCellValue(col, row);
          window?.alert?.('已复制订单号： ' + value);
        } else if (targetIcon.name === 'question') {
          const value = tableInstance.getCellValue(col, row);
          window?.alert?.('question: ' + value);
        }
      }
    });
    let hoverIconKey;
    tableInstance.on('mousemove_cell', args => {
      console.log('mousemove_cell', args);
      const { col, row, targetIcon } = args;
      if (targetIcon) {
        const key = `${col}-${row}-${targetIcon?.name}`;
        if (targetIcon?.name === 'order') {
          if (hoverIconKey !== key) {
            hoverIconKey = key;
            tableInstance.showTooltip(col, row, {
              content: 'Click to Copy：' + tableInstance.getCellValue(col, row),
              referencePosition: { rect: targetIcon.position, placement: VTable.TYPES.Placement.right }, //TODO
              style: {
                bgColor: 'black',
                color: 'white',
                font: 'normal bold normal 14px/1 STKaiti',
                arrowMark: true
              }
            });
          }
        } else if (targetIcon?.name === 'avatar_pic') {
          if (hoverIconKey !== key) {
            hoverIconKey = key;
            const cellRange = tableInstance.getCellRelativeRect(col, row);
            const container = document.getElementById(CONTAINER_ID);
            const containerRect = container.getBoundingClientRect();
            // if (!tableInstance.isHeader(col, row)) {
            const record = tableInstance.getCellOriginRecord(col, row);
            showTooltip(
              ['ID: ' + record['Customer ID'], 'Name: ' + record['Customer Name'], 'City: ' + record['City']],
              cellRange?.left + containerRect.left,
              cellRange?.bottom + containerRect.top
            );
          }
        } else {
          hideTooltip();
        }
      } else {
        hoverIconKey = '';
        hideTooltip();
      }
    });
  });
```
