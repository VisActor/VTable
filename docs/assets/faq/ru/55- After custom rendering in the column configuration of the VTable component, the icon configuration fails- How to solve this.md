---
заголовок: 33. After пользовательский rendering в the column configuration из the Vтаблица компонент, the иконка configuration fails. How к solve this?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

After пользовательский rendering в the column configuration из the Vтаблица компонент, the иконка configuration fails. How к solve this?</br>
## Problem Description

We have used the пользовательскиймакет или пользовательскийRender configuration для пользовательский rendering в business scenarios, but we also want к use the иконка Кнопка иконка feature из Vтаблица itself. However, after both configurations are включен, the иконка does не display correctly. Is there любой way к make both configurations work properly?</br>
As shown below, only the content из пользовательскийRender is displayed. The иконка configuration иконка is не displayed.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BloSbz1VaoStC5xeL28coNMnnFc.gif' alt='' ширина='2512' высота='522'>

## Solution

Вы можете solve this problem по using renderDefault из the пользовательский rendering configuration.</br>
However, after configuration, you may find unwanted content being drawn.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KOTybyej9oA4sExlrxzcBESZnlb.gif' alt='' ширина='832' высота='366'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OmiNbNeMdoRVevxjTPxczxWanKf.gif' alt='' ширина='2446' высота='628'>

к solve this problem, Вы можете use полеFormat к directly возврат an empty значение с this пользовательский функция, so that the по умолчанию текст content will не be drawn.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/QNyOb8RFfхорошоdLbxpPl5c7KMwnR6.gif' alt='' ширина='1978' высота='396'>

## код примеры

Вы можете paste it into the official editor для testing:</br>
https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-render</br>
```
const option = {
    columns:[
    {
      поле: 'not_urgency',
      заголовок:'не urgency',
      ширина:400,
      headerStyle:{
          lineвысота:50,
          bgColor:'#4991e3',
          цвет:'white',
          textAlign:'центр',
          fontSize:26,
          fontWeight:600,
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      },
      полеFormat:()=>'',
      иконка:{
              имя: 'detail',
              тип: 'svg',
              svg: `<svg t="1710211168958" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3209" xmlns:xlink="http://www.w3.org/1999/xlink" ширина="200" высота="200"><path d="M722.944 256l-153.6 153.6c-3.072 3.072-5.12 6.656-7.168 10.24-1.536 4.096-2.56 8.192-2.56 12.288v1.536c0 4.096 1.024 7.68 2.56 11.264 1.536 3.584 3.584 6.656 6.656 9.728 3.072 3.072 6.656 5.12 10.24 7.168 4.096 1.536 8.192 2.56 12.288 2.56 4.096 0 8.192-1.024 12.288-2.56 4.096-1.536 7.168-4.096 10.24-7.168l153.6-153.6v114.688c0 2.048 0 4.096 0.512 6.144 0.512 2.048 1.024 4.096 2.048 6.144 1.024 2.048 1.536 3.584 3.072 5.632 1.024 1.536 2.56 3.584 4.096 4.608 1.536 1.536 3.072 2.56 4.608 4.096 1.536 1.024 3.584 2.048 5.632 3.072 2.048 1.024 4.096 1.536 6.144 2.048 2.048 0.512 4.096 0.512 6.144 0.512 2.048 0 4.096 0 6.144-0.512 2.048-0.512 4.096-1.024 6.144-2.048 2.048-1.024 3.584-1.536 5.632-3.072 1.536-1.024 3.584-2.56 4.608-4.096 1.536-1.536 2.56-3.072 4.096-4.608 1.024-1.536 2.048-3.584 3.072-5.632 1.024-2.048 1.536-4.096 2.048-6.144 0.512-2.048 0.512-4.096 0.512-6.144V223.744c0-4.096-1.024-8.192-2.56-12.288-1.536-4.096-4.096-7.168-7.168-10.24h-0.512c-3.072-3.072-6.656-5.12-10.24-6.656-4.096-1.536-7.68-2.56-12.288-2.56h-192c-2.048 0-4.096 0-6.144 0.512-2.048 0.512-4.096 1.024-6.144 2.048-2.048 1.024-3.584 1.536-5.632 3.072-1.536 1.024-3.584 2.56-4.608 4.096-1.536 1.536-2.56 3.072-4.096 4.608-1.024 1.536-2.048 3.584-3.072 5.632-1.024 2.048-1.536 4.096-2.048 6.144-0.512 2.048-0.512 4.096-0.512 6.144s0 4.096 0.512 6.144c0.512 2.048 1.024 4.096 2.048 6.144 1.024 2.048 1.536 3.584 3.072 5.632 1.024 1.536 2.56 3.584 4.096 4.608 1.536 1.536 3.072 2.56 4.608 4.096 1.536 1.024 3.584 2.048 5.632 3.072 2.048 1.024 4.096 1.536 6.144 2.048 2.048 0.512 4.096 0.512 6.144 0.512h115.712z m-268.288 358.4l-153.6 153.6h114.688c2.048 0 4.096 0 6.144 0.512 2.048 0.512 4.096 1.024 6.144 2.048 2.048 1.024 3.584 1.536 5.632 3.072 1.536 1.024 3.584 2.56 4.608 4.096 1.536 1.536 2.56 3.072 4.096 4.608 1.024 1.536 2.048 3.584 3.072 5.632 1.024 2.048 1.536 4.096 2.048 6.144 0.512 2.048 0.512 4.096 0.512 6.144 0 2.048 0 4.096-0.512 6.144-0.512 2.048-1.024 4.096-2.048 6.144-1.024 2.048-1.536 3.584-3.072 5.632-1.024 1.536-2.56 3.584-4.096 4.608-1.536 1.536-3.072 2.56-4.608 4.096-1.536 1.024-3.584 2.048-5.632 3.072-2.048 1.024-4.096 1.536-6.144 2.048-2.048 0.512-4.096 0.512-6.144 0.512H224.256c-2.048 0-4.096 0-6.144-0.512-2.048-0.512-4.096-1.024-6.144-2.048-2.048-1.024-3.584-1.536-5.632-3.072-1.536-1.024-3.584-2.56-4.608-4.096-1.536-1.536-2.56-3.072-4.096-4.608-1.024-1.536-2.048-3.584-3.072-5.632-1.024-2.048-1.536-4.096-2.048-6.144-0.512-2.048-0.512-4.096-0.512-6.144v-192.512c0-2.048 0-4.096 0.512-6.144 0.512-2.048 1.024-4.096 2.048-6.144 1.024-2.048 1.536-3.584 3.072-5.632 1.024-1.536 2.56-3.584 4.096-4.608 1.536-1.536 3.072-2.56 4.608-4.096 1.536-1.024 3.584-2.048 5.632-3.072 2.048-1.024 4.096-1.536 6.144-2.048 2.048-0.512 4.096-0.512 6.144-0.512s4.096 0 6.144 0.512c2.048 0.512 4.096 1.024 6.144 2.048 2.048 1.024 3.584 1.536 5.632 3.072 1.536 1.024 3.584 2.56 4.608 4.096 1.536 1.536 2.56 3.072 4.096 4.608 1.024 1.536 2.048 3.584 3.072 5.632 1.024 2.048 1.536 4.096 2.048 6.144 0.512 2.048 0.512 4.096 0.512 6.144v114.688l153.6-153.6c3.072-3.072 6.656-5.12 10.24-7.168 4.096-1.536 8.192-2.56 12.288-2.56 4.096 0 8.192 1.024 12.288 2.56 4.096 1.536 7.168 3.584 10.24 6.656h0.512c3.072 3.072 5.12 6.656 7.168 10.24 1.536 4.096 2.56 8.192 2.56 12.288 0 4.096-1.024 8.192-2.56 12.288-3.072 5.12-5.12 8.704-8.192 11.264z" p-id="3210" fill="#999999"></path></svg>`,
              marginRight: 8,
              positionType: Vтаблица.TYPES.иконкаPosition.absoluteRight,
              ширина: 16,
              высота: 16,
              cursor: 'pointer',
              visibleTime: 'mouseenter_cell',
              funcType: 'record_detail',
              Подсказка: {
                заголовок:'展开详情',
                style: {
                  fontSize: 12,
                  заполнение: [8, 8, 8, 8],
                  bgColor: '#46484a',
                  arrowMark: true,
                  цвет: 'white',
                  maxвысота: 100,
                  maxширина: 200
                },
                placement: Vтаблица.TYPES.Placement.верх
              }
            },
      пользовательскийRender(args){
        const { ширина, высота}= args.rect;
        const {данныеValue,таблица,row} =args;
        const elements=[];
        let верх=30;
        const лево=15;
        let maxширина=0;
          elements.push({
            тип: 'текст',
            fill: 'red',
            fontSize: 20,
            fontWeight: 500, 
            textBaseline: 'середина',
            текст: row===1? 'important but не urgency':'не important и не urgency',
            x: лево+50,
            y: верх-5,
          });
        возврат {
          elements,
          expectedвысота:верх+20,
          expectedширина: 300,
          renderDefault:true
        }
      }
    }, 
    ],
    records:[
      {
        'тип': 'important',
        "urgency": ['crisis','urgent problem','tasks that must be completed within a limited time'],
        "not_urgency": ['prсобытиеive measures','development relationship','identify новый development opportunities','establish long-term goals'],
      },
      {
        'тип': 'не\nimportant',
        "urgency": ['Receive visitors','Certain calls, reports, letters, etc','Urgent matters','Public activities'],
        "not_urgency": ['Trivial busy work','некоторые letters','некоторые phone calls','Time-killing activities','некоторые pleasant activities'],
      },
    ],
    defaultRowвысота:80,
    высотаMode:'автовысота',
    ширинаMode:'standard',
    автоWrapText:true,
  };
  
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;</br>
```
## Relevant Documents

Related апи: [https://visactor.io/vтаблица/option/списоктаблица-columns-текст#пользовательскийRender.renderDefault](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Foption%2Fсписоктаблица-columns-текст%23пользовательскийRender.renderDefault)</br>
Tutorial：https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-render</br>
github：https://github.com/VisActor/Vтаблица</br>

