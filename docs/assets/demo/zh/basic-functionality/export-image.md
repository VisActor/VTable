---
category: examples
group: Basic Features
title: 导出图片
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/export-image.png
---

# 导出图片

导出表格可视区图片，或者导出某个或者某一区域单元格的图片

## 关键配置

 - `exportImg`
 - `exportCellImg`
 - `exportCellRangeImg`
 
## 代码演示

```javascript livedemo template=vtable
const chartDiv=document.getElementById(CONTAINER_ID);
// Create a container div for the buttons
const buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.top = "0";
buttonContainer.style.zIndex=88888;

// Create the first button
const screenshotBtn = document.createElement("button");
screenshotBtn.textContent = "exportImg";

// Create the second button
const export1ImgBtn = document.createElement("button");
export1ImgBtn.textContent = "exportImg[2,2]";

// Create the third button
const export2ImgBtn = document.createElement("button");
export2ImgBtn.textContent =  "exportImg[2,2]到[4,3]";

const clearImgBtn = document.createElement("button");
clearImgBtn.textContent =  "clear export image";

// Append the buttons to the container div
buttonContainer.appendChild(screenshotBtn);
buttonContainer.appendChild(export1ImgBtn);
buttonContainer.appendChild(export2ImgBtn);
buttonContainer.appendChild(clearImgBtn);
screenshotBtn.onclick=export1ImgBtn.onclick=export2ImgBtn.onclick=(e)=>{
  const imageDom=document.createElement('img');
  let base64String;
  if(e.target.textContent==='exportImg'){
    imageDom.style.width='140px';
    imageDom.style.height='100px';
    base64String=tableInstance.exportImg();
  }else if(e.target.textContent==='exportImg[2,2]')
    base64String=tableInstance.exportCellImg(2,2);
  else 
    base64String=tableInstance.exportCellRangeImg({start:{col:2,row:2},end:{col:4,row:3}});

  imageDom.style.display='block';
  imageDom.src=base64String;
  buttonContainer.appendChild(imageDom);
}
clearImgBtn.onclick=(e)=>{
  // 获取目标 div 下的所有 img 标签
  const imgElements = buttonContainer.getElementsByTagName("img");

  // 遍历所有的 img 标签并移除它们
  while (imgElements.length > 0) {
    const imgElement = imgElements[0]; // 获取第一个 img 标签
    imgElement.parentNode.removeChild(imgElement); // 从父节点中移除 img 标签
  }
}

// Insert the container div into the chart div
chartDiv.parentElement.appendChild(buttonContainer);

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Category",
        "title": "Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'right'
        }
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
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
        "field": "Quantity",
        "title": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  hover:{
    highlightMode:'row'
  },
  sortState:{
    field:'Category',
    order:'asc'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
