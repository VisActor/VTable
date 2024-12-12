---
category: examples
group: Business
title: 信息查询系统
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/information.png
link: custom_define/custom_icon
---

# 信息查询系统

查询商品订单信息。

## 关键配置

- `headerType`及`cellType` chechbox 复选框类型
- `getCheckboxState` 获取某个字段下 checkbox 的选中状态
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
VTable.register.icon('freeze', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/freeze.svg',
  width: 22,
  height: 22,
  name: 'freeze',
  funcType: VTable.TYPES.IconFuncTypeEnum.freeze,
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
  cursor: 'pointer',
  tooltip: {
    style: {
      bgColor: 'gray',
      fontSize: 16
    },
    // 气泡框，按钮的的解释信息
    title: '点击可复制',
    placement: VTable.TYPES.Placement.top
  }
});

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: '',
        title: '',
        width: 50,
        cellType: 'checkbox',
        headerType: 'checkbox'
      },
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
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
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
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
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
            color: 'blue',
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
            color: 'blue',
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
      frozenColCount: 2,
      rightFrozenColCount: 1
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
        }
      }
    });
  });
```
