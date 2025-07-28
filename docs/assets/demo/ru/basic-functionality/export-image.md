---
категория: примеры
группа: базовый возможности
заголовок: Export imвозраст
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/export-imвозраст.png
---

#Export Imвозраст

Export imвозраст из the видимый area из the таблица, или export a picture из a certain area или cells

## Ключевые Конфигурации

 - `exportImg`
 - `exportCellImg`
 - `exportCellRangeImg`
 
## код демонстрация

```javascript liveдемонстрация template=vтаблица
const графикDiv=document.getElementById(CONTAINER_ID);
// Create a container div для the Кнопкаs
const КнопкаContainer = document.createElement("div");
КнопкаContainer.style.позиция = "absolute";
КнопкаContainer.style.верх = "0";
КнопкаContainer.style.zIndex=88888;

//Create the первый Кнопка
const screenshotBtn = document.createElement("Кнопка");
screenshotBtn.textContent = "exportImg";

//Create the second Кнопка
const export1ImgBtn = document.createElement("Кнопка");
export1ImgBtn.textContent = "exportImg[2,2]";

//Create the third Кнопка
const export2ImgBtn = document.createElement("Кнопка");
export2ImgBtn.textContent = "exportImg[2,2] к [4,3]";

const clearImgBtn = document.createElement("Кнопка");
clearImgBtn.textContent = "clear export imвозраст";

//Append the Кнопкаs к the container div
КнопкаContainer.appendChild(screenshotBtn);
КнопкаContainer.appendChild(export1ImgBtn);
КнопкаContainer.appendChild(export2ImgBtn);
КнопкаContainer.appendChild(clearImgBtn);
screenshotBtn.onНажать=export1ImgBtn.onНажать=export2ImgBtn.onНажать=(e)=>{
  const imвозрастDom=document.createElement('img');
  let base64String;
  if(e.target.textContent==='exportImg'){
    imвозрастDom.style.ширина='140px';
    imвозрастDom.style.высота='100px';
    base64String=таблицаInstance.exportImg();
  }else if(e.target.textContent==='exportImg[2,2]')
    base64String=таблицаInstance.exportCellImg(2,2);
  else
    base64String=таблицаInstance.exportCellRangeImg({начало:{col:2,row:2},конец:{col:4,row:3}});

  imвозрастDom.style.display='block';
  imвозрастDom.src=base64String;
  КнопкаContainer.appendChild(imвозрастDom);
}
clearImgBtn.onНажать=(e)=>{
  // Get все img tags under the target div
  const imgElements = КнопкаContainer.getElementsByTagимя("img");

  // Iterate through все img tags и remove them
  while (imgElements. length > 0) {
    const imgElement = imgElements[0]; // Get the первый img tag
    imgElement.parentNode.removeChild(imgElement); // Remove img tag от parent node
  }
}

// Insert the container div into the график div
графикDiv.parentElement.appendChild(КнопкаContainer);

let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные100.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
  {
        "поле": "Категория",
        "title": "Категория",
        "ширина": "авто",
        сортировка:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'право'
        }
    },
    {
        "поле": "Sub-Категория",
        "title": "Sub-Категория",
        "ширина": "авто",
        сортировка:true,
        "mergeCell": true,
    },
    {
        "поле": "ID Заказа",
        "title": "ID Заказа",
        "ширина": "авто"
    },
    {
        "поле": "пользовательскийer ID",
        "title": "пользовательскийer ID",
        "ширина": "авто"
    },
    {
        "поле": "Product имя",
        "title": "Product имя",
        "ширина": "авто",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "поле": "Регион",
        "title": "Регион",
        "ширина": "авто"
    },
    {
        "поле": "Город",
        "title": "Город",
        "ширина": "авто"
    },
    {
        "поле": "Дата Заказа",
        "title": "Дата Заказа",
        "ширина": "авто"
    },
    {
        "поле": "Количество",
        "title": "Количество",
        "ширина": "авто"
    },
    {
        "поле": "Продажи",
        "title": "Продажи",
        "ширина": "авто"
    },
    {
        "поле": "Прибыль",
        "title": "Прибыль",
        "ширина": "авто"
    }
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  навести:{
    highlightMode:'row'
  },
  сортировкаState:{
    поле:'Категория',
    порядок:'asc'
  }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })
```
