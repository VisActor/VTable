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

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto",
        icon: 'order'
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
        "width": "auto"
    },
    {
        "field": "230517143221023",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "230517143221037",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "230517143221024",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "230517143221029",
        "caption": "Order Date",
        "width": "auto"
    },
    {
      field: '2234',
      caption: 'single line',
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
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  columns,
  widthMode:'standard',
  allowFrozenColCount: 3,
  frozenColCount: 1,
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
