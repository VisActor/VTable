---
заголовок: 18. Can the Vтаблица компонент achieve different навести colors для different cells?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

Can the Vтаблица компонент achieve different навести colors для different cells?</br>
## Question Description

Can different cells have different навести colors?</br>
Use case: по по умолчанию, the навести цвет is set к blue. Under certain conditions, некоторые cells are highlighted в purple. However, the requirement is that when hovering over the highlighted cells, they should не change к the навести blue цвет.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cv2GbY7Ihoxmnax0PnWcTJ29n2f.gif' alt='' ширина='626' высота='526'>

## Solution

It can be solved по the фон цвет функция. Set `bgColor` as a функция к set the highlight фон цвет для special values. Set the фон цвет through `тема.bodyStyle.навести.cellBgColor`, which also needs к be set as a функция к возврат different фон colors. If некоторые cells do не want a фон цвет, an empty строка can be returned.</br>


## код пример

```
let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
    {
        "поле": "Прибыль",
        "title": "Прибыль",
        "ширина": "авто",
        style:{
            bgColor(args){
                if(args.значение>200){
                    возврат 'rgba(153,0,255,0.2)'
                }
                // 以下代码参考DEFAULT主题配置实现 https://github.com/VisActor/Vтаблица/blob/develop/packвозрастs/vтаблица/src/темаs/по умолчанию.ts
                const { col,row, таблица } = args;
                const {row:index} = таблица.getBodyIndexByтаблицаIndex(col,row);
                if (!(index & 1)) {
                    возврат '#FAF9FB';
                }
                возврат '#FDFDFD';
            }
        }
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
        "ширина": "авто"
    }
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  навести:{
    highlightMode:'cell'
  },
  тема:Vтаблица.темаs.по умолчанию.extends({
    bodyStyle:{
      навести:{
        cellBgColor(args){
          if(args.значение>200){
              возврат ''
          }
          возврат '#CCE0FF';
        }
      }
    }
  })
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
})</br>
```
## Result Display

Just paste the код в the пример directly into the official editor к display it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/X5whb5D2gontykxAt4DchKtUnnf.gif' alt='' ширина='824' высота='524'>

## Relevant Documents

тема Usвозраст Reference демонстрация:https://visactor.io/vтаблица/демонстрация/тема/extend</br>
тема Usвозраст Tutorial：https://visactor.io/vтаблица/guide/тема_and_style/тема</br>
Related апи：https://visactor.io/vтаблица/option/списоктаблица#тема</br>
github：https://github.com/VisActor/Vтаблица</br>

