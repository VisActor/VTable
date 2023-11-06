---
category: examples
group: Custom
title: 自定义图标
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-icon.png
order: 7-2
link: '../guide/custom_define/custom_icon'
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
// #region 为自定义弹出框做准备
const container=document.getElementById(CONTAINER_ID);
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

VTable.register.icon('freeze',{
      type: 'svg',
      svg:
       "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/freeze.svg",
      width: 22,
      height: 22,
      name: 'freeze',
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
      // tooltip: {
      //   style: { 
      //     bgColor:'gray',
      //     fontSize:6
      //   },
      //   // 气泡框，按钮的的解释信息
      //   title: '点击可复制',
      //   placement: VTable.TYPES.Placement.top,
      // },
    }
  );

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {
  data.forEach((data,index)=>{
  data['avatar'] ='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/avatar/'+index%10+'.jpeg'
  })
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
        "field": "Customer Name",
        "title": "Customer",
        "width": "auto",
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
          cursor: 'pointer',
      },
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

tableInstance.on('click_cell', args => {
    console.log('click_cell', args);
    const { col, row, targetIcon } = args;
    if(targetIcon){
      if (targetIcon.name === 'edit') {
        window?.alert?.('编辑第 '+( row-tableInstance.columnHeaderLevelCount+1)+' 条数据');
      }else if(targetIcon.name === 'delete'){
        data.splice(row-tableInstance.columnHeaderLevelCount,1);
        tableInstance.setRecords(data);
      }else if(targetIcon.name === 'order'){
        const value=tableInstance.getCellValue(col,row);
        window?.alert?.('已复制订单号： '+value);
      }
    }
})
let hoverIconKey;
tableInstance.on('mousemove_cell', args => {
    console.log('mousemove_cell', args);
    const { col, row, targetIcon } = args;
    if(targetIcon){
       const key = `${col}-${row}-${targetIcon?.name}`;
      if (targetIcon?.name === 'order') {
        if(hoverIconKey !== key){
          hoverIconKey=key;
          tableInstance.showTooltip(col, row, {
            content: 'Click to Copy：'+tableInstance.getCellValue(col,row),
            referencePosition: { rect: targetIcon.position, placement: VTable.TYPES.Placement.right }, //TODO
            style: {
              bgColor: 'black',
              color: 'white',
              font: 'normal bold normal 14px/1 STKaiti',
              arrowMark: true,
            },
          });
        }
      }else if(targetIcon?.name === 'avatar_pic'){
        if(hoverIconKey !== key){
          hoverIconKey=key;
          const cellRange=tableInstance.getCellRelativeRect(col,row);
          const container=document.getElementById(CONTAINER_ID);
          const containerRect=container.getBoundingClientRect();
          // if (!tableInstance.isHeader(col, row)) {
          const record=tableInstance.getCellOriginRecord(col,row);
          showTooltip(['ID: '+record['Customer ID'],'Name: '+record['Customer Name'],'City: '+record['City']], cellRange?.left+containerRect.left, cellRange?.bottom+containerRect.top);
        }
      }else {
        hideTooltip();
      }
    } else {
      hoverIconKey = '';
       hideTooltip();
    }
  }
)
    })
```
