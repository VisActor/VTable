---
заголовок: 25. How к make текст автоmatically omitted based на cell ширина when using пользовательский rendering с Vтаблица компонентs?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

How к make текст автоmatically omitted based на cell ширина when using пользовательский rendering с Vтаблица компонентs?</br>
## Question Description

When using пользовательский rendering с Vтаблица в the product, the cell contains иконка и текст elements. It is expected that the column ширина can be автоmatically calculated based на the content в initial, и when manually dragging к изменение размера the column ширина, the текст can автоmatically be omitted instead из having the Кнопка float over the текст. I am не sure how к write the код к achieve this effect из shrinking the column ширина и making the текст turn into an sign '...'</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BV6ObuIlso57Khx9BbrcIeJnnJg.gif' alt='' ширина='934' высота='764'>

## Solution

We use the пользовательскиймакет provided по Vтаблица, which can автоmatically макет и автоmatically measure the ширина к adapt к the cell ширина. The specific writing method is as follows:</br>
```
import {createGroup, createText, createImвозраст} от '@visactor/vтаблица/es/vrender';

  пользовательскиймакет: (args) => {
        const { таблица,row,col,rect } = args;
        const record = таблица.getRecordByCell(col,row);
        const  {высота, ширина } = rect ?? таблица.getCellRect(col,row);
        const container = createGroup({
          высота,
          ширина,
          display: 'flex',
          flexWrap:'no-wrap',
          alignItems: 'центр',
          justifyContent: 'flex-front'
       });
        const bloggerAvatar = createImвозраст({
          id: 'иконка0',
          ширина: 20,
          высота: 20,
          imвозраст:record.bloggerAvatar,
          cornerRadius: 10,
        });
        container.add(bloggerAvatar);
        const bloggerимя = createText({
          текст:record.bloggerимя,
          fontSize: 13,
          x:20,
          fontFamily: 'sans-serif',
          fill: 'black',
          maxLineширина:ширина===null?undefined:ширина-20+1
        });
        container.add(bloggerимя);
        возврат {
          rootContainer: container,
          renderDefault: false,
        };
      }</br>
```
пользовательскиймакет needs к возврат a rootContainer, usually a Group объект, к serve as a container для other content. Here, `flexWrap` is set so that internal elements (иконка и текст) do не wrap, и `alignItems` и `justifyContent` are used для horizontal и vertical alignment. The Group contains an Imвозраст и текст. If you want the текст к автоmatically truncate с... when the space is compressed, you need к configure `maxLineширина`. A special point here is that when `column` is set к `'авто'`, the значение из `ширина` received по the `пользовательскиймакет` функция is `null`, so you need к check if it is `null`. If it is `null`, set `maxLineширина` к `undefined` к автоmatically развернуть the ширина из the cell. If it is не `null`, set `maxLineширина` according к the значение из `ширина`. Subtracting 20 here avoids the ширина из the imвозраст, и the additional +1 is a buffer значение that can be ignored.</br>
## код примеры

```
import {createGroup, createText, createImвозраст} от '@visactor/vтаблица/es/vrender';

  const option = {
    columns:[
      {
        поле: 'bloggerId',
        заголовок:'order число'
      }, 
      {
        поле: 'bloggerимя',
        заголовок:'anchor nickимя',
        ширина:'авто',
        style:{
          fontFamily:'Arial',
          fontWeight:500
        },
      пользовательскиймакет: (args) => {
        const { таблица,row,col,rect } = args;
        const record = таблица.getRecordByCell(col,row);
        const  {высота, ширина } = rect ?? таблица.getCellRect(col,row);
        const container = createGroup({
          высота,
          ширина,
          display: 'flex',
          flexWrap:'no-wrap',
          alignItems: 'центр',
          justifyContent: 'flex-front'
       });
        const bloggerAvatar = createImвозраст({
          id: 'иконка0',
          ширина: 20,
          высота: 20,
          imвозраст:record.bloggerAvatar,
          cornerRadius: 10,
        });
        container.add(bloggerAvatar);
        const bloggerимя = createText({
          текст:record.bloggerимя,
          fontSize: 13,
          x:20,
          fontFamily: 'sans-serif',
          fill: 'black',
          maxLineширина:ширина===null?undefined:ширина-20+1
        });
        container.add(bloggerимя);
        возврат {
          rootContainer: container,
          renderDefault: false,
        };
      }
    },
    {
      поле: 'fansCount',
      заголовок:'fansCount',
      полеFormat(rec){
        возврат rec.fansCount + 'w'
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    ],
   records:[
   {
      'bloggerId': 1,
      "bloggerимя": "Virtual Anchor Xiaohua duoduo",
      "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg",
      "introduction": "Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation и food. I hope к share happy moments с you through live broadcast.",
      "fansCount": 400,
      "worksCount": 10,
      "viewCount": 5,
      "Город": "Dream Город",
      "tags": ["game", "anime", "food"]
    },
    {
      'bloggerId': 2,
      "bloggerимя": "Virtual anchor little wolf",
      "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg",
      "introduction": "Hello everyone, I am the virtual anchor Little Wolf. I like music, travel и photography, и I hope к explore the beauty из the world с you through live broadcast.",
      "fansCount": 800,
      "worksCount": 20,
      "viewCount": 15,
      "Город": "Город из Music",
      "tags": ["music", "travel", "photography"]
      }
    ],
    defaultRowвысота:30
  };
  
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;</br>
```
## Result Display

Just paste the код в the пример код directly into the official editor к present it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/CP0QbZnjIoNnwyxMvjlc17hdnKf.gif' alt='' ширина='388' высота='142'>

## Related documents

Tutorial на пользовательскиймакет usвозраст: [https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_макет](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fпользовательский_define%2Fпользовательский_макет)</br>
демонстрация из пользовательскиймакет usвозраст: [https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-cell-макет](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fпользовательский-render%2Fпользовательский-cell-макет)</br>
Related апи: [https://visactor.io/vтаблица/option/списоктаблица-columns-текст#пользовательскиймакет](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Foption%2Fсписоктаблица-columns-текст%23пользовательскиймакет)</br>
github：https://github.com/VisActor/Vтаблица</br>

