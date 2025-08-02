---
категория: примеры
группа: Основные Функции
заголовок: Export image
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/export-image.png
---

#Export Image

Export image of the visible area of the table, or export a picture of a certain area or cells

## Ключевые Конфигурации

 - `exportImg`
 - `exportCellImg`
 - `exportCellRangeImg`
 
## Code Demo

```javascript livedemo template=vtable
const chartDiv=document.getElementById(CONTAINER_ID);
// Create a container div for the buttons
const buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.top = "0";
buttonContainer.style.zIndex=88888;

//Create the first button
const screenshotBtn = document.createElement("button");
screenshotBtn.textContent = "exportImg";

//Create the second button
const export1ImgBtn = document.createElement("button");
export1ImgBtn.textContent = "exportImg[2,2]";

//Create the third button
const export2ImgBtn = document.createElement("button");
export2ImgBtn.textContent = "exportImg[2,2] to [4,3]";

const clearImgBtn = document.createElement("button");
clearImgBtn.textContent = "clear export image";

//Append the buttons to the container div
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
  // Get all img tags under the target div
  const imgElements = buttonContainer.getElementsByTagName("img");

  // Iterate through all img tags and remove them
  while (imgElements. length > 0) {
    const imgElement = imgElements[0]; // Get the first img tag
    imgElement.parentNode.removeChild(imgElement); // Remove img tag from parent node
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
        "field": "Категория",
        "title": "Категория",
        "width": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'right'
        }
    },
    {
        "field": "Sub-Категория",
        "title": "Sub-Категория",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "ИД Заказа",
        "title": "ИД Заказа",
        "width": "auto"
    },
    {
        "field": "ИД Клиента",
        "title": "ИД Клиента",
        "width": "auto"
    },
    {
        "field": "Название Товара",
        "title": "Название Товара",
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "field": "Регион",
        "title": "Регион",
        "width": "auto"
    },
    {
        "field": "Город",
        "title": "Город",
        "width": "auto"
    },
    {
        "field": "Дата Заказа",
        "title": "Дата Заказа",
        "width": "auto"
    },
    {
        "field": "Количество",
        "title": "Количество",
        "width": "auto"
    },
    {
        "field": "Продажи",
        "title": "Продажи",
        "width": "auto"
    },
    {
        "field": "Прибыль",
        "title": "Прибыль",
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
    field:'Категория',
    order:'asc'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
