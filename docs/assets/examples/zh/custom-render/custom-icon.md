---
category: examples
group: Custom
title: 自定义图标
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-icon.png
order: 7-2
link: '/guide/custom_define/custom_icon'
---

# 自定义图标

在单元格中显示图标内容

## 关键配置

 - `VTable.register.icon`  注册自定义的icon 可以配合columns[x].icon或者columns[x].headerIcon 使用。或者重置内部的图标

内置功能图标名称具体有：
`
'sort_upward',
'sort_downward',
'sort_normal',
'frozen',
'frozen',
'frozenCurrent',
'dropdownIcon',
'dropdownIcon_hover',
'expand',
'collapse',
`
## 代码演示

```javascript livedemo template=vtable

VTable.register.icon('frozen',{
      type: 'svg',
      svg:
       "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/frozen.svg",
      width: 22,
      height: 22,
      name: 'frozen',
      funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
  VTable.register.icon('frozenCurrent',{
      type: 'svg',
      svg:
        "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/frozenCurrent.svg",
      width: 22,
      height: 22,
      name: 'frozenCurrent',
      funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );


VTable.register.icon('frozen',{
      type: 'svg',
      svg:
        "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/frozen.svg",
      width: 22,
      height: 22,
      name: 'frozen',
      funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
  
  VTable.register.icon('order',{
      type: 'svg',
      svg:
        "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg",
      width: 22,
      height: 22,
      name: 'order',
      positionType: VTable.TYPES.IconPosition.left,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto",
        icon: 'order'
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto"
    },
    {
        "field": "Category",
        "title": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "title": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "width": "auto"
    },
    {
      field: '2234',
      title: 'single line',
      width:120,
      icon: [
          {
            name: 'edit',
            type: 'svg',
            marginLeft: 10,
            color: 'blue',
            positionType: VTable.TYPES.IconPosition.left,
            width:20,
            height:20,
            svg:"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/edit.svg",
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '编辑',
              placement: VTable.TYPES.Placement.right,
            },
          },
          {
            name: 'delete',
            type: 'svg',
            marginLeft: 20,
            color: 'blue',
            positionType: VTable.TYPES.IconPosition.left,
            width:20,
            height:20,
            svg:"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/delete.svg",
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '删除',
              placement: VTable.TYPES.Placement.right,
            },
          }
        ],
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  allowFrozenColCount: 3,
  frozenColCount: 1,
  rightFrozenColCount:1
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
